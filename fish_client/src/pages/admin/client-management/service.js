import request, { baseUrl } from '@/utils/request';

export async function queryRule(params) {
  return request(`${baseUrl}/api/client_profile/`, {
    params,
  });
}

export async function createOrUpdateRule(params) {
  return request(`${baseUrl}/api/client_profile/`, {
    method: 'POST',
    data: { ...params },
  });
}

