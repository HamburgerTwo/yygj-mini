import { SIGN, USERINFO, BINGDING, GETSESSION, BINDINGPHONE } from '../constants/user'

const INITIAL_STATE = {
  isSign: false,
  sessionKey: '',
  userinfo: {}
}

export default function user(state = INITIAL_STATE, action) {
  console.log(action)
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
          telephone: action.payload.telephone,
        }
      }
    default:
      return state
  }
}
