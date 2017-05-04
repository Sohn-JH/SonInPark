import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

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
        <div className = "embed-responsive embed-responsive-16by9" >
            <video className = "video-on-window embed-responsive-item"
                preload = "auto"
                controls
            >
            <source src = {this.props.videoUrl ? this.props.videoUrl : "http://52.42.203.75/videos/math/math1_1.mp4"} alt = "" type = "video/mp4" />
            Your browser does not support HTML5 video. </video>
        </div>

      </Dialog>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoModal);
