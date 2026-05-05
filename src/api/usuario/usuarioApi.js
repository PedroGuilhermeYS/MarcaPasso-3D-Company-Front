import axiosInstance from '../config'

export async function getTodosUsuariosNaApi() {
  const { data } = await axiosInstance.get('/api/usuarios')
  return data
}

export async function getUsuarioNaApi(id) {
  const { data } = await axiosInstance.get(`/api/usuarios/${id}`)
  return data
}

export async function desativarUsuarioNaApi(id) {
  const { data } = await axiosInstance.patch(`/api/usuarios/${id}/desativar`)
  return data
}