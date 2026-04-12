import {
  getCarrinhoNaApi,
  getItemCarrinhoNaApi,
  addItemCarrinhoNaApi,
  updateQuantidadeItemNaApi,
  removeItemCarrinhoNaApi,
  removeTodosItensCarrinhoNaApi,
} from '@/api/carrinho'

export function useCarrinhoService() {

  async function buscarTodos(idUsuario) {
    return await getCarrinhoNaApi(idUsuario)
  }

  async function buscarItem(id) {
    return await getItemCarrinhoNaApi(id)
  }

  // Recebe idUsuario e item
  async function adicionarItem(idUsuario, item) {
    return await addItemCarrinhoNaApi(idUsuario, item)
  }

  async function alterarQuantidade(id, quantidade) {
    return await updateQuantidadeItemNaApi(id, quantidade)
  }

  async function removerItem(id) {
    return await removeItemCarrinhoNaApi(id)
  }

  async function limparCarrinho() {
    return await removeTodosItensCarrinhoNaApi()
  }

  return {
    buscarTodos,
    buscarItem,
    adicionarItem,
    alterarQuantidade,
    removerItem,
    limparCarrinho,
  }
}