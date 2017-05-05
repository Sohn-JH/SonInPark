const initialState = {
 // store

  // worker
    isLogged: false,
    // 사용자의 아이디
    // admin의 아이디 정보는 constant에 저장되어 이 값을 비교하여 화면을 달리(admin or student) 보여줌
    id: "",
    nickname: "",

    // 1) admin이 선택한 학생의 아이디
    // 2) 학생이 로그인 시 학생 아이디와 동일
    studentId: "1234",

    // 선택된 학생이 이용 가능한 수업들의 정보 (get from server)
    // 이를 바탕으로 화면에 뿌려지며, 테이블상의 수치 변경 시 업데이트 된다
    // submit을 누르면 이 정보가 server에 post됨
    availables: [
      {
        lectureId: 'lectureId13',
        expiredDate: '2017-05-20',
      },
      {
        lectureId: 'lectureId2',
        expiredDate: '2017-05-20',
      }
    ],

    // admin이 참조하는 학생들의 리스트
    studentList: [
        {id: 'id1', nickname: 'nickname1'},
        {id: 'id2', nickname: 'nickname2'},
        {id: 'id3', nickname: 'nickname3'},
    ],

    videoList: {
      math: [
        [{
          id: "lectureId13",
          title: "lecture1-1 : linear regression",
          // 해당 과목의 영상 url
          url: "DEFAULT_VIDEO",
         },{
          title: "lecture1-2 : linear regression2",
          url: "a",
        }],
        [{
          title: "lecture2-1 : arithmetic sequence",
          url: "a",
        }],
      ],
      physics: [
        [{
          id: "lectureId13",
          title: "lecture1-1 : linear regression",
          // 해당 과목의 영상 url
          url: "DEFAULT_VIDEO",
         },{
          title: "lecture1-2 : linear regression2",
          url: "a",
        }],
        [{
          title: "lecture2-1 : arithmetic sequence",
          url: "a",
        }],
      ],
      chemistry: [
      ],
      biology: [
      ]
    },
    modalContent: "",
    showModal: false,
};

const dataReducer = (state = initialState, action) => {

  switch(action.type){

  // Intialization

    case "LOG_ON":
        return Object.assign({}, state, { isLogged: true })

    case "LOG_OUT":
        return Object.assign({}, state, { isLogged: false })

    case "UPDATE_USER": // (id = "", nickname ="")
      return Object.assign({}, state, {
        id: action.id,
        nickname: action.nickname
      });

    case "UPDATE_STUDENT": // (studentId, availables, nickname)
      return Object.assign({}, state, {
        studentId: action.studentId,
        nickname: action.nickname,
        availables: action.availables,
      })

    case "UPDATE_STUDENT_LIST": // (studentList)
    return Object.assign({}, state, {
      studentList: action.studentList,
    })

    case "UPDATE_VIDEO_LIST": // (videoList)
      return Object.assign({}, state, {
        videoList: action.videoList,
      })

    case "OPEN_MODAL_WITH_CONTENT": // (content)
      return Object.assign({}, state, {
        showModal: true,
        modalContent: action.content,
      })

    case "OPEN_MODAL": // (modalContent)
      return Object.assign({}, state, {
        showModal: true,
      })

    case "CLOSE_MODAL": // (modalContent)
      return Object.assign({}, state, {
        showModal: false,
      })


  // Default
    default:
      return state;
  }
};

export default dataReducer;
