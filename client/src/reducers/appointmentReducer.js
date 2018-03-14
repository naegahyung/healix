import { FETCH_DOCTORS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_DOCTORS:
      return action.payload;
    default: 
      return state;
  }
}
