import {
  getTodosFavoritosNaApi,
  addFavoritoNaApi,
  removeFavoritoNaApi,
  removeTodosFavoritosNaApi,
} from '@/api/favorito'

export function useFavoritoService() {

  async function buscarTodos(idUsuario) {
    return await getTodosFavoritosNaApi(idUsuario)
  }

  async function adicionarFavorito(idUsuario, idProduto) {
    return await addFavoritoNaApi(idUsuario, idProduto)
  }

  async function removerFavorito(idUsuario, idProduto) {
    return await removeFavoritoNaApi(idUsuario, idProduto)
  }

  async function removerTodosFavoritos(idUsuario) {
    return await removeTodosFavoritosNaApi(idUsuario)
  }

  return {
    buscarTodos,
    adicionarFavorito,
    removerFavorito,
    removerTodosFavoritos,
  }
}