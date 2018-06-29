import request from '@/utils/request'

export function getSimList(para) {
  return request({
    url: '/sim/all',
    method: 'post',
    data: para
  })
}

export function addSim(para) {
  return request({
    url: '/sim/add',
    method: 'post',
    data: para
  })
}

export function deleteSim(params) {
  return request({
    url: '/sim/del',
    method: 'post',
    data: params
  })
}

export function editSim(para) {
  return request({
    url: '/sim/edit',
    method: 'post',
    data: para
  })
}

export function getGatewaysListByUid(para) {
  return request({
    url: '/gateway/listByUid',
    method: 'post',
    data: para
  })
}
