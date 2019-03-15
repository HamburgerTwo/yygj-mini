import request from '../core/request';
import { User } from '../types/user';
import { sourceFrom } from '../config';
export function bindingPhone(phone: string, openId: string): Promise<{
  memberId: number,
  authToken: string,
}> {
  return request.post<{
    memberId: number,
    authToken: string,
  }>('/yygj/service/applet/bingdingPhone', { phone, openId, sourceFrom }, { auth: false, type: 'form' });
}


export function saveUserInfo(user: User): Promise<User> {
  return request.post<User>('/employee/updateEmployee', user);
}

export function loginByWechatOauth(code: string, accountType: string): Promise<
  any
> {
  return request.post<any>('/auth/employee/loginByWechatOauth', { code, accountType }, { auth: false });
}

export function findEmployeeByJwt(): Promise<
  any
> {
  return request.post<any>('/employee/findEmployeeByJwt', {});
}

export function bindEmployeeRole(user: any): Promise<User> {
  return request.post<User>('/employee/bindEmployeeRole', user);
}

export function findEmployeeByPhone(mobilePhone: string) {
  return request.get<any>('/employee/findEmployeeByPhone', { params: { mobilePhone, t: new Date().getTime() } });
}

export function sendValidateCode(phone: string) {
  return request.post<any>('/message/sendValidateCode', {phone, taskId: 7} );
}

export function loginByPhoneValidateCode(phone: string, validateCode: string) {
  return request.post<any>('/auth/employee/loginByPhoneValidateCode', {phone, validateCode} );
}

export function loginByPhonePwd(phone: string, password: string) {
  return request.post<any>('/auth/employee/loginByPhonePwd', {phone, password} );
}