import request from '@/utils/request'

export function getGatewayList(para) {
  return request({
    url: '/gateway/all',
    method: 'post',
    data: para
  })
}

export function addGateway(para) {
  return request({
    url: '/gateway/add',
    method: 'post',
    data: para
  })
}

export function deleteGateway(params) {
  return request({
    url: '/gateway/del',
    method: 'post',
    data: params
  })
}

export function editGateway(para) {
  return request({
    url: '/gateway/edit',
    method: 'post',
    data: para
  })
}

export function getAllApp(para) {
  return request({
    url: '/app/allApp',
    method: 'post',
    data: para
  })
}
