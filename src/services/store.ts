import request from '../core/request';
import { store } from '../types/store';
export function findOrganizationByIdOrNo(orgNo: string): Promise<store> {
  return request.get<store>('/organization/findOrganizationByIdOrNo', { params: {orgNo} });
}