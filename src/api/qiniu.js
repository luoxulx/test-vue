import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/upload/qiniu_token',
    method: 'post'
  })
}

export function deleteQiniuFile(data) {
  return request({
    url: '/upload/qiniu_del',
    method: 'post',
    data
  })
}

export function QiniuFiles(data) {
  return request({
    url: '/upload/qiniu_list',
    method: 'post',
    data
  })
}

export function QiniuUpload(data) {
  return request({
    url: '/upload/qiniu_upload',
    method: 'post',
    data
  })
}
