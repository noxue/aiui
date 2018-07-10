import request from '@/utils/request'

export function getUserConfig(para) {
  return request({
    url: '/config/select',
    method: 'post',
    data: para
  })
}

export function addUserConfig(para) {
  return request({
    url: '/config/add',
    method: 'post',
    data: para
  })
}

export function deleteApp(params) {
  return request({
    url: '/app/del',
    method: 'post',
    data: params
  })
}

export function editApp(para) {
  return request({
    url: '/app/edit',
    method: 'post',
    data: para
  })
}
