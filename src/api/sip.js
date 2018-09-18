import request from '@/utils/request'

export function getSipList(para) {
  return request({
    url: '/sip/all',
    method: 'post',
    data: para
  })
}

export function getAllSip(para) {
  return request({
    url: '/sip/allSip',
    method: 'post',
    data: para
  })
}

export function addSip(para) {
  return request({
    url: '/sip/add',
    method: 'post',
    data: para
  })
}

export function sipUserList() {
  return request({
    url: '/sip/user/all',
    method: 'get'
  })
}

export function getSipListById(para) {
  return request({
    url: '/sip/user/listById',
    method: 'post',
    data: para
  })
}

export function userList(para) {
  return request({
    url: '/sip/user/list',
    method: 'post',
    data: para
  })
}

export function addSipUser(para) {
  return request({
    url: '/sip/user/add',
    method: 'post',
    data: para
  })
}

export function deleteSip(id) {
  return request({
    url: '/sip/del/' + id,
    method: 'get'
  })
}

export function editSip(para) {
  return request({
    url: '/sip/edit',
    method: 'post',
    data: para
  })
}
