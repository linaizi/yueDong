export function getToken() {
  return uni.getStorageSync('Token')
}
export function saveToken(token) {
  console.log(token, '===========');
	uni.setStorageSync('Token', token)
}

export function getSessionToken() {
  return sessionStorage.getItem('TOKEN_SESSION');
}
export function saveSessionToken(token) {
  sessionStorage.setItem('TOKEN_SESSION', token)
}
export function getUserInfo() {
  return JSON.parse(localStorage.getItem('USER_KEY') || '{}')
}
export function saveUserInfo(userInfo) {
  localStorage.setItem('USER_KEY', JSON.stringify(userInfo));
}
export function clearStorage() {
  localStorage.clear();
  sessionStorage.clear()
}
export const verifyPhoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

