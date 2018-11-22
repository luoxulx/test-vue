import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/show',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/store',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'put',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: '/article/' + id,
    method: 'delete'
  })
}
