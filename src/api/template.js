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
