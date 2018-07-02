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
