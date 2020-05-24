import axios from "axios"

const getJwt = () => {
  return window.localStorage.getItem('accessToken')
}

const AxiosHttpRequest = async (method, url, data) => {
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

module.exports = {
  getJwt,
  AxiosHttpRequest
}