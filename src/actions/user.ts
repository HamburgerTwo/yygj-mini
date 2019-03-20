import {
  SIGN, BINGDING, GETSESSION, BINDINGPHONE, ROLE, TEMPORARY
} from '../constants/user';
import { sign, bingdingStore } from '../services';
import { saveUserInfo, loginByWechatOauth, findEmployeeByJwt, bindingPhone, bindEmployeeRole, findEmployeeByPhone } from '../services/user'
import { findOrganizationByIdOrNo } from '../services/store';
import { User } from '../types/user';
import Taro from '@tarojs/taro'
import { accountType } from '../config';

export const signAction = (phone: string) => dispatch => {

  return sign(phone).then(res => (dispatch({
    type: SIGN,
    payload: {
      userName: '店员A',
      isSign: true
    }
  })))
}

export const loginByWechatOauthAction = (code: string, accountType: string) => dispatch => {
  return loginByWechatOauth(code, accountType).then(res => {
    if (res.orgNo) {
      return findOrganizationByIdOrNo(res.orgNo).then(store => ({
        ...res, orgName: store.orgName
      }))
    } else {
      return {
        ...res, orgName: ''
      }
    }
  }).then(res => (
    dispatch({
      type: GETSESSION,
      payload: {
        ...res,
        isSign: res.roles && res.roles.length > 0 && res.orgNo,
        userinfo: {
          nickName: res.nickName,
          headimg: res.headimg,
          gender: res.gender,
          memberId: res.memberId,
          mobilePhone: res.mobilePhone,
          roles: res.roles,
          orgNo: res.orgNo,
          memberName: res.memberName,
          orgName: res.orgName,
          status: res.status,
        }
      }
    })
  ))
}

export const saveUserInfoAction = (userinfo: User) => (dispatch, getState) => {
  const state = getState();
  const { user } = state;
  const { tempoaryUser = {} } = user;
  return saveUserInfo({ memberId: user.memberId, ...userinfo, ...tempoaryUser }).then(() => {
    return dispatch({
      type: GETSESSION,
      payload: {
        isSign: userinfo.roles && userinfo.roles.length > 0 && userinfo.orgNo,
        userinfo,
      }
    })
  })
  // return dispatch({
  //   type: USERINFO,
  //   payload: userinfo
  // })
}
export const bingdingAction = (data: Object) => dispatch => {

  return bingdingStore(data).then(res => (dispatch({
    type: BINGDING,
    payload: {
      message: "绑定成功"
    }
  })))
}

export const findEmployeeByJwtAction = dispatch => {
  return findEmployeeByJwt().then(res => {
    const { memberAuth } = res;
    if (Array.isArray(memberAuth)) {
      const auth = memberAuth.filter(x => x.identityType === accountType);
      if (auth.length === 0) {
        throw {};
      }
    } else {
      throw {};
    }
    if (res.orgNo) {
      return findOrganizationByIdOrNo(res.orgNo).then(store => ({
        ...res, orgName: store.orgName, orgStatus: store.status
      }))
    } else {
      return {
        ...res, orgName: ''
      }
    }
  }).then(res => {
    const { memberAuth } = res;
    const auth = memberAuth.filter(x => x.identityType === accountType);
    const identity = auth[0].identity;
    return dispatch({
      type: GETSESSION,
      payload: {
        ...res,
        isSign: res.roles && res.roles.length > 0 && res.orgNo,
        identity,
        userinfo: {
          nickName: res.nickName,
          headimg: res.headimg,
          gender: res.gender,
          memberId: res.memberId,
          mobilePhone: res.mobilePhone,
          roles: res.roles,
          orgNo: res.orgNo,
          memberName: res.memberName,
          orgName: res.orgName,
          status: res.status,
          orgStatus: res.orgStatus
        }
      }
    })
  })
}

export const bindingPhoneAction = (phone) => (dispatch, getState) => {
  const state = getState();
  const { user } = state;
  return bindingPhone(phone, user.identity).then((res) => {
    return dispatch({
      type: BINDINGPHONE,
      payload: { mobilePhone: phone, memberId: res.memberId, authToken: res.authToken }
    })
  })
}

export const bindEmployeeRoleAction = (userinfo: any) => (dispatch, getState) => {
  const state = getState();
  const { user } = state;
  return bindEmployeeRole({ memberId: user.memberId, ...userinfo }).then(() => {
    return dispatch({
      type: GETSESSION,
      payload: {
        isSign: userinfo.orgNo && userinfo.roleType,
        userinfo: { ...userinfo, roles: [ROLE.CLERK] }
      }
    })
  })
}

export const findEmployeeByPhoneAction = (mobilePhone: string) => dispatch => {
  return findEmployeeByPhone(mobilePhone).then(res => {
    if (res.orgNo) {
      return findOrganizationByIdOrNo(res.orgNo).then(store => ({
        ...res, orgName: store.orgName, orgStatus: store.status,
      }))
    } else {
      return {
        ...res, orgName: ''
      }
    }
  }).then(res => (
    dispatch({
      type: GETSESSION,
      payload: {
        ...res,
        isSign: res.roles && res.roles.length > 0 && res.orgNo,
        userinfo: {
          nickName: res.nickName,
          headimg: res.headimg,
          gender: res.gender,
          memberId: res.memberId,
          mobilePhone: res.mobilePhone,
          roles: res.roles,
          orgNo: res.orgNo,
          memberName: res.memberName,
          orgName: res.orgName,
          status: res.status,
          orgStatus: res.orgStatus
        }
      }
    })))
}

export const saveTemporaryUserInfoAction = (userinfo: any) => (dispatch) => {
  return Promise.resolve().then(() => {
    return dispatch({
      type: TEMPORARY,
      payload: {
        userinfo,
      }
    })
  })
}