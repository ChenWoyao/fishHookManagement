import request, { baseUrl } from '@/utils/request';

export async function queryRule(params) {
  return request(`${baseUrl}/api/output_produce/admin_list/`, {
    params,
  });
}

