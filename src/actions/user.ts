import {
  SIGN, USERINFO, BINGDING
} from '../constants/user';
import { sign, saveUserInfo, bingdingStore } from '../services';
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
export const bingdingAction = (data: Object) => dispatch => {

  return bingdingStore(data).then(res =>(dispatch({
    type: BINGDING,
    payload: {
      message: "绑定成功"
    }
  })))
}
