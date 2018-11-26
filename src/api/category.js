import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/category',
    method: 'get',
    params: query
  })
}

export function createCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/category/' + data.id,
    method: 'put',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'delete'
  })
}

