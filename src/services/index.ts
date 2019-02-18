import request, { Request, middlewares } from '../core/request';
import { User } from '../types/user';
export function sign(phone: string): Promise<{
  userName: string,
}> {
  return request.post<{
    userName: string,
  }>('http://www.baidu.com/test', { phone });
}

export function getArea(): Promise<Array<{
  id: number,
  value: string,
}>> {
  return request.post<Array<{
    id: number,
    value: string,
  }>>('http://www.baidu.com/test', { });
  }

  export function getDirstict(areaId: number): Promise<Array<{
    id: number,
    value: string,
  }>> {
    return request.post<Array<{
      id: number,
      value: string,
    }>>('http://www.baidu.com/test', { areaId });
    }

  export function getChain(districtId: number): Promise<Array<{
      id: number,
      value: string,
    }>> {
      return request.post<Array<{
        id: number,
        value: string,
    }>>('http://www.baidu.com/test', { districtId });
    }
  export function saveUserInfo(user: User): Promise<User>{
    return request.post<User>('http://www.baidu.com/test', user );
  }