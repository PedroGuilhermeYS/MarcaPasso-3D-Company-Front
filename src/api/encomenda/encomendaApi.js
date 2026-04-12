import axiosInstance from "../config";

// Mapeia resumo do backend para o padrão do frontend
function mapearResumo(e) {
  return {
    id: e.id,
    numeroPedido: e.numeroPedido,
    dataHora: e.dataHora,
    formaPagamento: e.formaPagamento,
    status: e.status,
    total: e.total,
  };
}

// GET — lista de pedidos do usuário
export async function getEncomendasDoUsuarioNaApi(idUsuario) {
  const { data } = await axiosInstance.get(`/api/encomendas/${idUsuario}`);
  return data.map(mapearResumo);
}

// GET — detalhe de um pedido
export async function getEncomendaDetalheNaApi(idUsuario, idEncomenda) {
  const { data } = await axiosInstance.get(`/api/encomendas/${idUsuario}/${idEncomenda}`);
  return data;
}

// POST — criar novo pedido
export async function criarEncomendaNaApi(idUsuario, encomenda) {
  const { data } = await axiosInstance.post(`/api/encomendas/${idUsuario}`, encomenda);
  return data;
}
