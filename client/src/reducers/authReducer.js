import { AUTH_SUCCESS, AUTH_FAIL, LOGOUT } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case AUTH_FAIL:
      return { ...state, error: action.payload }
    case AUTH_SUCCESS:
      return { ...state, authenticated: true, error: '' }
    case LOGOUT:
      return { ...state, authenticated: false }
    default: 
      return state;
  }
}
