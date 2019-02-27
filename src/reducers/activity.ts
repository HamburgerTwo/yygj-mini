import { GOACTIVITY, ACTIVITY } from '../constants/activity'

const INITIAL_STATE = {
  current: '',
  list:[],
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
     default:
       return state
  }
}
