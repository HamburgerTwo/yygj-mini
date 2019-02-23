import request from '../core/request';
import { User } from '../types/user';
export function bindingPhone(phone: string,openid: string): Promise<{

}> {
  return request.post<{
  }>('/yygj/service/applet/bingdingPhone', { phone, openid }, {
    auth: false
  });
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
return request.get<any>('/employee/findEmployeeByJwt');
}
