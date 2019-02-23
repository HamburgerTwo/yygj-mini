import { SIGN, USERINFO, BINGDING, GETSESSION } from '../constants/user'

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
        ...action.payload
      }
    default:
      return state
  }
}
