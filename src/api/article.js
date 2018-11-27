import request from '@/utils/request'

export function articleList(query) {
  return request({
    url: '/article',
    method: 'get',
    params: query
  })
}

export function articleDetail(id) {
  return request({
    url: '/article/' + id,
    method: 'get'
  })
}

export function articleCreate(data) {
  return request({
    url: '/article',
    method: 'post',
    data
  })
}

export function articleUpdate(data) {
  return request({
    url: '/article/' + data.id,
    method: 'put',
    data
  })
}

export function articleDelete(id) {
  return request({
    url: '/article/' + id,
    method: 'delete'
  })
}
