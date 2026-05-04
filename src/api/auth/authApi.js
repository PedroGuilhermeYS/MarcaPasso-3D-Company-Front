import axiosInstance from "../config";

export async function doLoginNaApi(email, password) {
  const { data } = await axiosInstance.post('/auth/login', { email, password })
  return data
}

export async function verificaLoginNaApi(token) {
  const { data } = await axiosInstance.post('/auth/verificar', { token })
  return data
}

export async function doLogoutNaApi() {
  const { data } = await axiosInstance.post('/auth/logout')
  return data
}

export async function doCadastroNaApi(email, senha, nome, cpf, telefone) {
  const { data } = await axiosInstance.post('/auth/cadastro', {
    email, senha, nome,
    cpf: cpf || null,
    telefone: telefone || null,
  })
  return data
}

export async function doAtualizarUsuarioNaApi(id, { nome, telefone }) {
  const { data } = await axiosInstance.patch(`/auth/usuario/${id}`, { nome, telefone })
  return data
}

export async function doAlterarSenhaNaApi(id, { senhaAtual, novaSenha }) {
  const { data } = await axiosInstance.patch(`/auth/usuario/${id}/senha`, { senhaAtual, novaSenha })
  return data
}

export async function doAlterarEmailNaApi(id, { novoEmail, senha }) {
  const { data } = await axiosInstance.patch(`/auth/usuario/${id}/email`, { novoEmail, senha })
  return data
}