import {
  REGISTER_FAMILY,
  REGISTER_FAMILY_DONE,
  LOGIN_FAMILY,
  LOGIN_FAMILY_DONE,
  SET_IS_FAM_AUTH,
  SET_IS_PARENT_AUTH,
  SET_IS_CHILD_AUTH

} from '../constants';

const initialState = {
  isFamAuth: false,
  isParentAuth: false,
  isChildAuth: false,
  familyData: null,
  //parents: [],
  //children: [],
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
        familyData: action.payload? action.payload.family : null,
        apiError: action.error? action.error : null,
        isFamAuth: true
      }
    case LOGIN_FAMILY:
      return {
        ...state,
        fetching: true
      };
    case LOGIN_FAMILY_DONE:
      return {
        ...state,
        fetching: false,
        familyData: action.payload.family,
        apiError: action.error? action.error : null,
        isFamAuth: true
      }
    case SET_IS_FAM_AUTH:
      return {
        ...state,
        isFamAuth: true
      }
    default:
      return state;
  }
 
}

export default family;