import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/transaction/list',
    method: 'get',
    params: query
  })
}
