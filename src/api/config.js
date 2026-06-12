import axios from 'axios'
import { ApiError } from '@/errors/ApiError'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token')
    console.log('>>> [axios] Token no localStorage:', token ? 'EXISTE' : 'NÃO EXISTE')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('>>> [axios] Header Authorization definido')
    } else {
      console.warn('>>> [axios] Nenhum token! Request vai sem autenticação.')
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
      console.error('Sessão expirada. Faça login novamente.')
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('usuario')
    }

    return Promise.reject(new ApiError(message, status, data))
  }
)

export default axiosInstance