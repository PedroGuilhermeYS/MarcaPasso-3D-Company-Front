const useMock = import.meta.env.VITE_API_MOCK === 'true'

const usuarioApi = useMock
  ? await import('./usuarioMock.js')
  : await import('./usuarioApi.js')

export const {
  getTodosUsuariosNaApi,
  getUsuarioNaApi,
  desativarUsuarioNaApi,
} = usuarioApi