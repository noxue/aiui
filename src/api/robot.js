import request from '@/utils/request'

export function findAllApp(appName) {
  const data = {
    appName
  }
  return request({
    url: '/app/all',
    method: 'post',
    data
  })
}

export function delApp(aid) {
  const data = {
    aid
  }
  return request({
    url: '/app/del',
    method: 'post',
    data
  })
}

export function editApp(aid,name,description) {
  const data = {
    aid,
    name,
    description
  }
  return request({
    url: '/app/edit',
    method: 'post',
    data
  })
}
