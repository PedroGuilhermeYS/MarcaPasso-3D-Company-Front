import {
  getEncomendasDoUsuarioNaApi,
  getEncomendaDetalheNaApi,
  criarEncomendaNaApi,
} from '@/api/encomenda'

export function useEncomendasService() {

  async function buscarEncomendas(idUsuario) {
    return await getEncomendasDoUsuarioNaApi(idUsuario)
  }

  async function buscarDetalhe(idUsuario, idEncomenda) {
    return await getEncomendaDetalheNaApi(idUsuario, idEncomenda)
  }

  async function criarEncomenda(idUsuario, encomenda) {
    return await criarEncomendaNaApi(idUsuario, encomenda)
  }

  return {
    buscarEncomendas,
    buscarDetalhe,
    criarEncomenda,
  }
}
