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

export async function getCarrinhoNaApi(idUsuario = 1) {
  const { data } = await axiosInstance.get(`/api/carrinho/${idUsuario}`)
  return data.map(mapearItem)
}

export async function getItemCarrinhoNaApi(id) {
  // Backend não tem endpoint individual de item — retorna null
  return null
}

export async function addItemCarrinhoNaApi(item) {
  // Será implementado futuramente com endpoint POST
  return item
}

export async function updateQuantidadeItemNaApi(id, quantidade) {
  // Será implementado futuramente com endpoint PUT
  return { id, quantidade }
}

export async function removeItemCarrinhoNaApi(id) {
  await axiosInstance.delete(`/api/carrinho/item/${id}`)
  return { id }
}

export async function removeTodosItensCarrinhoNaApi() {
  // Será implementado futuramente
  return []
}