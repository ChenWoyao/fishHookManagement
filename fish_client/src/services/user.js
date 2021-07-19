import request, { baseUrl } from '@/utils/request';

export async function query() {
  return request('/api/users');
}
// 获取当前用户信息
export async function queryCurrent(token) {
  return request(`${baseUrl}/api/users/info/`, {
    headers: {
      'Authorization': token,
    }
  });
}
export async function queryNotices() {
  return request('/api/notices');
}
