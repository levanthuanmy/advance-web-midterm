export const API_URL = process.env.REACT_APP_API_URL
export const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
export const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET
export const GG_REDIRECT_URI = process.env.REACT_APP_GG_REDIRECT_URI

export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Email sai định dạng",
}

export const minLengthPassword = {
  value: 6,
  message: "Mật khẩu cần phải lớn hơn 6 kí tự",
}