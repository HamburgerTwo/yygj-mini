import {
  SIGN, USERINFO, BINGDING, GETSESSION
} from '../constants/user';
import { sign, bingdingStore } from '../services';
import { saveUserInfo, loginByWechatOauth, findEmployeeByJwt, bindingPhone} from '../services/user'
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

export const loginByWechatOauthAction = (code: string, accountType: string) => dispatch => {
  return loginByWechatOauth(code, accountType).then(res =>(dispatch({
    type: GETSESSION,
    payload: {
      ...res,
    }
  })))
}

export const saveUserInfoAction = (userinfo: User) => (dispatch, getState) => {
  // const state =getState();
  // const { user } = state;
  // saveUserInfo({ memberId: user.memberId, ...userinfo }).then(res => {
  //   return dispatch({
  //     type: USERINFO,
  //     payload: res
  //   })
  // })
  return dispatch({
    type: USERINFO,
    payload: userinfo
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

export const findEmployeeByJwtAction = dispatch => {
  return findEmployeeByJwt().then(res =>(dispatch({
    type: GETSESSION,
    payload: {
      ...res,
    }
  })))
}

export const bindingPhoneAction = (phone) => (dispatch, getState) => {
  const state =getState();
  const { user } = state;
  return bindingPhone(user.identity, phone).then(() => {
    return dispatch({
      type: USERINFO,
      payload: { telephone: phone }
    })
  })
}