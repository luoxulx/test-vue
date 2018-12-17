import request from '@/utils/request'

export function LocalFiles(data) {
  return request({
    url: '/upload/local_list',
    method: 'post',
    data
  })
}

export function LocalUpload(data) {
  return request({
    url: '/upload/local_upload',
    method: 'post',
    data
  })
}

