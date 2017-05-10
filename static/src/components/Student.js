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

import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';

// constants
import {SERVER_URL} from '../constants';

// sub-components

// action
import {openModalWithContent, useLocalData, updateStudent} from '../actions';

// redux
function mapStateToProps(state) {
    return {
        store: state,
        id: state.dataReducer.id,
        videoList: state.dataReducer.videoList,
        availables: state.dataReducer.availables,
        isLogged: state.dataReducer.isLogged,
        nickname: state.dataReducer.nickname,
        studentId: state.dataReducer.studentId,
    };
}

function mapDispatchToProps(dispatch) {
    return ({
      _openModalWith: (content) => { dispatch(openModalWithContent(content))},
      _useLocalData: (contactData) => {dispatch(useLocalData(contactData))},
      _updateStudent: (studentId, nickname, avilables) => { dispatch(updateStudent(studentId, nickname, avilables)); },
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
    let subTable = []
    if( videoList[0][subjectName]) {
      videoList[0][subjectName].map((weeklyLectures, index) => {
          let week = index+1;
          weeklyLectures.map((lecture, index) => {
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

const makeTableDataForStudent = (videoList, availables) => {
    var table = [];
    var mathTable = pushSubjectLectureToTable("math", videoList, availables);
    var physicsTable = pushSubjectLectureToTable("physics", videoList, availables);
    var chemistryTable = pushSubjectLectureToTable("chemistry", videoList, availables);
    var biologyTable = pushSubjectLectureToTable("biology", videoList, availables);
    table = [...mathTable, ...physicsTable, ...chemistryTable, ...biologyTable];

    return table;
}

const isAvailable = (expiredDate ,today) => {
  // check expireDate > today => true
  if(!expiredDate) return false

  let ey = parseInt(expiredDate.split('-')[0]);
  let em = parseInt(expiredDate.split('-')[1]);
  let ed = parseInt(expiredDate.split('-')[2]);
  let ty = parseInt(today.split('-')[0]);
  let tm = parseInt(today.split('-')[1]);
  let td = parseInt(today.split('-')[2]);

  let result = ey >= ty;
  result = result && (ey == ty ? em >= tm : true);
  result = result && (em == tm ? ed >= td :true);
  return result;
}
// component
class Student extends React.Component {
  constructor(props) {
        super(props);
        debugger;


        let tableData;
        console.log(localStorage);
        const contactData = localStorage.contactData;
        if (!this.props.id) { //새로고침인 경우
          this.props._useLocalData(JSON.parse(contactData));
          tableData = makeTableDataForStudent(JSON.parse(contactData).videoList, JSON.parse(contactData).availables);
        } else { // 원래 경로로 들어온 경우
          localStorage.contactData =  JSON.stringify(this.props.store.dataReducer);
          tableData = makeTableDataForStudent(this.props.videoList, this.props.availables);
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
        };

        this._onVideoClick = this._onVideoClick.bind(this);

        this._handleToggle = (event, toggled) => {
            this.setState({
                [event.target.name]: toggled,
            });
        };

        this._handleChange = (event) => {
            this.setState({height: event.target.value});
        };
  }
  componentDidMount(){
    let that = this;
    httpManager.getStudentData({studentId: that.props.studentId}, (res) => {
        // 해당 학생 정보(studentId, available)업데이트
        that.props._updateStudent(res.data.user_id, res.data.nickname, res.data.avail_lectures);
        let tableData = makeTableDataForStudent(that.props.videoList, res.data.avail_lectures);
        that.setState({tableData});
    })
  }

  componentDidUpdate() {
    localStorage.contactData = JSON.stringify(this.props.store.dataReducer);
  }

  _onVideoClick(e){
    let videoUrl = SERVER_URL + "/dist/"+ this.state.tableData[e.target.id].url;
    console.log(videoUrl);
    this.props._openModalWith(<VideoModal videoUrl={videoUrl} />);
    //  this.state.tableData[e.target.id].url} />);
  }

  render(){
    let today = new Date();
    let todayString = today.getFullYear()+"-" + (parseInt(today.getMonth())+1)+'-' + today.getDate();

    return(
      <div className="app-body"
        style={{
          width: '100%',
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
                  {this.props.nickname + "님의 Lecture List " + todayString}
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="Index">순서</TableHeaderColumn>
              <TableHeaderColumn tooltip="Subject">과목</TableHeaderColumn>
              <TableHeaderColumn tooltip="Week">주차</TableHeaderColumn>
              <TableHeaderColumn colSpan="2" tooltip="Title">강연</TableHeaderColumn>
              <TableHeaderColumn colSpan="2" tooltip="Expired Date">수강 기한</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Video">영상</TableHeaderColumn>
            </TableRow>
          </TableHeader>

          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.tableData.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn>{index}</TableRowColumn>
                <TableRowColumn>{row.subject}</TableRowColumn>
                <TableRowColumn>{row.week}</TableRowColumn>
                <TableRowColumn colSpan="2">{row.title}</TableRowColumn>

                <TableRowColumn colSpan="2">{row.expiredDate}</TableRowColumn>
                <TableRowColumn>
		               <span id={index}
                    className="glyphicon glyphicon-play-circle"
                    style={isAvailable(row.expiredDate ,todayString) ? {cursor:'pointer'} : {cursor:'not-allowed', pointerEvents: 'none',opacity: 0.5}}
                    onClick={this._onVideoClick}
                  ></span>
                </TableRowColumn>
              </TableRow>
              ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(Student);
