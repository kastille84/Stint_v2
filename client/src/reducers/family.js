import {
  REGISTER_FAMILY,
  REGISTER_FAMILY_DONE,
  LOGIN_FAMILY,
  LOGIN_FAMILY_DONE,
  SET_IS_FAM_AUTH,
  SET_IS_PARENT_AUTH,
  SET_IS_CHILD_AUTH,
  REGISTER_PERSON,
  REGISTER_PERSON_DONE,
  SET_FAMILY_DATA,
  SET_FAMILY_DATA_DONE,
  SET_SELECTED_CHILD
} from '../constants';

const initialState = {
  isFamAuth: false,
  isParentAuth: false,
  isChildAuth: false,
  familyData: null,
  selectedChild: null,
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
    case REGISTER_PERSON:
      return {
        ...state,
        fetching: true
      };
    case REGISTER_PERSON_DONE:
      return {
        ...state,
        fetching: false,
        familyData: action.payload? addPersonToFamilyData({familyData:state.familyData},action.payload) : null,
        apiError: action.error? action.error : null
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
    case SET_FAMILY_DATA:
      return {
        ...state,
        fetching: true
      };
    case SET_FAMILY_DATA_DONE:
      return {
        ...state,
        fetching: false,
        familyData: action.payload?action.payload.family:null,
        apiError: action.error? action.error : null,
      }
    case SET_IS_FAM_AUTH:
      return {
        ...state,
        isFamAuth: true
      }
    case SET_SELECTED_CHILD:
      return {
        ...state,
        selectedChild: action.child
      }
    default:
      return state;
  }
 
}

export default family;

const addPersonToFamilyData = (family, payload) => {
  console.log('familyData', family)
  console.log('person', payload)

  if(payload.parent) {
    family.familyData.parents.push(payload.parent)
  }

  if (payload.child) {
    family.familyData.children.push(payload.child)
  }

  return family.familyData;

}

const updatePersonToFamilyData = (family, payload) => {
  console.log('family', family)
  console.log('payload', payload)

  if(payload.parent) {
    let filtered =family.familyData.parents.filter(p => {
      if (p._id !==payload.parent._id) return true;
    });

    family.familyData.parents=[...filtered, payload.parent]
  }

  if (payload.child) {
    let filtered =family.familyData.children.filter(c => {
      if (c._id !==payload.child._id) return true;
    });

    family.familyData.children=[...filtered, payload.children]
  }

  return family.familyData;
}