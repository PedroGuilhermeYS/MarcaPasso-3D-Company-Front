import {
  doLoginNaApi,
  verificaLoginNaApi,
  doLogoutNaApi,
  doCadastroNaApi,
} from '@/api/auth'

const TOKEN_KEY = 'jwt_token'

export function useAuthService() {
  function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY)
  }

  function parseJwt(token) {
    try {
      const parts = token.split('.')
      if (parts.length < 2) return null
      return JSON.parse(atob(parts[1]))
    } catch {
      return null
    }
  }

  function isTokenValid(token) {
    const payload = parseJwt(token)
    return !!payload && payload.exp && payload.exp > Math.floor(Date.now() / 1000)
  }

  async function login(email, password) {
    const res = await doLoginNaApi(email, password)
    if (res?.ok && res.token) {
      setToken(res.token)
      // Salva usuário no localStorage
      const u = res.user ?? res
      localStorage.setItem('usuario', JSON.stringify({
        id: u.id,
        email: u.email,
        role: u.role,
        nome: u.nome,
      }))
    }
    return res
  }

  // Merge da Ari: cadastro aceita nome, cpf e telefone
  async function register(email, senha, nome, cpf, telefone) {
    const res = await doCadastroNaApi(email, senha, nome, cpf, telefone)
    if (res?.ok && res.token) {
      setToken(res.token)
      const u = res.user ?? res
      localStorage.setItem('usuario', JSON.stringify({
        id: u.id,
        email: u.email,
        role: u.role,
        nome: u.nome,
      }))
    }
    return res
  }

  async function logout() {
    setToken(null)
    localStorage.removeItem('usuario')
    return await doLogoutNaApi()
  }

  function getCurrentUser() {
    try {
      const raw = localStorage.getItem('usuario')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function isAuthenticated() {
    const token = getToken()
    return !!token && isTokenValid(token)
  }

  async function verificaLogin() {
    const token = getToken()
    if (!token) return { ok: false }
    try {
      const res = await verificaLoginNaApi(token)
      if (res?.ok && res.token) setToken(res.token)
      return res
    } catch (err) {
      return { ok: false, error: err }
    }
  }

  function getAuthHeader() {
    const t = getToken()
    return t ? { Authorization: `Bearer ${t}` } : {}
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