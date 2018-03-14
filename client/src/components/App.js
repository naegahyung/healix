import 'materialize-css/dist/css/materialize.css';
import '../assets/global.css';
import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Main from './Main';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import Search from './Search';
import SearchResult from './SearchResult';
import DoctorDetail from './DoctorDetail';
import Header from './Header'; 

class App extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <BrowserRouter>
            <div>
              <Header />
              <Route exact path='/' component={Main} />
              <Route path='/signin' component={SignIn} />
              <Route path='/signup' component={SignUp} />
              <Route path='/home' component={Home} />
              <Route exact path='/search' component={Search} />
              <Route path='/search/result' component={SearchResult} />
              <Route path='/doctor/details' component ={DoctorDetail} />
            </div>
          </BrowserRouter>
        </ MuiThemeProvider>
      </div>
    );
  }
}

export default App;
