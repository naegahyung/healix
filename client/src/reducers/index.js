import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import appointmentReducer from './appointmentReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';
import specialtyReducer from './specialtyReducer';

export default combineReducers({
  appointments: appointmentReducer,
  form: formReducer,
  auth: authReducer,
  user: userReducer,
  special: specialtyReducer
})