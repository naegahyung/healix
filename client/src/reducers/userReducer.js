import { FETCH_USER_INFO, BOOK_APPT } from '../actions/types';


export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_USER_INFO:
      console.log(action.payload);
      return { ...state, info: action.payload }
    case BOOK_APPT:
      return { ...state, info: action.payload }  
    default: 
      return state;
  }
}