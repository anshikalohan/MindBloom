import axios from 'axios'

const baseEnv = import.meta.env.VITE_API_URL || ''
const API_URL = baseEnv.endsWith('/') ? baseEnv.slice(0, -1) : baseEnv

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 307) {
      const redirectUrl = err.response.headers.location
      return api.request({
        ...err.config,
        url: redirectUrl,
      })
    }
    if (err.response?.status === 401) {
      localStorage.removeItem('mb_token')
      localStorage.removeItem('mb_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api