import axiosInstance from "../config";

// GET — buscar todos os favoritos do usuário
export async function getTodosFavoritosNaApi(idUsuario) {
  const { data } = await axiosInstance.get(`/favoritos/${idUsuario}`)
  return data
}

// POST — adicionar produto ao favorito
export async function addFavoritoNaApi(idUsuario, idProduto) {
  const { data } = await axiosInstance.post(`/favoritos/${idUsuario}/produto/${idProduto}`)
  return data
}

// DELETE — remover produto do favorito
export async function removeFavoritoNaApi(idUsuario, idProduto) {
  const { data } = await axiosInstance.delete(`/favoritos/${idUsuario}/produto/${idProduto}`)
  return data
}

// DELETE — limpar todos os favoritos do usuário
export async function removeTodosFavoritosNaApi(idUsuario) {
  await axiosInstance.delete(`/favoritos/${idUsuario}`)
  return []
}