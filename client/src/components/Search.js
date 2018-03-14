import React, { Component } from 'react'
import { AutoComplete, CircularProgress } from 'material-ui';
import { Field, reduxForm } from 'redux-form';
import { geolocated } from 'react-geolocated';
import axios from 'axios';
import { connect } from 'react-redux';

import FormField from './FormField';
import { searchAppointments, getSpecialties } from '../actions';

class Search extends Component {

  state = { 
    locationAvailable: false,
    lat: 0, 
    long: 0, 
    location: '', 
    specialty: '', 
    fetchedLocation: '',
    searching: false
  }

  componentDidMount() {
    this.props.getSpecialties();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coords) {
      this.updateLocation(nextProps.coords.longitude, nextProps.coords.latitude);
      this.setState({ long: nextProps.coords.longitude, lat: nextProps.coords.latitude })
    }
  }

  renderLocation = () => {
    if (!this.props.isGeolocationAvailable) {
      return <div>Your browser does not support Geolocation. Please manually type the location.</div> 
    } else if (this.props.coords) {
      return (
        <div>
          <div>Your current location is: &nbsp; <span style={{fontSize: '20px'}}>{this.state.location}</span></div>
        </div> 
      )
    } else {
      return <div>Getting the location data&hellip; </div>
    }
  }

  updateLocation = async (long, lat) => {
    try {
      const googleMapAPI = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=true`
      const res = await axios.get(googleMapAPI);
      const location = res.data.results[0].formatted_address;
      this.setState({ fetchedLocation: location, location, locationAvailable: true });
    } catch (e) {
      this.setState({ locationAvailable: false, location: '', fetchedLocation: '' });
    }
  }

  handleUpdateInput = (value) => {
    this.setState({ specialty: value })
  }

  renderAutoCompleteField(field) {
    return (
      <div style={{position: 'relative', top: '50px'}} >
        <AutoComplete
          hintText={field}
          dataSource={this.props.specialties}
          floatingLabelText={field}
          onUpdateInput={this.handleUpdateInput}
          filter={AutoComplete.fuzzyFilter}
          fullWidth={true}
        />
      </div>
    )
  }

  renderButton() {
    return (
      <div style={{position: 'relative', top: '150px'}}>{
        this.state.locationAvailable || this.state.location ? 
          <button 
            className="right btn waves-effect waves-light" 
            type='submit'
          >
            Search for your next appointment
          </button> :
          <button
            className="btn disabled right" 
          >
            Location not available
          </button>
      }</div>
    )
  }

  handleChangeLocation = (value, newvalue, original) => {
    if (newvalue) {
      this.setState({ location: newvalue });
    } else {
      this.setState({ location: this.state.fetchedLocation })
    }
  }

  inputLocationField = () => {
    return (
      <div style={{position: 'relative', top: '50px'}} >
        <Field
          component={FormField}
          label="You may search for a different location"
          hintText="Boston, MA 02110"
          name="location"
          onChange={this.handleChangeLocation}
        />
      </div>
    );
  }

  inputDoctorName = () => {
    return (
      <div style={{position: 'relative', top: '50px'}} >
        <Field
          component={FormField}
          label="Doctor Name"
          hintText="Jane Smith"
          name="doctorname"
        />
      </div>
    )
  }

  onSubmit = async ({ doctorname, location }) => {
    let loc = { lng: this.state.long, lat: this.state.lat }

    if (location) {
      const googleGeoCode = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}`
      const res = await axios.get(googleGeoCode);
      loc = res.data.results[0].geometry.location;
    } 
    this.setState({ searching: true });
    const locationData = `${loc.lat},${loc.lng},20`
    await this.props.searchAppointments({ doctorname, specialty: this.props.m[this.state.specialty], location: locationData });
    this.setState({ searching: false });
    this.props.history.push('/search/result');
  }

  render() {
    return (
      <div className="container" style={{fontFamily:'Amaranth'}} >
        <div style={{position: 'relative', top: '50px', fontSize: '20px'}} >
            Search for your earliest appointment for nearby doctors.
        </div>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          {this.inputDoctorName()}
          {this.renderAutoCompleteField('Specialty')}
          {this.inputLocationField()}
          { this.state.searching ?
            <div className="center" style={{position: 'relative', top: '100px'}} >
              <CircularProgress size={60} thickness={7} />
            </div> :
            <div>
              <div className="center" style={{position: 'relative', top: '100px'}} >
                {this.renderLocation()}
              </div>
              {this.renderButton()}
            </div>
          }
        </form>
      </div>
    )
  }
}

const mapStateToProps = ({ special }) => {
  let listOfSpecialties = Object.keys(special);
  return { specialties: listOfSpecialties, m: special }
}

const form = reduxForm({
  form: 'search'
})(Search)

const geo = geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(form);

export default connect(mapStateToProps, { searchAppointments, getSpecialties })(geo);
