import request from 'umi-request';
import { baseUrl } from '@/utils/request'

export async function userRgisterApi(params) {
  // 注册
  return request(`${baseUrl}/api/users/user_create/`, {
    method: 'POST',
    data: params,
  })
}
