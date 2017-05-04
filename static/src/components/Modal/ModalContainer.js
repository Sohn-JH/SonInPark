import React from 'react';
import { connect } from 'react-redux';

// action

// redux
function mapStateToProps(state){
  return({
    modalContent: state.dataReducer.modalContent,
  });
}

function mapDispatchToProps(dispatch){
  return({
  });
}

// component
class ModalContainer extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
          {this.props.modalContent}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
