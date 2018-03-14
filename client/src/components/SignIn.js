import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import FormField from './FormField';
import { signInUser } from '../actions';

class Login extends Component {

  signInButton() {
    return (
      <div>
        <button
          className="right btn waves-effect waves-light"
          type="submit"
          name="action"
        >
          Sign In
          <i className="material-icons right">send</i>
        </button>
      </div>
    )
  }

  signUpButton() {
    return (
      <div>
        <button
          className="left btn waves-effect waves-light"
        >
          <Link 
            to='/signup' 
            style={{color:'white'}} 
          >
            Sign Up
          </Link>
        </button>
      </div>
    )
  }

  renderErrorMessage() {
    if (this.props.errorMessage) {
      return (
        <div style={{color: 'red'}}>
          {this.props.errorMessage}
        </div>
      );
    }
  }
  
  // needs pre-loading for signing the user
  onLogin = ({ email, password }) => {
    this.props.signInUser(email, password, this.props.history)
  }

  render() {
    return (
      <div>
        <div className="container" style={{paddingTop: '40px', maxWidth: '500px'}} >
          <form onSubmit={this.props.handleSubmit(this.onLogin)} className="center">
            <Field
              component={FormField}
              label="Email"
              name="email"
            />
            <Field
              component={FormField}
              label="Password"
              name="password"
              type="password"
            />
            {this.renderErrorMessage()}
            <div>
              {this.signUpButton()}
              {this.signInButton()}
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
})(Login)

export default connect(mapStateToProps, { signInUser })(withRouter(form));
