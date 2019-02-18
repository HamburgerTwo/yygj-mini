import request, { Request, middlewares } from '../core/request';

export function sign(phone: string): Promise<{

}> {
  return request.post<{
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

// 查询门店
export function queryStore(): Promise<Array<{
  code: number,
}>> {
  return request.post<Array<{
    code: number,
  }>>('http://www.baidu.com/test', { });
}

// 绑定门店
export function bingdingStore(data: Object): Promise<Array<{
}>> {
  return request.post<Array<{}>>('http://www.baidu.com/test', { data });
}
