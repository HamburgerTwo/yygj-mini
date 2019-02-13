import {
  GOACTIVITY
} from '../constants/activity';

export const goToAction = (url: string) => dispatch => {
  dispatch({
    type: GOACTIVITY,
    payload: {
      current: url,
    }
  })
}
