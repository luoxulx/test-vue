import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/qiniu_file/token',
    method: 'post'
  })
}

export function deleteQiniuFile(data) {
  return request({
    url: '/qiniu_file/delete',
    method: 'post',
    data
  })
}

export function QiniuFiles(data) {
  return request({
    url: '/qiniu_file/list',
    method: 'post',
    data
  })
}

export function QiniuUpload(data) {
  return request({
    url: '/qiniu_file/upload',
    method: 'post',
    data
  })
}
