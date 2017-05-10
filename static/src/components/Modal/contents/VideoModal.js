import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';

// action
import { closeModal } from '../../../actions'

// redux
function mapStateToProps(state){
  return({
    showModal: state.dataReducer.showModal,
  });
}

function mapDispatchToProps(dispatch){
  return({
    _closeModal: ()=>{dispatch(closeModal())}
  });
}

// style
const customContentStyle = {
  width: '80%',
  height: '90%',
  maxWidth: '1000px',
};

class VideoModal extends React.Component {

  _handleClose(e){
    this.props._closeModal();
  }

  constructor(props){
    super(props);
    this._handleClose = this._handleClose.bind(this);
    this.state = {
    // video
    selectableVideoOptions:[],
    videoName:null,
    videoInfo:null,
    };
  }

  componentDidUpdate(){
    let that = this;
    var video, wrapper;
    wrapper = document.createElement('div');
    wrapper.innerHTML = "<video id='video-onwindow' class='video-js vjs-default-skin video-on-window embed-responsive-item' controls preload='auto' data-setup={} > <source src=" +
      (this.props.videoUrl ? this.props.videoUrl : "http://14.63.217.83/dist/videos/math/math1_1.mp4")
    + " type='video/mp4'> <p className='vjs-no-js'>To view this video please enable JavaScript, and consider upgrading to a web browser that <a href='http://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a></p> </video>";

    video = wrapper.firstChild;
    console.log(this.target);
    this.target.appendChild(video);
    videojs(video, {});

    document.getElementById('video-container').parentNode.style.overflowY="scroll";
  }

  componentDidMount(){
    let that = this;
    var video, wrapper;
    wrapper = document.createElement('div');
    wrapper.innerHTML = "<video id='video-onwindow' class='video-js vjs-default-skin video-on-window embed-responsive-item' controls preload='auto' data-setup={} > <source src=" +
      (this.props.videoUrl ? this.props.videoUrl : "http://14.63.217.83/dist/videos/math/math1_1.mp4")
    + " type='video/mp4'> <p className='vjs-no-js'>To view this video please enable JavaScript, and consider upgrading to a web browser that <a href='http://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a></p> </video>";

    video = wrapper.firstChild;
    console.log(this.target);
    this.target.appendChild(video);
    videojs(video, {});
    
    document.getElementById('video-container').parentNode.style.overflowY="scroll";
  }

  render(){


    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this._handleClose}
      />,
    ];

    return(
      <Dialog
        title="Lecture"
        actions={actions}
        modal={true}
        contentStyle={customContentStyle}
        open={this.props.showModal}
      >

        <div id="video-container" className = "embed-responsive embed-responsive-16by9" ref={ref => this.target = ref} >
        </div>
      </Dialog>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoModal);


// <video id="video-on-window" className = "video-on-window embed-responsive-item"
//     preload = "auto"
//     controls
//     controlList="fullscreen nodownload noremote foobar"
// >
// <source src = {this.props.videoUrl ? this.props.videoUrl : "http://14.63.217.83/dist/videos/math/math1_1.mp4"} alt = "" type = "video/mp4" />
// Your browser does not support HTML5 video. </video>
