import {
  listarCupons,
  buscarCupomPorId,
  criarCupom,
  atualizarCupom,
  deletarCupom
} from '@/api/cupons'

export async function getTodosCupons() {
  return await listarCupons()
}

export async function getCupomPorId(id) {
  return await buscarCupomPorId(id)
}

export async function criarNovoCupom(payload) {
  return await criarCupom(payload)
}

export async function atualizarCupomService(id, payload) {
  return await atualizarCupom(id, payload)
}

export async function deletarCupomService(id) {
  return await deletarCupom(id)
}