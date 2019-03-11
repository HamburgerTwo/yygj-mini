import { GOACTIVITY, ACTIVITY,CONFIG } from '../constants/activity'

const INITIAL_STATE = {
  current: '',
  list:[],
  config: {},
}

export default function user (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GOACTIVITY:
      return {
        ...state,
        ...action.payload
      }
    case ACTIVITY:
      return {
        ...state,
        ...action.payload
      }
      case CONFIG:
      return {
        ...state,
        config: action.payload
      }
     default:
       return state
  }
}
