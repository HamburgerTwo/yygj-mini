import {
  GOACTIVITY
} from '../constants/activity';

export const goToAction = (url: string) => dispatch => {
  return new Promise((res,rej) => {
    setTimeout(() => {
      dispatch({
        type: GOACTIVITY,
        payload: {
          current: url,
        }
      });
      res();
    },5000)
  })
  
  
}
