import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/tool/image/token',
    method: 'post'
  })
}

export function deleteQiniuFile(data) {
  return request({
    url: '/tool/image/delete',
    method: 'post',
    data
  })
}

export function QiniuFiles(data) {
  return request({
    url: '/tool/image/list',
    method: 'post',
    data
  })
}
