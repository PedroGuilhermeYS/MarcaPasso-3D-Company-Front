import {
  criarPedidoPersonalizadoNaApi,
  getPedidosPersonalizadosDoUsuarioNaApi,
  getPedidoPersonalizadoDetalheNaApi,
} from '@/api/personalizado'

export function usePersonalizadoService() {

  async function criarPedido(idUsuario, pedido) {
    return await criarPedidoPersonalizadoNaApi(idUsuario, pedido)
  }

  async function buscarPedidos(idUsuario) {
    return await getPedidosPersonalizadosDoUsuarioNaApi(idUsuario)
  }

  async function buscarDetalhe(idUsuario, idPedido) {
    return await getPedidoPersonalizadoDetalheNaApi(idUsuario, idPedido)
  }

  return {
    criarPedido,
    buscarPedidos,
    buscarDetalhe,
  }
}
