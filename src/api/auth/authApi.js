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
    email,
    senha,
    nome,
    cpf: cpf || null,
    telefone: telefone || null,
  })
  return data
}