import request from '@/utils/request'

export function getTaskList(para) {
  return request({
    url: '/task/taskList',
    method: 'post',
    data: para
  })
}

export function addTask(para) {
  return request({
    url: '/task/add',
    method: 'post',
    data: para
  })
}

export function deleteTask(params) {
  return request({
    url: '/task/del',
    method: 'post',
    data: params
  })
}

export function editTask(para) {
  return request({
    url: '/task/edit',
    method: 'post',
    data: para
  })
}

export function getTaskUserList(para) {
  return request({
    url: '/task/user/conditions',
    method: 'post',
    data: para
  })
}

export function getTemplateListById(para) {
  return request({
    url: '/template/listById',
    method: 'post',
    data: para
  })
}

export function getSimListById(para) {
  return request({
    url: '/sim/listById',
    method: 'post',
    data: para
  })
}

export function expExcel(para) {
  return request({
    url: '/task/exp',
    method: 'get',
    data: para
  })
}

export function impExcel(para) {
  return request({
    url: '/task/imp',
    method: 'post',
    data: para
  })
}