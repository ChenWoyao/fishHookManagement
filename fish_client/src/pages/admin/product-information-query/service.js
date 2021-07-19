import request, { baseUrl } from '@/utils/request';

export async function queryRule(params) {
  return request(`${baseUrl}/api/products/admin_list`, {
    params,
  });
}

export async function createOrUpdateRule(params) {
  return request(`${baseUrl}/api/products/admin_create_or_update/`, {
    method: 'POST',
    data: { ...params },
  });
}

