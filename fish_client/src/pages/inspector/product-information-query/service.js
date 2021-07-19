import request, { baseUrl } from '@/utils/request';

export async function queryRule(params) {
  return request(`${baseUrl}/api/products/`, {
    params,
  })
}


