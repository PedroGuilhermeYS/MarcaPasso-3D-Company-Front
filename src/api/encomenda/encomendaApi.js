import axiosInstance from "../config";

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

export async function getTodosEncomendasAdminNaApi() {
  const { data } = await axiosInstance.get('/api/encomendas/admin/todas')
  return data
}

export async function getEncomendasDoUsuarioNaApi(idUsuario) {
  const { data } = await axiosInstance.get(`/api/encomendas/${idUsuario}`);
  return data.map(mapearResumo);
}

export async function getEncomendaDetalheNaApi(idUsuario, idEncomenda) {
  const { data } = await axiosInstance.get(`/api/encomendas/${idUsuario}/${idEncomenda}`);
  return data;
}

export async function criarEncomendaNaApi(idUsuario, encomenda) {
  const { data } = await axiosInstance.post(`/api/encomendas/${idUsuario}`, encomenda);
  return data;
}