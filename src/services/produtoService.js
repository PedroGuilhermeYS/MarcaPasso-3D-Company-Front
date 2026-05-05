import {
  getTodosProdutosNaApi,
  getProdutoNaApi,
  addProdutoNaApi,
  removeProdutoNaApi,
  atualizaProdutoNaApi,
} from '@/api/produto'

export function useProdutoService() {

  async function buscarTodos() {
    return await getTodosProdutosNaApi()
  }

  async function buscarProduto(id) {
    return await getProdutoNaApi(id)
  }

  async function adicionarProduto(produto) {
    return await addProdutoNaApi({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoria: produto.categoria,
      personalizavel: produto.personalizavel,
      imagemPrincipal: produto.imagemPrincipal?.name ?? produto.imagemPrincipal ?? null,
    })
  }

  async function removerProduto(id) {
    return await removeProdutoNaApi(id)
  }

  async function atualizarProduto(id, produto) {
    return await atualizaProdutoNaApi(id, {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoria: produto.categoria,
      personalizavel: produto.personalizavel,
      imagemPrincipal: produto.imagemPrincipal ?? null,
    })
  }

  return {
    buscarTodos,
    buscarProduto,
    adicionarProduto,
    removerProduto,
    atualizarProduto,
  }
}