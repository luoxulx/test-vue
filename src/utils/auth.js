import Cookies from 'js-cookie'
const TempJWTKey = 'temp_jwt_token'
export function getJWTToken() {
  return Cookies.get(TempJWTKey)
}

export function setJWTToken(value) {
  return Cookies.set(TempJWTKey, value)
}

export function removeJWTToken() {
  return Cookies.remove(TempJWTKey)
}
