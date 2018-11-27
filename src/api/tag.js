import request from '@/utils/request'

export function tagList(query) {
  return request({
    url: '/tag',
    method: 'get',
    params: query
  })
}

export function tagCreate(data) {
  return request({
    url: '/tag',
    method: 'post',
    data
  })
}

export function tagUpdate(data) {
  return request({
    url: '/tag/' + data.id,
    method: 'put',
    data
  })
}

export function TagDelete(id) {
  return request({
    url: '/tag/' + id,
    method: 'delete'
  })
}
