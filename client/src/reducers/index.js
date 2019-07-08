import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import userReducer from './user';
import familyReducer from './family';

export default combineReducers({
  user: userReducer,
  family: familyReducer,
  form: formReducer
});