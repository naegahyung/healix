import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontIcon } from 'material-ui';

import { logOut } from '../actions';
import Logo from '../assets/fossil.png';

export class Header extends Component {

  logOut = () => {
    this.props.logOut()
  }

  renderLogOutButton() {
    if (!this.props.success) {
      return <li><Link to='/signin' style={{color: 'black'}}>Log in</Link></li>
    } else {
      return <li><Link to='/' onClick={this.logOut} style={{color: 'black'}}>Log Out</Link></li>
    }
  }

  renderWelcomeMsg() {
    if (this.props.success) {
      return <li style={{color: 'black'}}>Welcome Admin</li>
    }
  }

  render() {
    return (
      <div>
        <nav style={{fontFamily: 'Amaranth'}} >
          <div className="nav-wrapper container" >
            <a className="brand-logo" href='/' style={{color: 'black'}}>
              <img src={Logo} style={{width: '30px', position: 'relative', top: '6px'}}/> &nbsp; Healix
            </a>
            <ul id="nav-mobile" className="right">
              {this.renderWelcomeMsg()}
              <li><Link to='/about' style={{color: 'black'}}>About</Link></li>
              {this.renderLogOutButton()}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  return { success: auth.authenticated }
}

export default connect(mapStateToProps, { logOut })(Header)
