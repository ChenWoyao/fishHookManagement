import request, { baseUrl } from '@/utils/request';

export async function queryRule(params) {
  return request(`${baseUrl}/api/output_produce/`, {
    params,
  });
}

export async function updateRule(params) {
  return request(`${baseUrl}/api/output_produce/`, {
    method: 'POST',
    data: { ...params },
  });
}

