import axios from "axios"
import * as queryString from "query-string"
import { CLIENT_ID, CLIENT_SECRET, GG_REDIRECT_URI } from "./constants"

export function getAccessTokenFromCode(code) {
  var data = require("qs").stringify({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: GG_REDIRECT_URI,
    grant_type: "authorization_code",
  })

  var config = {
    method: "post",
    url: "https://oauth2.googleapis.com/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  }
  return axios(config)
    .then(function (response) {
      console.log("qwdqwdwq",)
      return response.data.access_token
    })
    .catch(function (error) {
      console.log(error)
      return null
    })

}

export async function getGoogleUserInfo(access_token) {
  const { data } = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  return data
}

const stringifiedParams = queryString.stringify({
  client_id: CLIENT_ID,
  redirect_uri: GG_REDIRECT_URI,
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" "), // space separated string
  response_type: "code",
  access_type: "offline",
  prompt: "consent",
})

export const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
