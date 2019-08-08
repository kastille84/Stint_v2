import {
  LOGIN_PERSON,
  LOGIN_PERSON_DONE,
  SET_PERSON_DATA,
  SET_PERSON_DATA_DONE
} from '../constants'

const initialState = {
  personType: null,
  userData: null,
  fetching: false,
  apiError: null
}


const user = (state=initialState, action) => {
  switch(action.type) {
    case LOGIN_PERSON:
      return {
        ...state,
        fetching: true
      };
    case LOGIN_PERSON_DONE:
      return {
        ...state,
        fetching: false,
        personType: action.payload? Object.keys(action.payload).includes('parent') ? "parent":"child":null,
        userData: action.payload? Object.keys(action.payload).includes('parent') ? action.payload.parent: action.payload.child: null,
        apiError: action.error? action.error : null
      }
    case SET_PERSON_DATA:
      return {
        ...state,
        fetching: true
      };
    case SET_PERSON_DATA_DONE:
      return {
        ...state,
        fetching: false,
        personType: action.payload? Object.keys(action.payload).includes('parent') ? "parent":"child":null,
        userData: action.payload? Object.keys(action.payload).includes('parent') ? action.payload.parent: action.payload.child: null,
        apiError: action.error? action.error : null
      }
    default:
      return state;
  }
}

export default user;