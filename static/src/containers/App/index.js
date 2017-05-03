import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider
        muiTheme={getMuiTheme()}
      >
        <div className="app"
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Header />
          <div
            className="container"
            style={{
              flex: '1',
              overflow: 'scroll',
            }}
          >
            {this.props.children}
           <Footer />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
};

export default App;
