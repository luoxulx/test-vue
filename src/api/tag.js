import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/tag',
    method: 'get',
    params: query
  })
}

export function createTag(data) {
  return request({
    url: '/tag',
    method: 'post',
    data
  })
}

export function updateTag(data) {
  return request({
    url: '/tag/' + data.id,
    method: 'put',
    data
  })
}

export function deleteTag(id) {
  return request({
    url: '/tag/' + id,
    method: 'delete'
  })
}
