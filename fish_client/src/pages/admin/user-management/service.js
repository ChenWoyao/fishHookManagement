import request, { baseUrl } from '@/utils/request';

export async function queryRule(params) {
  return request(`${baseUrl}/api/users/admin_list/`, {
    params,
  });
}

export async function updateRule(params) {
  return request(`${baseUrl}/api/users/user_update/`, {
    method: 'POST',
    data: { ...params },
  });
}
