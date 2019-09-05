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
  SET_SELECTED_CHILD,
  ADD_CHORE,
  ADD_CHORE_DONE,
  EDIT_CHORE,
  EDIT_CHORE_DONE,
  DELETE_CHORE,
  DELETE_CHORE_DONE,
  SAVE_SCHEDULE,
  SAVE_SCHEDULE_DONE
} from '../constants';
import reducerUtils from '../util/reducerUtils';

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
        familyData: action.payload? reducerUtils.addPersonToFamilyData({familyData:state.familyData},action.payload) : null,
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
        familyData: action.payload? action.payload.family: null,
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
        familyData: action.payload?{...action.payload.family}:null,
        apiError: action.error? action.error : null,
      }
    case SET_IS_FAM_AUTH:
      return {
        ...state,
        isFamAuth: action.auth
      }
    case SET_IS_PARENT_AUTH:
      return {
        ...state,
        isParentAuth: action.auth
      }
    case SET_IS_CHILD_AUTH:
      return {
        ...state,
        isChildAth: action.auth
      }
    case SET_SELECTED_CHILD:
      return {
        ...state,
        selectedChild: action.child
      }
    case ADD_CHORE:
      return {
        ...state,
        fetching: true
      }
    case ADD_CHORE_DONE:
      return {
        ...state,
        familyData: action.payload? {...reducerUtils.addChoreToFamilyData({familyData:state.familyData},action.payload)} : state.familyData,
        apiError: action.error? action.error : null,
        fetching: false
      }
    case EDIT_CHORE:
      return {
        ...state,
        fetching: true
      }
    case EDIT_CHORE_DONE:
      return {
        ...state,
        familyData: action.payload? {...reducerUtils.editChoreToFamilyData({familyData:state.familyData},action.payload)} : state.familyData,
        apiError: action.error? action.error: null,
        fetching: false,

      }
    case DELETE_CHORE:
      return {
        ...state,
        fetching: true
      }
    case DELETE_CHORE_DONE:
      return {
        ...state,
        familyData: action.payload?{...reducerUtils.deleteChoreToFamilyData({familyData: state.familyData}, action.payload)}: state.familyData,
        apiError: action.error? action.error: null,
        fetching: false
      }  
    case SAVE_SCHEDULE:
      return {
        ...state,
        fetching: true
      }  
    case SAVE_SCHEDULE_DONE:
      return {
        ...state,
        familyData: action.payload?{...reducerUtils.updateScheduleToFamilyData({familyData: state.familyData}, action.payload)}: state.familyData,
        apiError: action.error? action.error: null,
        fetching: false
      }  
    default:
      return state;
  }
 
}

export default family;

const findSelectedChildSchedule = ({selectedChild, familyData}, child_id=null) => {
  let schedule = familyData.schedules.filter(s=> {
    let childId = child_id? child_id: (selectedChild||{})._id;
    if(s.child_id===childId) return true;
    return false;
  })
  return schedule[0];
}

// const updatePersonToFamilyData = (family, payload) => {

//   if(payload.parent) {
//     let filtered =family.familyData.parents.filter(p => {
//       if (p._id !==payload.parent._id) return true;
//     });

//     family.familyData.parents=[...filtered, payload.parent]
//   }

//   if (payload.child) {
//     let filtered =family.familyData.children.filter(c => {
//       if (c._id !==payload.child._id) return true;
//     });

//     family.familyData.children=[...filtered, payload.children]
//   }

//   return family.familyData;
// }

