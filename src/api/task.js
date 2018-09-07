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

export function editTaskStatus(para) {
  return request({
    url: '/task/status',
    method: 'post',
    data: para
  })
}

export function editTaskUser(para) {
  return request({
    url: '/task/user/edit',
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
    method: 'post',
    data: para
  })
}

export function expExc(para) {
  return request({
    url: '/task/expExc',
    method: 'post',
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

export function getTemplate(id) {
  return request({
    url: '/template/' + id,
    method: 'get'
  })
}

export function getCountList(para) {
  return request({
    url: '/task/user/count',
    method: 'post',
    data: para
  })
}

export function getTaskToDo() {
  return request({
    url: '/task/todo',
    method: 'get'
  })
}

export function toDoRedial(para) {
  return request({
    url: '/task/toRedial',
    method: 'post',
    data: para
  })
}

export function countUserType(para) {
  return request({
    url: '/task/user/type',
    method: 'post',
    data: para
  })
}

export function todayCount() {
  return request({
    url: '/task/todayCount',
    method: 'post'
  })
}

export function getTaskUser(id) {
  return request({
    url: '/task/user/' + id,
    method: 'get'
  })
}

export function getTask(para) {
  return request({
    url: '/task/select',
    method: 'post',
    data: para
  })
}

export function isBanding() {
  return request({
    url: '/task/isBanding',
    method: 'post'
  })
}
