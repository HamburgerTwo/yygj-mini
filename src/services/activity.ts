import request from '../core/request';
import { activity } from '../types/activity';
export function getActivity(clerkId: string) : Promise<Array<activity>> {
  return request.get<Array<activity>>('/yygj/service/member/activity', { params: {clerkId, isMiniApp: true} });
}

export function getConfig() : any {
 
   return request.get<Array<activity>>('/wechatMiniApplet/getAppletConfig', {
     auth: false
   });
}