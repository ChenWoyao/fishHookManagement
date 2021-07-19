import request, { baseUrl } from '@/utils/request';

export async function queryRule(params) {
  return request(`${baseUrl}/api/output_produce/audit`, {
    params,
  });
}

export async function getProductions(params) {
  return request(`${baseUrl}/api/products/`, {
    params,
  })
}

export async function addRule(params) {
  return request(`${baseUrl}/api/output_produce/`, {
    method: 'POST',
    data: { ...params },
  });
}
