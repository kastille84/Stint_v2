import {
  REGISTER_FAMILY,
  REGISTER_FAMILY_DONE
} from '../constants';

const initialState = {
  isFamAuth: false,
  familyData: null,
  parents: [],
  children: [],
  fetching: false,
  apiError: null
}


const family = (state=initialState, action) => {
  switch(action.type) {
    case REGISTER_FAMILY:
      return {
        ...state,
        fetching: true
      };
    case REGISTER_FAMILY_DONE:
      return {
        ...state,
        fetching: false,
        familyData: action.payload,
        apiError: action.error? action.error : null
      }
    default:
      return state;
  }
 
}

export default family;