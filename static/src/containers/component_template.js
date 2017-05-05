import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import $ from 'jquery';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/themes/base/resizable.css';
import 'jquery-ui/ui/widgets/resizable';

// constants
import {SERVER_URL} from '../../constants'

// sub-components

/* import name from './name'; */

// action
function actionName(param){
  return{
    type: "ACTION_TYPE",
    param: param,
  }
}

// redux
function mapStateToProps(state) {
    return {
      storeElement: state.vtoonData.selectedPanelId,
    };
}

function mapDispatchToProps(dispatch) {
    return ({
      _funcitonName: (param)=>{ dispatch(actionName(param)) },
    });
}

// style
var style= {
}

// component
class ClassName extends React.Component {
  constructor(props) { super(props); }

  render(){
    return(

    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassName);
