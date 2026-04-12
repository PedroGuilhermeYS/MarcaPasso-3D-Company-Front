import axiosInstance from "../config";

// Mapeia os campos do backend para o padrão do frontend
function mapearItem(item) {
  return {
    id: item.idItem,
    idProduto: item.idProduto,
    nome: item.nomeProduto,
    imagem: item.imagemPrincipal,
    quantidade: item.quantidade,
    preco: item.precoUnitario,
  }
}

// GET — buscar itens do carrinho
export async function getCarrinhoNaApi(idUsuario) {
  const { data } = await axiosInstance.get(`/api/carrinho/${idUsuario}`)
  return data.map(mapearItem)
}

export async function getItemCarrinhoNaApi(id) {
  // Backend não tem endpoint individual de item
  return null
}

// POST — adicionar item ao carrinho
export async function addItemCarrinhoNaApi(idUsuario, item) {
  const { data } = await axiosInstance.post(`/api/carrinho/${idUsuario}/item`, {
    idProduto: item.id,
    quantidade: item.quantidade,
    precoUnitario: item.preco,
  })
  return data.map(mapearItem)
}

// PUT — atualizar quantidade (será implementado futuramente)
export async function updateQuantidadeItemNaApi(id, quantidade) {
  return { id, quantidade }
}

// DELETE — remover item
export async function removeItemCarrinhoNaApi(id) {
  await axiosInstance.delete(`/api/carrinho/item/${id}`)
  return { id }
}

export async function removeTodosItensCarrinhoNaApi() {
  return []
}