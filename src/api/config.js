import axios from 'axios'
import { ApiError } from '@/errors/ApiError'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const data = error.response?.data
    const message =
      data?.message ||
      error.message ||
      'Erro inesperado na comunicação com o servidor'

    if (status === 401) {
      console.error('Não autorizado. Faça login novamente.')
    }

    return Promise.reject(new ApiError(message, status, data))
  }
)

export default axiosInstance