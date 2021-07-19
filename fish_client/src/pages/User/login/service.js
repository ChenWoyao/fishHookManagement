import request from 'umi-request';
import Api, { baseUrl } from '@/utils/request'

// 登录
export async function fakeAccountLogin(params) {
  return request(`${baseUrl}/api-token-auth/`, {
    method: 'POST',
    data: params,
  });
}
// 获取当前用户信息
export async function fakeCurrentUser(token) {
  return Api(`${baseUrl}/api/users/info/`, {
    headers: {
      'Authorization': token,
    }
  });
}
