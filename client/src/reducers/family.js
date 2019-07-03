import {
  REGISTER_FAMILY,
  REGISTER_FAMILY_DONE
} from '../constants';

const initialState = {
  isFamAuth: false,
  famData: [],
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
    default:
      return state;
  }
 
}

export default family;