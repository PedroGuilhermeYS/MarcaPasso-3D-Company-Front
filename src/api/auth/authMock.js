import { ApiError } from '@/errors/ApiError'

const adminEmail = 'pedro210905@gmail.com'
const USERS = [
  { id: 1, nome: 'Pedro Guilherme', email: adminEmail, password: '123456', role: 'admin' },
]

function generateFakeJwt(payload = {}, expiresInSeconds = 60 * 60) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  const body = btoa(JSON.stringify({ ...payload, exp }))
  const signature = btoa('signature-mock')
  return `${header}.${body}.${signature}`
}

function parseFakeJwt(token) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) 
      return null
    return JSON.parse(atob(parts[1]))
  } catch {
    return null
  }
}

const wait = (ms = 200) => new Promise(r => setTimeout(r, ms))

export async function doLoginNaApi(email, password) {
  await wait(250)
  const user = USERS.find(u => u.email == email && u.password == password)
  if (!user) {
    return Promise.reject(new ApiError('Credenciais inválidas', 401, null))
  }
  const token = generateFakeJwt({ sub: user.id, email: user.email, role: user.role, nome: user.nome }, 60 * 60)
  return { ok: true, token, user: { id: user.id, email: user.email, role: user.role, nome: user.nome } }
} //login usando email e senha, verifica se existe um usuário com essas credenciais no array USERS. Se não existir, rejeita a promessa com um erro de credenciais inválidas. Se existir, gera um token JWT falso com as informações do usuário (id, email, role, nome) e retorna um objeto com ok: true, o token e os dados do usuário (sem a senha).

export async function verificaLoginNaApi(token) {
  await wait(50)
  if (!token) {
    return Promise.reject(new ApiError('Token ausente', 401, null))
  }
  const payload = parseFakeJwt(token)
  const valid = !!payload && payload.exp && payload.exp > Math.floor(Date.now() / 1000)

  if (!valid) {
    return Promise.reject(new ApiError('Token inválido ou expirado', 401, null))
  }
  return { ok: true, token, user: { id: payload.sub, email: payload.email, role: payload.role, nome: payload.nome } }
} //verifica o token, se não tiver token rejeita com erro de token ausente. Se tiver token, tenta decodificar o payload, verifica se é válido (tem exp e não expirou). Se não for válido, rejeita com erro de token inválido ou expirado. Se for válido, retorna um objeto com ok: true, o mesmo token (poderia ser um novo token renovado, mas como é mock só retorna o mesmo) e os dados do usuário extraídos do payload (id, email, role, nome).

export async function doLogoutNaApi() {
  await wait(50)
  return { ok: true }
}

export async function doCadastroNaApi(dadosUsuario) {
  await wait(300)
  const { nome, email, senha } = dadosUsuario
  
  if (USERS.some(u => u.email == email)) {
    return Promise.reject(new ApiError('Usuário já existe', 409, null))
  }

  const id = USERS.length + 1
  const newUser = { id, nome, email, password: senha, role: 'cliente' }
  USERS.push(newUser)
  const token = generateFakeJwt({ sub: id, email, role: 'cliente', nome }, 60 * 60)
  return { ok: true, token, user: { id, email, role: 'cliente', nome } }
}