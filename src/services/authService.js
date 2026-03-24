import {
  doLoginNaApi,
  verificaLoginNaApi,
  doLogoutNaApi,
  doCadastroNaApi,
} from '@/api/auth'

const TOKEN_KEY = 'token'

export function useAuthService() {
  function setToken(token) {
    if (token) 
      localStorage.setItem(TOKEN_KEY, token)
    else 
      localStorage.removeItem(TOKEN_KEY) //para limpar o token no logout ou quando inválido
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) //para pegar o token do localStorage, ou null se não existir
  }

  function parseJwt(token) {
    try {
      const parts = token.split('.')
      if (parts.length < 2) 
        return null

      return JSON.parse(atob(parts[1]))
    } catch { 
      return null 
    } //tenta decodificar o payload do JWT, retorna null se falhar (token malformado) ou se não tiver payload
  }

  function isTokenValid(token) {
    const payload = parseJwt(token)
    return !!payload && payload.exp && payload.exp > Math.floor(Date.now() / 1000) //verifica se o token tem um payload válido e se não expirou
  }

  async function login(email, password) {
    const res = await doLoginNaApi(email, password)
    if (res?.ok && res.token) 
      setToken(res.token)
    
    return res
  } //login usando email e senha, chama a API, se der certo e retornar um token, salva o token no localStorage. Retorna a resposta da API (que pode conter ok, token, user ou error)

  async function register(dadosUsuario) {
    const res = await doCadastroNaApi(dadosUsuario)
    if (res?.ok && res.token) 
      setToken(res.token)
    return res
  } //registro usando os dados do usuário, chama a API de cadastro, se der certo e retornar um token, salva o token no localStorage. Retorna a resposta da API (que pode conter ok, token, user ou error)

  async function logout() {
    setToken(null)
    return await doLogoutNaApi() //limpa o token do localStorage e chama a API de logout (que no mock só confirma, mas na real pode fazer mais coisas como invalidar o token no servidor)
  }

  function getCurrentUser() {
    const token = getToken()
    if (!token || !isTokenValid(token)) 
      return null
    const payload = parseJwt(token)

    return { id: payload.sub, email: payload.email, role: payload.role, nome: payload.nome }
  } //pega o token do localStorage, verifica se é válido, se não for retorna null. Se for válido, decodifica o payload e retorna um objeto com as informações do usuário (id, email, role, nome) que estão no payload do token. Isso permite obter os dados do usuário logado sem precisar fazer uma chamada à API, desde que o token seja válido e contenha essas informações no payload.

  function isAuthenticated() {
    const token = getToken()
    return !!token && isTokenValid(token)
  }

  async function verificaLogin() {
    const token = getToken()
    try {
      const res = await verificaLoginNaApi(token)
      if (res?.ok && res.token) 
        setToken(res.token)
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