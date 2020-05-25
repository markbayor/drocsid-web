import axios from "axios"

export const getJwt = () => {
  return window.localStorage.getItem('accessToken')
}

export const setJwt = (jwt) => {
  return window.localStorage.setItem('accessToken', jwt)
}

export const removeJwt = () => {
  window.localStorage.removeItem('accessToken')
}

export const AxiosHttpRequest = async (method, url, data) => {
  switch (method) {
    case 'GET':
      return axios.get(url, {
        headers: {
          'Authorization': `Bearer ${getJwt()}`
        }
      })
    case 'POST':
      return axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${getJwt()}`,
        }
      })
    case 'DELETE':
      return axios.delete(url,
        {
          headers: {
            'Authorization': `Bearer ${getJWt()}`
          }
        })
  }
}
