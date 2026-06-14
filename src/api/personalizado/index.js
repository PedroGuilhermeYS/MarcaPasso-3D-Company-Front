const useMock = import.meta.env.VITE_API_MOCK === 'true'

const personalizadoApi = useMock
  ? await import('./personalizadoMock.js')
  : await import('./personalizadoApi.js')

export const {
  criarPedidoPersonalizadoNaApi,
  getPedidosPersonalizadosDoUsuarioNaApi,
  getPedidoPersonalizadoDetalheNaApi,
  getTodosPersonalizadosAdminNaApi,
  atualizarStatusPersonalizadoNaApi,
} = personalizadoApi
