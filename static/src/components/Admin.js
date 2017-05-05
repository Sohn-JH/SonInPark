import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { httpManager } from '../managers';

import ModalContainer from './Modal/ModalContainer';
import VideoModal from './Modal/contents/VideoModal';

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

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';

// constants

// sub-components

// action
import {openModalWithContent, updateStudent} from '../actions';

// redux
function mapStateToProps(state) {
    return {
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
    if( videoList[0][subjectName]) {
      videoList[0][subjectName].map((weeklyLectures, index) => {
          let week = index;
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
            tableData: makeTableDataForAdmin(this.props.videoList, this.props.availables),
            selectedStudent: "",
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

  _onVideoClick(e){
    console.log(this.state.tableData[e.target.id].url);
    this.props._openModalWith(<VideoModal videoUrl={this.state.tableData[e.target.id].url} />);
  }

  _onSelectFieldChange(event, index, value){
    console.log(index);
    let that = this;
    let studentId = this.props.studentList[index - 1].user_id;
    let nickname = this.props.studentList[index - 1].nickname;
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

    this.setState({ selectedStudent: value });
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
      let tableData = this.state.tableData;
      let availableData = { available:[] };

      tableData.map((row) => {
          if(row.expiredDate){
              availableData.available.push({ lecture_id: row.id, expire_date: row.expiredDate});
          }
      })
      console.log(availableData);

      // 변환된 데이터 API로 요청
      httpManager.postStudentData({studentId:this.props.studentId, data: availableData});

      // store 에 저장
  }

  render(){
      let that = this;
      let tableData =  makeTableDataForAdmin(this.props.videoList, this.props.availables)
      let today = new Date();
      let todayString = today.getFullYear()+"-" + (parseInt(today.getMonth())+1)+'-' + today.getDate();
      console.log(this.state.tableData);

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
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <SelectField
                    style={{ }}
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
                <RaisedButton label="Save Student" primary={true} onClick={this._onSaveClick}/>
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
                        <TableHeaderColumn colSpan="6" tooltip="Lecture List" style={{textAlign: 'center', fontSize: '20px'}}>
                            {"Lecture List " + todayString}
                        </TableHeaderColumn>
                      </TableRow>
                      <TableRow>
                        <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Subject">Subject</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Week">Week</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Title">Title</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Expired Date">Expired Date</TableHeaderColumn>
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
                            <TableRowColumn>{row.title}</TableRowColumn>

                            <TableRowColumn>
                                <DatePicker
                                    hintText="Not Allowed"
                                    value={row.expiredDate ? new Date(row.expiredDate.split('-')[0], parseInt(row.expiredDate.split('-')[1])-1, row.expiredDate.split('-')[2]) : null }
                                    onChange={this._handleChangeDate}
                                    onClick={(e)=>{that.setState({ selectedLectureIndex: e.currentTarget.parentNode.parentNode.parentNode.parentNode.id },()=>{console.log(that.state.selectedLectureIndex);})}}
                                />
                            </TableRowColumn>

                            <TableRowColumn>
                                <FontIcon id={index} className="material-icons"
                                style={row.expiredDate ? {cursor:'pointer'} : {cursor:'not-allowed', pointerEvents: 'none',opacity: 0.5} }
                                color={blue500}
                                onClick={this._onVideoClick}
                                > videogame_asset
                                </FontIcon>
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

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
