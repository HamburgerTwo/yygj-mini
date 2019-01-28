import request, { Request, middlewares } from '../core/request';

export function getTest(id: string): Promise<{
  code: string,
  id: number
}> {
  return request.post<{
    code: string,
    id: number
  }>('http://www.baidu.com/test', { id });
}
