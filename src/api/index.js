import axios from 'axios'
import { API_URL } from '../config/constants'

const headers = { 'Content-Type': 'application/json; charset=UTF-8' }
const baseURL = API_URL

if (!baseURL) throw new Error('API URL not defined')

const client = axios.create({ baseURL, headers })

export const get = async (path, token = '', params, headers, responseType = 'json') => {
  try {
    if (token?.length) {
      headers = { 'Content-Type': 'application/json; charset=UTF-8', Authorization: `Bearer ${token}` }
    }

    const res = await client.get(path, { params, headers, responseType })
    return res.data
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)

      throw error.response.data.error
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)

      throw error.message
    }
    console.log(error.config)

    throw error
  }
}

export const post = async (path, token = '', params, data, headers) => {
  try {
    if (token?.length) {
      headers = { 'Content-Type': 'application/json; charset=UTF-8', Authorization: `Bearer ${token}` }
    }

    const res = await client.post(path, data, { params, headers })
    return res.data
  } catch (error) {
    if (error.response) {
      console.log('post - error.response', error.response)
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
      throw error.response.data.error
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
      throw error.message
    }
    console.log(error.config)
    throw error
  }
}

export const patch = async (path, token = '', params, data, headers) => {
  try {
    if (token?.length) {
      headers = { 'Content-Type': 'application/json; charset=UTF-8', Authorization: `Bearer ${token}` }
    }

    const res = await client.patch(path, data, { params, headers })
    return res.data
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)

      throw error.response.data.error
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)

      throw error.message

    }
    console.log(error.config)

    throw error
  }
}