import request from '@/utils/request'

/* -----------------------------open api start----------------------------- */
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function loginByEmail(email, password) {
  const data = {
    email,
    password
  }
  return request({
    url: 'auth/login',
    method: 'post',
    data
  })
}

/* ----------------------------- open api end ------------------------------- */

/* ------------------------------- JWT auth:api operation-start ------------------------------- */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/user_info',
    method: 'get'
  })
}

// upload token
export function getUploadToken() {
  return request({
    url: '/file/upload_token',
    method: 'get'
  })
}
export function fileUpload(data) {
  return request({
    url: 'file/upload',
    method: 'post',
    data
  })
}

/* article-start */
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
/* article-start */

// category--start
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
// category--end

// tag--start
export function tagIndex(query) {
  return request({
    url: '/tag',
    method: 'get',
    params: query
  })
}

export function tagCreate(data) {
  return request({
    url: '/tag',
    method: 'post',
    data
  })
}

export function tagUpdate(data) {
  return request({
    url: '/tag/' + data.id,
    method: 'put',
    data
  })
}

export function TagDelete(id) {
  return request({
    url: '/tag/' + id,
    method: 'delete'
  })
}
// tag--end

// laravel-log
export function fetchLaravelLog(query) {
  return request({
    url: '/extend/laravel_log',
    method: 'get',
    params: query
  })
}

/* -------------------------------JWT auth:api operation -end--------------------------------- */
