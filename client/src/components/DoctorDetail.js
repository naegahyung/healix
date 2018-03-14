import React, { Component } from 'react'
import { connect } from 'react-redux';
import { CircularProgress, Paper, RadioButton, RadioButtonGroup } from 'material-ui';
import moment from 'moment';

import { bookAppointment } from '../actions';

class DoctorDetail extends Component {

  state = { loading: false, selectedDate: null }

  bookAppointment = async (e) => {
    this.setState({ loading: true });
    await this.props.bookAppointment({ 
      userId: 0, 
      doctorId: e.uid,
      doctorName: `${e.profile.first_name} ${e.profile.last_name}`,
      timeframe: this.state.selectedDate
    });
    this.setState({ loading: false });
    this.props.history.push('/home');
  }

  renderButton() {
    if (this.state.loading) {
      return <CircularProgress size={70} />
    } else {
      return (
        <button 
          className="right btn waves-effect waves-light" 
          onClick={this.bookAppointment.bind(this, this.props.location.state.userinfo)}
        >
          Book an appointment with this medical doctor
        </button>   
      )
    }
  }

  radioChange = (event, value) => {
    this.setState({ selectedDate: value })
  }

  renderAvailableTimes() {

    return (
      <RadioButtonGroup labelPosition='left' name="shipSpeed" defaultSelected="not_light" onChange={this.radioChange}>{
        this.props.location.state.time.map(t => {
          return (
            <RadioButton
              value={t}
              label={moment(t).format("MMM DD HH:mm a")}
              style={{padding: '20px'}}
            />
          )
        })
      }</RadioButtonGroup>
    )
  }

  render() {
    const { practice, phone, profile, visit_address } = this.props.location.state.userinfo;
    const { title, first_name, last_name, bio, image_url } = profile;
    const { city, zip, state, street } = visit_address;
    return (
      <div className="container" style={{fontFamily: 'Amaranth'}}>
        <div className="row" style={{paddingTop: '50px'}} >
          <div className="col s6">
            <div className="center" style={{fontSize: '20px'}}>
              {`${first_name} ${last_name}, ${title}`}
            </div>
            <div className="center">
              {`${street}, ${city}, ${state} ${zip}`}
            </div>
            <div className="center" >
              <img src={image_url} alt='No image' style={{position: 'relative', top: '30px'}}/>
            </div>
            <div style={{position: 'relative', top: '100px'}}>
              {bio}
            </div>
          </div>
          <div className="col s6 center">   
            <div className="row">
              <div className="col s10">
                Available Time Slots
              </div>
              <div className="col s2">
                Select
              </div>
            </div>   
            {this.renderAvailableTimes()}
          </div>
        </div>
        <div style={{position: 'relative', top: '200px'}} >{
          this.state.selectedDate ?
          <button 
            className="right btn waves-effect waves-light" 
            onClick={this.bookAppointment.bind(this, this.props.location.state.userinfo)}
          >
            Book an appointment with this medical doctor
          </button> :
          <button
           className="btn disabled right"
          >
            Please choose a date
          </button>
        }</div>
      </div>  
    )
  }
}

export default connect(null, { bookAppointment })(DoctorDetail);
