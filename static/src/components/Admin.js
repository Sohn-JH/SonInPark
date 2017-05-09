import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { httpManager } from '../managers';

import ModalContainer from './Modal/ModalContainer';
import VideoModal from './Modal/contents/VideoModal';
import { browserHistory } from 'react-router';

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

// constants
import {SERVER_URL} from '../constants';

// sub-components

// action
import {openModalWithContent, updateStudent, useLocalData} from '../actions';

// redux
function mapStateToProps(state) {
    return {
        store: state,
        id: state.dataReducer.id,
        videoList: state.dataReducer.videoList,
        availables: state.dataReducer.availables,
        isLogged: state.dataReducer.isLogged,
        studentList: state.dataReducer.studentList,
        studentId: state.dataReducer.studentId,
    };
}

function mapDispatchToProps(dispatch) {
    return ({
      _openModalWith: (content) => { dispatch(openModalWithContent(content))},
      _updateStudent: (studentId, nickname, available) => {dispatch(updateStudent(studentId, nickname, available))},
      _useLocalData: (contactData) => {dispatch(useLocalData(contactData))},
    });
}

// style
const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

const findLectureInAvailables = (lectureId, availables) => {
    let result = false;
    if(availables){
      availables.map((availableLectureInfo, index) => {
          if(availableLectureInfo.lecture_id === lectureId) {
              result = availableLectureInfo;
          }
      })
    }
    return result;
}

const pushSubjectLectureToTable = (subjectName, videoList, availables) => {
    let subTable = [];
    if(videoList[0][subjectName]) {
      videoList[0][subjectName].map((weeklyLectures, index) => {
          let week = index+1;
          weeklyLectures.map((lecture, index) => {
            console.log("lecture", lecture);
              let id = lecture.lecture_id;
              let title = lecture.title;
              let url = lecture.url;
              let expiredDate = findLectureInAvailables(id, availables).expire_date;
              let row = { id, week, subject: subjectName, title, expiredDate, url };
              subTable.push(row);
          });
      })
    }
    return subTable;
}

const makeTableDataForAdmin = (videoList, availables) => {
    var table = [];
    var mathTable = pushSubjectLectureToTable("math", videoList, availables);
    var physicsTable = pushSubjectLectureToTable("physics", videoList, availables);
    var chemistryTable = pushSubjectLectureToTable("chemistry", videoList, availables);
    var biologyTable = pushSubjectLectureToTable("biology", videoList, availables);
    table = [...mathTable, ...physicsTable, ...chemistryTable, ...biologyTable];

    return table;
}

// component
class Admin extends React.Component {
  constructor(props) {
        super(props);

        let tableData;
        console.log(localStorage);
        const contactData = localStorage.contactData;
        if (!this.props.id) { //새로고침인 경우
          this.props._useLocalData(JSON.parse(contactData));
          tableData = makeTableDataForAdmin(JSON.parse(contactData).videoList, JSON.parse(contactData).availables);
        } else { // 원래 경로로 들어온 경우
          localStorage.contactData =  JSON.stringify(this.props.store.dataReducer);
          tableData = makeTableDataForAdmin(this.props.videoList, this.props.availables);
        }

        this.state = {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: true,
            selectable: true,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: true,
            showCheckboxes: false,
            height: '400px',
            tableData: tableData,
            selectedStudent: "",
            openSnackbar:false,
            message:""
        };

        this._onVideoClick = this._onVideoClick.bind(this);
        this._onSelectFieldChange = this._onSelectFieldChange.bind(this);
        this._handleChangeDate = this._handleChangeDate.bind(this);
        this._onSaveClick = this._onSaveClick.bind(this);

        this._handleToggle = (event, toggled) => {
            this.setState({
                [event.target.name]: toggled,
            });
        };

        this._handleChange = (event) => {
            this.setState({height: event.target.value});
        };
  }

  componentDidUpdate() {
    console.log(localStorage.contactData);
    localStorage.contactData = JSON.stringify(this.props.store.dataReducer);
  }


  _onVideoClick(e){
    let videoUrl = SERVER_URL + "/dist/"+ this.state.tableData[e.target.id].url;
    console.log(videoUrl);
    this.props._openModalWith(<VideoModal videoUrl={videoUrl} />);
    //  this.state.tableData[e.target.id].url} />);
  }

  _onSelectFieldChange(val){
    console.log(val.index);
    let that = this;
    let studentId = this.props.studentList[val.index].user_id;
    let nickname = this.props.studentList[val.index].nickname;
    let availables;
    let videoList = this.props.videoList;

    // 1 서버에 해당 학생의 availables 정보 받아오기
    httpManager.getStudentData({studentId: studentId}, (res)=>{
      console.log(res);
        // store에 저장
        that.props._updateStudent(res.data.user_id, res.data.nickname, res.data.avail_lectures);

        // tableData 생성
        availables = res.data.avail_lectures;
        let tableData = makeTableDataForAdmin(videoList, availables);
        that.setState({ tableData });
    })
    this.setState({ selectedStudent: val.value });
  }

  _handleChangeDate(event, date) {
      // state 변경
      let tableData = this.state.tableData;
      console.log(tableData[this.state.selectedLectureIndex]);
      tableData[this.state.selectedLectureIndex]["expiredDate"] = date.getFullYear()+"-"+(parseInt(date.getMonth())+1)+'-'+date.getDate();
      this.setState({
          tableData: tableData,
      });
  }
  _onSaveClick(e){
      // table Data payload로 변환
      let that =this;
      let tableData = this.state.tableData;
      let availableData = { available:[] };

      tableData.map((row) => {
          if(row.expiredDate){
              availableData.available.push({ lecture_id: row.id, expire_date: row.expiredDate});
          }
      })
      console.log(availableData);

      // 변환된 데이터 API로 요청
      httpManager.postStudentData({studentId:this.props.studentId, data: availableData},(res)=>{ that.setState({openSnackbar: true, message: "학생이 이용가능한 수업 정보가 서버에 저장되었습니다."})});

      // Snackbar 열기
      this.setState({openSnackbar: true, message: "학생이 이용가능한 수업 정보가 서버에 저장중입니다."});
  }

  render(){
      let that = this;
      let tableData =  this.state.tableData;
      let today = new Date();
      let todayString = today.getFullYear()+"-" + (parseInt(today.getMonth())+1)+'-' + today.getDate();
      console.log(this.state.tableData);

      let options = [];
      this.props.studentList.map((studentInfo, index) => {
          options.push(
            {
              value: studentInfo.nickname,
              label: studentInfo.nickname,
              index: index,
            });
      })

      if (!this.props.isLogged) return (<div></div>)

    return(
        <div className="app-body"
          style={{
            width: '100%',
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
            <div style={{
              marginTop: "20px",
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'}}>

              <Select
                style={{width: '150px'}}
                name="form-field-name"
                value={this.state.selectedStudent}
                options={options}
                onChange={this._onSelectFieldChange}
              />

              <RaisedButton label="학생수업정보저장" primary={true} onClick={this._onSaveClick}>

                <Snackbar
                  open={this.state.openSnackbar}
                  message={this.state.message}
                  autoHideDuration={4000}
                  onRequestClose={()=>{this.setState({openSnackbar: false})}}
                />

              </RaisedButton>
              <RaisedButton label="학생 수업 확인" primary={true} onClick={()=>{
              browserHistory.push('student');}} />
            </div>

              <Table
                height={this.state.height}
                fixedHeader={this.state.fixedHeader}
              >
                  <TableHeader
                      displaySelectAll={this.state.showCheckboxes}
                      adjustForCheckbox={this.state.showCheckboxes}
                  >
                      <TableRow>
                        <TableHeaderColumn colSpan="8" tooltip="Lecture List" style={{textAlign: 'center', fontSize: '20px'}}>
                            {"Lecture List " + todayString}
                        </TableHeaderColumn>
                      </TableRow>
                      <TableRow>
                        <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Subject">Subject</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Week">Week</TableHeaderColumn>
                        <TableHeaderColumn colSpan="2" tooltip="The Title">Title</TableHeaderColumn>
                        <TableHeaderColumn colSpan="2" tooltip="The Expired Date">Expired Date</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Video">Video</TableHeaderColumn>
                      </TableRow>
                  </TableHeader>

                <TableBody
                  displayRowCheckbox={this.state.showCheckboxes}
                  showRowHover={this.state.showRowHover}
                  stripedRows={this.state.stripedRows}
                >
                  {this.state.tableData.map( (row, index) => {
                    return (
                        <TableRow id={index} key={index}>
                            <TableRowColumn>{index}</TableRowColumn>
                            <TableRowColumn>{row.subject}</TableRowColumn>
                            <TableRowColumn>{row.week}</TableRowColumn>
                            <TableRowColumn colSpan="2">{row.title}</TableRowColumn>

                            <TableRowColumn colSpan="2">
                                <DatePicker
                                    autoOk={true}
				    hintText="Not Allowed"
                                    value={row.expiredDate && this.state.selectedStudent ? new Date(row.expiredDate.split('-')[0], parseInt(row.expiredDate.split('-')[1])-1, row.expiredDate.split('-')[2]) : null }
                                    onChange={this._handleChangeDate}
                                    onClick={(e)=>{that.setState({ selectedLectureIndex: e.currentTarget.parentNode.parentNode.parentNode.parentNode.id },()=>{console.log(that.state.selectedLectureIndex);})}}
                                />
                            </TableRowColumn>

                            <TableRowColumn>
                               <span id ={index}
                                className="glyphicon glyphicon-play-circle"
                                style={{cursor:'pointer'}}
                                onClick={this._onVideoClick}
                              ></span>
                            </TableRowColumn>
                        </TableRow>
                    )
                })}
                </TableBody>

                <TableFooter
                  adjustForCheckbox={this.state.showCheckboxes}
                >
                  <TableRow>
                    <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                      <div> Homepage	<span style={{color: 'grey'}}> kseede.blog.me </span> </div>
                      <div>
                      H.P.	<span style={{color: 'grey'}}> 010-9280-1621 </span>
                      </div>
                    </TableRowColumn>
                  </TableRow>
                </TableFooter>
              </Table>
          <ModalContainer />
        </div>
    )
  }
}

/*
<SelectField
    floatingLabelText="Select Student"
    value={this.state.selectedStudent}
    onChange={this._onSelectFieldChange}
>
    <MenuItem value={null} primaryText="" />
    {
        this.props.studentList.map((studentInfo) => {
            return <MenuItem value={studentInfo.id} primaryText={studentInfo.nickname} />
        })
    }
</SelectField>
*/
export default connect(mapStateToProps, mapDispatchToProps)(Admin);
