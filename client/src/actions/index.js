import axios from 'axios';

import { AUTH_SUCCESS, AUTH_FAIL, FETCH_USER_INFO, FETCH_SPECIALTIES, SIGNUP_SUCCESS, FETCH_DOCTORS, LOGOUT, BOOK_APPT } from './types';

export const signInUser = (email, password, history) => async dispatch => {
  try {
    const res = await axios.post('/api/login', {username:email, password})
    // if (email === 'admin' && password === 'admin') {
    dispatch({ type: AUTH_SUCCESS }); 
    history.push('/home')
  } catch(e) {
    dispatch({ type: AUTH_FAIL, payload: 'Incorrect credentials. Try again.' });
  }
}
export const signUp = (username, password, firstName, lastName, insuranceId, birthday) => async dispatch => {
  const res = await axios.post('/api/signup', {username, password, firstName, lastName, insuranceId, birthday});
  dispatch({type: SIGNUP_SUCCESS})
}

export const fetchUserInfo = () => async dispatch => {
  const res = await axios.get('/api/user_appointments');
  dispatch({ type: FETCH_USER_INFO, payload: res.data });
}

export const searchAppointments = ({ doctorname, specialty, location }) => async dispatch => {
  const res = await axios.post('/api/search', { name: doctorname, specialty, location });
  dispatch({ type: FETCH_DOCTORS, payload: res.data })
}

export const getSpecialties = () => async dispatch => {
  const res = await axios.get('/api/getSpecialties');
  dispatch({ type: FETCH_SPECIALTIES, payload: res.data });
}

export const logOut = () => async dispatch => {
  dispatch({ type: LOGOUT });
}

export const bookAppointment = ({ userId, doctorId, doctorName, timeframe }) => async dispatch => {
  // const res = await axios.post('/api/add_appointment', { userId, doctorId, timeframe, doctorName }); 
  const res = await axios.post('/api/makeAppointment', { doctorName:doctorName, doctorUid: doctorId, timeframe: timeframe/1000 })
  dispatch({ type: BOOK_APPT, payload: res.data })
  
}