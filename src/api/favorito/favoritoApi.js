import axiosInstance from "../config";

export async function getTodosFavoritosNaApi(idUsuario) {
  const { data } = await axiosInstance.get(`/favoritos/${idUsuario}`)
  return data
}

export async function addFavoritoNaApi(idUsuario, idProduto) {
  const { data } = await axiosInstance.post(`/favoritos/${idUsuario}/produto/${idProduto}`)
  return data
}

export async function removeFavoritoNaApi(idUsuario, idProduto) {
  const { data } = await axiosInstance.delete(`/favoritos/${idUsuario}/produto/${idProduto}`)
  return data
}

export async function removeTodosFavoritosNaApi(idUsuario) {
  await axiosInstance.delete(`/favoritos/${idUsuario}`)
  return []
}