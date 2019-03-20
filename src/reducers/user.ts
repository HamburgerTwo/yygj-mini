import { SIGN, USERINFO, BINGDING, GETSESSION, BINDINGPHONE, TEMPORARY } from '../constants/user'

const INITIAL_STATE = {
  isSign: false,
  sessionKey: '',
  userinfo: {},
  tempoaryUser: {},
}

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SIGN:
      return {
        ...state,
        ...action.payload
      }
    case USERINFO:
      return {
        ...state,
        userinfo: { ...state.userinfo, ...action.payload }
      }
    case BINGDING:
      return {
        ...state,
        ...action.payload
      }
    case GETSESSION:
      return {
        ...state,
        ...action.payload,
        userinfo: { ...state.userinfo, ...action.payload.userinfo }
      }
    case BINDINGPHONE: 
      return {
        ...state,
        authToken: action.payload.authToken,
        memberId: action.payload.memberId,
        userinfo: {
          ...state.userinfo,
          mobilePhone: action.payload.mobilePhone,
        }
      }
    case TEMPORARY: 
      return {
        ...state,
        tempoaryUser: action.payload.userinfo
      }
    default:
      return state
  }
}
