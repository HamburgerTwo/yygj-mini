import {
  SIGN
} from '../constants/user';
import { sign } from '../services';

export const signAction = (phone: string) => dispatch => {
  console.log(dispatch)
  return sign(phone).then(res =>(dispatch({
    type: SIGN,
    payload: {
      userName: '店员A',
      isSign: true
    }
  })))
}
