import axios from 'axios'
import { ApiError } from '@/errors/ApiError'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
})

axiosInstance.interceptors.request.use(
  (config) => {
    const usuario = import.meta.env.VITE_API_USER || 'user'
    const senha = import.meta.env.VITE_API_PASSWORD || ''
    const token = btoa(`${usuario}:${senha}`)
    config.headers.Authorization = `Basic ${token}`
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
      console.error('Não autorizado. Verifique usuário e senha no .env')
    }

    return Promise.reject(new ApiError(message, status, data))
  }
)

export default axiosInstance