import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Paper, FloatingActionButton } from 'material-ui';

import { fetchUserInfo } from '../actions';
import Avatar from '../assets/avatar-1606916_1280.png';

export class Home extends Component {

  componentDidMount() {
    this.props.fetchUserInfo()
  }

  renderAppList(status, appointments) {
    return (
      <div style={{paddingTop: '50px'}} >
        <div>
          List of {status} appointments:
        </div>
        <ul>{
          appointments.map(appointment => {
            let { doctorName, time } = appointment
            return (
              <Paper>
                <div className="row" style={{padding: '10px'}}>
                  <div className="col s6">
                    {doctorName}
                  </div>
                  <div className="col s6">
                    {moment(time).format("MMM DD YYYY hh:mm a")}
                  </div>
                </div>
              </Paper>
            )
          })
        }</ul>
      </div>
    )
  }

  renderApp() {
    if (this.props.info) {
      return (
        <div>
          {this.renderAppList("new", this.props.info.new_appts)}
          {this.renderAppList("old", this.props.info.old_appts)}
        </div>
      )
    }
  }

  navigateToSearch = () => {
    this.props.history.push('/search')
  }

  renderUserInfo() {
    if (this.props.info) {
      return (
        <div>
          <div style={{paddingTop: '50px', fontSize: '20px'}} >
            Welcome back. How are you doing today?
          </div>
          <div className="row">
            <div className="col s6">
              {this.renderApp()}
            </div>
            <div className="col s6 center" >
              <img src={Avatar} alt='No profile picture available' style={{width:'300px'}} />
              <div style={{position: 'relative', top: '50px', fontSize: '20px'}} >
                <div>Name: Jin Kim</div>
                <div>Birthday: AUG 15 1996</div>
                <div>Insurance: Liberty Mutual Insurance</div>
              </div>
            </div>
          </div>
          <div className="fixed-action-btn">
            <FloatingActionButton backgroundColor='#DF7576' onClick={this.navigateToSearch}>
              <i className="material-icons">add</i> 
            </FloatingActionButton>
        </div>
        </div> 
      )
    }
  }

  render() {
    return (
      <div className="container" style={{fontFamily: 'Amaranth'}}>
        {this.renderUserInfo()}
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => {
  return { info: user.info }
}

export default connect(mapStateToProps, { fetchUserInfo })(Home)
