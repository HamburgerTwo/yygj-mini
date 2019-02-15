import request, { Request, middlewares } from '../core/request';

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