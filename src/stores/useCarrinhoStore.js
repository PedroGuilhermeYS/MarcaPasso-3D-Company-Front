import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCarrinhoService } from '@/services/carrinhoService'
import { useAsyncHandler } from '@/composables/useAsyncHandler'
import { normalizarIdObjeto } from '@/composables/useNormalizadorId'
import { useAuthStore } from '@/stores/useAuthStore'

export const useCarrinhoStore = defineStore('carrinho', () => {
  const itens = ref([])
  const freteSelecionado = ref(null)
  const carregando = ref(false)
  const erro = ref(null)

  const carrinhoService = useCarrinhoService()
  const { run: withHandling } = useAsyncHandler({ carregando, erro })

  function getIdUsuario() {
    const authStore = useAuthStore()
    return authStore.usuario?.id
  }

  const total = computed(() =>
    itens.value.reduce(
      (acc, item) => acc + (Number(item.preco || 0) * Number(item.quantidade || 0)),
      0
    )
  )

  async function carregarCarrinho() {
    const idUsuario = getIdUsuario()
    if (!idUsuario) { itens.value = []; return }
    const lista = await withHandling(
      () => carrinhoService.buscarTodos(idUsuario),
      'Erro ao carregar carrinho'
    )
    itens.value = Array.isArray(lista) ? lista.map(normalizarIdObjeto) : []
  }

  async function adicionarItem(produto, quantidadeInformada = 1) {
    const idUsuario = getIdUsuario()
    if (!idUsuario) return null

    produto = normalizarIdObjeto(produto)
    const quantidade = Number(quantidadeInformada) || 1

    // Chama o backend passando o idUsuario e o item
    const lista = await withHandling(
      () => carrinhoService.adicionarItem(idUsuario, {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagemPrincipal,
        quantidade,
      }),
      'Erro ao adicionar item ao carrinho'
    )

    // Atualiza a lista local com o retorno do backend
    if (Array.isArray(lista)) {
      itens.value = lista.map(normalizarIdObjeto)
    }

    return lista
  }

  async function alterarQuantidade(id, quantidade) {
    if (quantidade <= 0) return
    await withHandling(
      () => carrinhoService.alterarQuantidade(id, quantidade),
      'Erro ao alterar quantidade'
    )
    itens.value = itens.value.map(item =>
      String(item.id) === String(id) ? { ...item, quantidade } : item
    )
  }

  async function removerItem(id) {
    await withHandling(
      () => carrinhoService.removerItem(id),
      'Erro ao remover item do carrinho'
    )
    itens.value = itens.value.filter(i => String(i.id) !== String(id))
  }

  async function limparCarrinho() {
    await withHandling(
      () => carrinhoService.limparCarrinho(),
      'Erro ao limpar carrinho'
    )
    itens.value = []
  }

  function definirFrete(frete) {
    freteSelecionado.value = frete
  }

  return {
    itens, freteSelecionado, carregando, erro, total,
    carregarCarrinho, adicionarItem, alterarQuantidade,
    removerItem, limparCarrinho, definirFrete,
  }
})