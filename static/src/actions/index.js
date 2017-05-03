export const logOn = () => {
  return ({
    type: "LOG_ON",
  })
}

export const logOut = () => {
  return ({
    type: "LOG_OUT",
  })
}

export const updateUser = (id, nickname) => {
  return ({
    type: "UPDATE_USER",
    id,
    nickname,
  })
}

export const updateStudent = (studentId, nickname, available) => {
  return ({
    type: "UPDATE_STUDENT",
    studentId,
    nickname,
    available,
  })
}

export const updateStudentList = (studentList) => {
  return ({
    type: "UPDATE_STUDENT_LIST",
    studentList,
  })
}

export const updateVideoList = (videoList) => {
  return ({
    type: "UPDATE_VIDEO_LIST",
    videoList,
  })
}

export const openModalWithContent = (content) => {
  return ({
    type: "OPEN_MODAL_WITH_CONTENT",
    content,
  })
}

export const openModal= () => {
  return ({
    type: "OPEN_MODAL",
  })
}

export const closeModal= () => {
  return ({
    type: "CLOSE_MODAL",
  })
}
