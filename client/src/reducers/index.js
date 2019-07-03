import {combineReducers} from 'redux';
import userReducer from './user';
import familyReducer from './family';

export default combineReducers({
  user: userReducer,
  family: familyReducer
});