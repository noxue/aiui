
const TokenKey = 'token'
const AppId = 'appId'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  localStorage.removeItem(TokenKey)
}

export function getAppId() {
  return localStorage.getItem(AppId)
}

export function setAppId(appId) {
  localStorage.setItem(AppId, appId)
}

export function removeAppId() {
  localStorage.removeItem(AppId)
}
