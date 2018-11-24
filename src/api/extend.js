import request from '@/utils/request'

export function fetchLaravelLog(query) {
  return request({
    url: '/extend/laravel_log',
    method: 'get',
    params: query
  })
}
