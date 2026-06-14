import axiosInstance from "../config";

// ── Usuário ──────────────────────────────────────────────────

export async function criarPedidoPersonalizadoNaApi(idUsuario, pedido) {
  const { data } = await axiosInstance.post(`/api/personalizados/${idUsuario}`, pedido);
  return data;
}

export async function getPedidosPersonalizadosDoUsuarioNaApi(idUsuario) {
  const { data } = await axiosInstance.get(`/api/personalizados/${idUsuario}`);
  return data;
}

export async function getPedidoPersonalizadoDetalheNaApi(idUsuario, idPedido) {
  const { data } = await axiosInstance.get(`/api/personalizados/${idUsuario}/${idPedido}`);
  return data;
}

// ── Admin ────────────────────────────────────────────────────

export async function getTodosPersonalizadosAdminNaApi() {
  const { data } = await axiosInstance.get(`/api/personalizados`);
  return data;
}

export async function atualizarStatusPersonalizadoNaApi(idPedido, status) {
  const { data } = await axiosInstance.patch(`/api/personalizados/admin/${idPedido}/status`, { status });
  return data;
}
