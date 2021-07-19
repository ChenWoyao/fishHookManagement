import request, { baseUrl } from '@/utils/request';

export async function queryRule(params) {
  return request(`${baseUrl}/api/orders/`, {
    params: {
      ...params,
      "status_in": "0,1"
    },
  });
}

export async function addRule(params) {
  return request(`${baseUrl}/api/orders/`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateRule(params) {
  return request(`${baseUrl}/api/orders/`, {
    method: 'POST',
    data: { ...params },
  });
}

// 需要穿id, status=2
export async function removeRule(params) {
  return request(`${baseUrl}/api/orders/`, {
    method: 'POST',
    data: { ...params },
  });
}

// 根据产品名字name查询产品信息
export async function getProductions(params) {
  return request(`${baseUrl}/api/products/`, {
    params,
  })
}

// 根据客户名字company查询客户信息
export async function getClients(params) {
  return request(`${baseUrl}/api/client_profile/`, {
    params,
  });
}
