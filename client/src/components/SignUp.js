import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {DatePicker} from 'material-ui'
import FormField from './FormField';
import { signUp } from '../actions';

class SignUp extends Component {
  constructor(props) {
    super(props);
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() + 1);
    birthDate.setHours(0, 0, 0, 0);

    this.state = {
      birthDate: birthDate,
      autoOk: false,
      disableYearSelection: false,
    };
  }

  handleChangeDate = (event, date) => {
    this.setState({
      birthDate: date,
    });
  };
  cancelButton(){
    return (
      <div>
        <button 
        className="left btn waves-effect waves-light"
        >
          <Link 
            to='/'
            style={{color:'white'}}>
            Cancel
          </Link>
        </button>
      </div>
    )
  }
  signUpButton() {
    return (
      <div>
        <button
          className="right btn waves-effect waves-light" type='submit'
        >
        Sign Up
        </button>
      </div>
    )
  }
  signUp = ({ username, password, firstName, lastName, insuranceId, date}) => {
    console.log("username is ",username );
    console.log("password is ",password );
    console.log("firstName is ",firstName );
    console.log("lastName is ",lastName );
    console.log("insuranceId is ", insuranceId);
    console.log('birthday is ', date);
    this.props.signUp(username, password, firstName, lastName, insuranceId, '9/12/1995')
    this.props.history.push('/home');
  }
  render(){
    return (
    <div>
      <div className="container" style={{paddingTop: '40px', maxWidth: '500px'}} >
        <form className="center" onSubmit={this.props.handleSubmit(this.signUp)}>
        <Field
            component={FormField}
            label="Email"
            name="email"
          />
          <Field
            component={FormField}
            label="Username"
            name="username"
          />
          <Field
            component={FormField}
            label="Password"
            name="password"
            type="password"
          />
          <Field
            component={FormField}
            label="First Name"
            name="firstName"
          />
          <Field
            component={FormField}
            label="Last Name"
            name="lastName"
          />
          <Field
            component={FormField}
            label="Insurance Id"
            name="insuranceId"
          />
          <DatePicker
            name="date"
            onChange={this.handleChangeDate}
            autoOk={this.state.autoOk}
            floatingLabelText="Birthday"
            defaultDate={this.state.birthDate}
            disableYearSelection={this.state.disableYearSelection}
          />
          <div>
            {this.signUpButton()}
            {this.cancelButton()}
          </div>
        </form>
      </div>
    </div>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  return { errorMessage: auth.error }
}

const form = reduxForm({
  form: 'signin'
})(SignUp)

export default connect(mapStateToProps, { signUp })(withRouter(form));
