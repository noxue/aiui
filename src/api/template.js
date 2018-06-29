import request from '@/utils/request'

export function getTemplateList(para) {
  return request({
    url: '/template/all',
    method: 'post',
    data: para
  })
}
