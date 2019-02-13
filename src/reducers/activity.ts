import { GOACTIVITY } from '../constants/activity'

const INITIAL_STATE = {
  current: '',
}

export default function user (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GOACTIVITY:
      return {
        ...state,
        ...action.payload
      }
     default:
       return state
  }
}
