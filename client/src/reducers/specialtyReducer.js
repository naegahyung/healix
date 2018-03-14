import { FETCH_SPECIALTIES } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_SPECIALTIES:
      return action.payload;
    default:
      return state;
  }
}