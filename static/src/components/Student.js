import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

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

// sub-components

// action
import {openModalWithContent} from '../actions';

// redux
function mapStateToProps(state) {
    return {
        videoList: state.dataReducer.videoList,
        availables: state.dataReducer.availables,
        isLogged: state.dataReducer.isLogged,
    };
}

function mapDispatchToProps(dispatch) {
    return ({
      _openModalWith: (content) => { dispatch(openModalWithContent(content))}
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
  debugger;
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
          let week = index;
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

  debugger;
  let ey = parseInt(expiredDate.split('-')[0]);
  let em = parseInt(expiredDate.split('-')[1]);
  let ed = parseInt(expiredDate.split('-')[2]);
  let ty = parseInt(today.split('-')[0]);
  let tm = parseInt(today.split('-')[1]);
  let td = parseInt(today.split('-')[2]);

  let result = ey >= ty;
  result = result && ey == ty && em >= tm;
  result = result && em == tm && ed >= td;
  return result;
}
// component
class Student extends React.Component {
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
            tableData: makeTableDataForStudent(this.props.videoList, this.props.availables),
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

  _onVideoClick(e){
    console.log(this.state.tableData[e.target.id].url);
    this.props._openModalWith(<VideoModal videoUrl={"http://52.42.203.75/dist/videos/math/math1_1.mp4"} />);
    //  this.state.tableData[e.target.id].url} />);
  }

  render(){
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
            {this.state.tableData.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn>{index}</TableRowColumn>
                <TableRowColumn>{row.subject}</TableRowColumn>
                <TableRowColumn>{row.week}</TableRowColumn>
                <TableRowColumn>{row.title}</TableRowColumn>

                <TableRowColumn>{row.expiredDate}</TableRowColumn>
                <TableRowColumn>
                  <FontIcon id={index} className="material-icons"
                    style={isAvailable(row.expiredDate ,todayString) ? {cursor:'pointer'} : {cursor:'not-allowed', pointerEvents: 'none',opacity: 0.5} }
                    color={blue500}
                    onClick={this._onVideoClick}
                  > videogame_asset</FontIcon></TableRowColumn>
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
