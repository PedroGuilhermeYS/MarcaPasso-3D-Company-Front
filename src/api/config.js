import axios from 'axios'
import { ApiError } from '@/errors/ApiError'

const axiosInstance = axios.create({
  // ESSA É A LINHA MÁGICA QUE FALTA:
  baseURL: 'http://localhost:8080', 
  
  // As outras configurações que você já tiver aí continuam normais
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token')
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
      console.error('Sessão expirada. Faça login novamente.')
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('usuario')
    }

    return Promise.reject(new ApiError(message, status, data))
  }
)

export default axiosInstance