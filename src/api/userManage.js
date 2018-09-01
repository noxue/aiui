import request from '@/utils/request'

export function getUserList(para) {
  return request({
    url: 'user/list',
    method: 'post',
    data: para
  })
}

export function addUser(para) {
  return request({
    url: '/user/add',
    method: 'post',
    data: para
  })
}

export function deleteUser(params) {
  return request({
    url: '/user/del',
    method: 'post',
    data: params
  })
}

export function editUser(para) {
  return request({
    url: '/user/edit',
    method: 'post',
    data: para
  })
}

export function roleList() {
  return request({
    url: '/user/roleList',
    method: 'post'
  })
}

export function banding(para) {
  return request({
    url: '/user/banding',
    method: 'post',
    data: para
  })
}
