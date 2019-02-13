import { combineReducers } from 'redux'
import counter from './counter'
import user from './user';
import activity from './activity';

export default combineReducers({
  counter,
  user,
  activity,
})
