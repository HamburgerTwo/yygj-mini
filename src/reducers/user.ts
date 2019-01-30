import { SIGN } from '../constants/user'

const INITIAL_STATE = {
  userName: '',
  isSign: false,
}

export default function user (state = INITIAL_STATE, action) {
  console.log(action)
  switch (action.type) {
    case SIGN:
      return {
        ...state,
        ...action.payload
      }
     default:
       return state
  }
}
