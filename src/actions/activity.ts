import {
  GOACTIVITY, ACTIVITY
} from '../constants/activity';
import { getActivity } from '../services/activity';
export const goToAction = (url: string) => dispatch => {
  return new Promise((res,rej) => {
      dispatch({
        type: GOACTIVITY,
        payload: {
          current: url,
        }
      });
      res();
  })
}

export const getActivityAction = (dispatch, getState) => {
  const state = getState();
  const { user= {
    memberId: '0',
  } } = state;
  const { memberId } = user;
  return getActivity(memberId).then(res => {
    dispatch({
      type: ACTIVITY,
      payload: {
        list: res,
      }
    });
  })
}