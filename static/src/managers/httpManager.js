import axios from 'axios';
import { SERVER_URL } from '../constants';

// axios 서버( /api/user/login )에 {id, nickname} 포스트
export default class HttpManager {

  // 로그인시 전달되는 id와 nickname으로
  // 해당 id가 존재하지 않으면 id 저장
  postUserData(params = {id : "", nickname : ""}, callback, error){
    let url = SERVER_URL + "/api/user/login";
    let data = {id: params.id, nickName: params.nickname};
    axios.post(url, data).then(callback).catch(error);
  }

  getStudentData(params = {studentId : ""}, callback, error){
    let url = SERVER_URL + "/api/user/" + params.studentId;
    axios.get(url).then(callback).catch(error);
  }

  postStudentData(params = {studentId : "", data : null}, callback, error){
    let url = SERVER_URL + "/api/user/" + params.studentId;
    axios.post(url, data).then(callback).catch(error);
  }

  getAllStudentsList(callback, error) {
    let url = SERVER_URL + "/api/user/all";
    axios.get(url).then(callback).catch(error);
  }

  getVideoList(callback, error) {
    let url = SERVER_URL + "/api/videoList";
    axios.get(url).then(callback).catch(error);
  }
}
