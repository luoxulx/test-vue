import request from '@/utils/request'

export function categoryList(query) {
  return request({
    url: '/category',
    method: 'get',
    params: query
  })
}

export function categoryCreate(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

export function categoryUpdate(data) {
  return request({
    url: '/category/' + data.id,
    method: 'put',
    data
  })
}

export function categoryDelete(id) {
  return request({
    url: '/category/' + id,
    method: 'delete'
  })
}

