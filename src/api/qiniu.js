import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/tool/qiniu/get_token',
    method: 'post'
  })
}
