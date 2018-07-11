import request from '@/utils/request'

export function getTemplateList(para) {
  return request({
    url: '/template/all',
    method: 'post',
    data: para
  })
}

export function deleteTemplate(para) {
  return request({
    url: '/template/del',
    method: 'post',
    data: para
  })
}

export function updateTemplate(id, data) {
  return request({
    url: '/template/' + id,
    method: 'put',
    data: data
  })
}

export function addTemplate(data) {
  return request({
    url: '/template',
    method: 'post',
    data: data
  })
}

export function getTemplate(id) {
  return request({
    url: '/template/' + id,
    method: 'get'
  })
}
