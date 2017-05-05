import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

// constants

// sub-components
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import AppBar from 'material-ui/AppBar';

// action
import { logOut } from '../../actions';

// redux
function mapStateToProps(state) {
    return {
      isLogged: state.dataReducer.isLogged,
    };
}

function mapDispatchToProps(dispatch) {
    return ({
        _logOut: () => { dispatch(logOut()); },
    });
}

// style
var style= {
}

// component
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
    }
  }

  render(){
    return(
      <div className="header"
        style={{
          flex: '0 0 64px',
        }}
      >
        <script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
        <AppBar
          title="Assay.Tut"
          iconElementLeft={<IconButton onClick={()=>{browserHistory.push('home');}}><ActionHome /></IconButton>}
          iconElementRight={this.props.isLogged ?
            <FlatButton style={this.props.style}
              onClick={(e) => {
		Kakao.Auth.logout(); 
                this.props._logOut();
		browserHistory.push('home');
              }}
              label="LOG OUT"
            />
            : null
          }
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
