import { defineStore } from 'pinia'

import {
  getTodosCupons,
  getCupomPorId,
  criarNovoCupom,
  atualizarCupomService,
  deletarCupomService
} from '@/services/cupomService'

export const useCupomStore = defineStore('cupom', {
  state: () => ({
    cupons: [],
    cupomAplicado: null,
    desconto: 0
  }),

  actions: {
    async carregarCupons() {
      this.cupons = await getTodosCupons()
    },

    async buscarCupom(id) {
      return await getCupomPorId(id)
    },

    async criarCupom(payload) {
      await criarNovoCupom(payload)
      await this.carregarCupons()
    },

    async atualizarCupom(id, payload) {
      await atualizarCupomService(id, payload)
      await this.carregarCupons()
    },

    async excluirCupom(id) {
      await deletarCupomService(id)
      await this.carregarCupons()
    },

    aplicarCupom(cupom) {
      this.cupomAplicado = cupom
      this.desconto = cupom.valorDesconto
    },

    removerCupom() {
      this.cupomAplicado = null
      this.desconto = 0
    }
  }
})