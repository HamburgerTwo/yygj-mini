import { SIGN, USERINFO, BINGDING } from '../constants/user'

const INITIAL_STATE = {
  userName: '',
  isSign: false,
  userinfo: {},
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
     default:
  return state
}
}
