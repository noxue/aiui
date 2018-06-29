import request from '@/utils/request'

export function getAppList(para) {
  return request({
    url: '/app/all',
    method: 'post',
    data: para
  })
}

export function addApp(para) {
  return request({
    url: '/app/add',
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
