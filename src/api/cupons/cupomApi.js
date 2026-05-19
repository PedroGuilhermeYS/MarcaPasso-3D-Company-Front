import api from '../config'

export async function listarCupons() {
  const { data } = await api.get('/api/cupons')
  return data
}

export async function buscarCupomPorId(id) {
  const { data } = await api.get(`/api/cupons/${id}`)
  return data
}

export async function criarCupom(payload) {
  const { data } = await api.post('/api/cupons', payload)
  return data
}

export async function atualizarCupom(id, payload) {
  const { data } = await api.put(`/api/cupons/${id}`, payload)
  return data
}

export async function deletarCupom(id) {
  const { data } = await api.delete(`/api/cupons/${id}`)
  return data
}