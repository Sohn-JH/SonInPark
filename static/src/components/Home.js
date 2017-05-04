import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { httpManager } from '../managers';
import KakaoLogin from 'react-kakao-login';
import { Link } from 'react-router'

import RaisedButton from 'material-ui/RaisedButton';

// action
import { logOn, updateUser, updateStudentList, updateStudent, updateVideoList } from '../actions';

// constants
import { ADMIN_ID } from '../constants';

// sub-components

// redux
function mapStateToProps(state) {
  return {
    isLogged: state.dataReducer.isLogged,
    id: state.dataReducer.id,
  };
}

function mapDispatchToProps(dispatch) {
  return ({
    _logOn: () => { dispatch(logOn()); },
    _updateUser: (id, nickname) => { dispatch(updateUser(id, nickname))},
    _updateStudentList: (studentList) => { dispatch(updateStudentList(studentList)); },
    _updateStudent: (studentId, nickname, avilables) => { dispatch(updateStudent(studentId, nickname, avilables)); },
    _updateVideoList: (videoList) => { dispatch(updateVideoList(videoList))},
  });
}

// style
var style= {
}

// component
class Home extends React.Component {
  constructor(props) {
    super(props);
    this._onLoginSuccess = this._onLoginSuccess.bind(this);
    this._onLoginFail = this._onLoginFail.bind(this);
  }

  _onLoginSuccess(authObj){
    let that = this;
  // 할 일
    // isLogged 변경
    Kakao.API.request({
        url: '/v1/user/me',
        success: function(res) {

        that.props._logOn(); // 로그인 상태 변경
        that.props._updateUser(res.id, res.properties.nickname); // 이용자 정보 변경

        // 받아온 id와 nickname 정보로 서버에 유저정보 등록 요청
        httpManager.postUserData({id: res.id, nickname: res.properties.nickname},(res)=>{console.log("postUserData", res);});

        // 비디오 리스트 요청
        httpManager.getVideoList((res) => {
          console.log("getVideoList", res);
            // store에 저장
            let videoList = res.data || {};
            that.props._updateVideoList(videoList); // 비디오 정보 업데이트
        });

        if(res.id+"" == ADMIN_ID){ // admin 인 경우
            httpManager.getAllStudentList((res)=>{
              console.log("getAllStudentList", res);
                // 모든 학생 리스트 저장 (후에 선택적으로 요청 가능)
                let studentList = res.data.id_list;
                that.props._updateStudentList(studentList);
            })
        } else { // 학생인 경우
            httpManager.getStudentData({studentId: res.id}, (res) => {
            console.log("getStudentData", res.data.nickname);
                // 해당 학생 정보(studentId, available)업데이트
                that.props._updateStudent(res.data.user_id, res.data.nickname, res.data.avail_lectures || {})
            })
        }

//         alert(JSON.stringify(res));
      },
      fail: function(error) {
        alert(JSON.stringify(error));
      }
    });
  }

  _onLoginFail(err) {

  };

    render(){
      let id = this.props.id;
        return(
                <div className="app-body"
                    style={{
                        width: '100%',
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                    <img src="http://blogpfthumb.phinf.naver.net/20120303_85/kseede_1330762362214_187ScD_jpg/%C7%C1%B7%CE%C7%CA.jpg" alt="" />
                    <br />
                    <div
                        style={{

                        }}
                    >
                        <div> 최저등급 (수/과 2등급 의미) 만 맞춰오면, 논술전형으로 대학 보내주는 </div>
                        <div> 수리/과학논술 화상과외 </div>
                        <div> Homepage	kseede.blog.me </div>
                        <div> 수업 문의	카톡ID 	kseede </div>
                        <div> H.P.	010-9280-1621 </div>
                        <div> ** 전화 상담은 평일 6시 이후 가능 </div>
                        <div> 그 외의 시간은 카카오톡으로 상담 예약을 해주세요 </div>
                    </div>
                    <br />
                    {this.props.isLogged ?
                        (id + "" == ADMIN_ID ?
                          <Link to="admin">
                            <RaisedButton label="수강 설정" primary={true} style={style} />
                          </Link> :
                          <Link to="student">
                            <RaisedButton label="수업듣기" primary={true} style={style} />
                          </Link>
                        )
                        :
                        <KakaoLogin
                          style={{  }}
                          jsKey="12a49bad3ac20d89be95f52ebd57974b"
                          onSuccess={this._onLoginSuccess}
                          onFailure={this._onLoginFail}
                        />
                    }
                    </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);


// TODO 이미지, 설명, 버튼 넣기
