import {
  SIGN, USERINFO
} from '../constants/user';
import { sign } from '../services';

export const signAction = (phone: string) => dispatch => {
  
  return sign(phone).then(res =>(dispatch({
    type: SIGN,
    payload: {
      userName: '店员A',
      isSign: true
    }
  })))
}

export const userinfoAction = (userinfo: Object) => dispatch => {
  
  return dispatch({
    type: USERINFO,
    payload: userinfo
  })
}