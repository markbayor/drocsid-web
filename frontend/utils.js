import axios from "axios"

const getJwt = () => {
  window.localStorage.getItem('accessToken')
}

const AxiosHttpRequest = async (method, url, data) => {
  if (data) {
    return axios[method](url, data, {
      headers: {
        'Authorization': `Bearer ${getJwt()}`
      }
    })
  } else {
    return axios[method](url, {
      headers: {
        'Authorization': `Bearer ${getJwt()}`
      }
    })
  }
}

module.exports = {
  getJwt,
  AxiosHttpRequest
}