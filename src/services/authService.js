import { doLoginNaApi, verificaLoginNaApi, doLogoutNaApi, doCadastroNaApi } from '@/api/auth'

export function useAuthService() {
  function getCurrentUser() {
    try {
      const raw = localStorage.getItem('usuario')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function isAuthenticated() {
    return !!localStorage.getItem('jwt_token')
  }

  async function login(email, senha) {
    const data = await doLoginNaApi(email, senha)
    if (data?.token) {
      const u = data.user ?? data
      localStorage.setItem('jwt_token', data.token)
      localStorage.setItem('usuario', JSON.stringify({
        id: u.id,
        email: u.email,
        role: u.role,
        nome: u.nome,
      }))
    }
    return { ok: true, ...data }
  }

  async function register(email, senha, nome, cpf, telefone) {
    const data = await doCadastroNaApi(email, senha, nome, cpf, telefone)
    if (data?.token) {
      const u = data.user ?? data
      localStorage.setItem('jwt_token', data.token)
      localStorage.setItem('usuario', JSON.stringify({
        id: u.id,
        email: u.email,
        role: u.role,
        nome: u.nome,
      }))
    }
    return { ok: true, ...data }
  }

  async function logout() {
    try {
      await doLogoutNaApi()
    } catch {
      // ignora erro de rede no logout
    } finally {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('usuario')
    }
    return { ok: true }
  }

  async function verificaLogin() {
    const token = localStorage.getItem('jwt_token')
    if (!token) return { ok: false }
    try {
      const data = await verificaLoginNaApi(token)
      if (data?.token) {
        const u = data.user ?? data
        localStorage.setItem('usuario', JSON.stringify({
          id: u.id,
          email: u.email,
          role: u.role,
          nome: u.nome,
        }))
      }
      return { ok: true, ...data }
    } catch {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('usuario')
      return { ok: false }
    }
  }

  function getAuthHeader() {
    const token = localStorage.getItem('jwt_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    verificaLogin,
    getAuthHeader,
  }
}