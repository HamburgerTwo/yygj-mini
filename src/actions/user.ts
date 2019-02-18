import {
  SIGN, USERINFO
} from '../constants/user';
import { sign, saveUserInfo } from '../services';
import { User } from '../types/user';

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

export const saveUserInfoAction = (userinfo: User) => dispatch => {
  saveUserInfo(userinfo).then(res => {
    return dispatch({
      type: USERINFO,
      payload: res
    })
  })
}