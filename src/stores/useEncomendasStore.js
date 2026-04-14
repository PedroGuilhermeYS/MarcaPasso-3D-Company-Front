import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAsyncHandler } from '@/composables/useAsyncHandler'
import { useEncomendasService } from '@/services/encomendasService'
import { useAuthStore } from '@/stores/useAuthStore'

export const useEncomendasStore = defineStore('encomendas', () => {

  const encomendas = ref([])
  const encomendaDetalhe = ref(null)
  const carregando = ref(false)
  const carregandoDetalhe = ref(false)
  const erro = ref(null)

  const { run: withHandling } = useAsyncHandler({ carregando, erro })

  const erroDetalhe = ref(null)
  const { run: withHandlingDetalhe } = useAsyncHandler({
    carregando: carregandoDetalhe,
    erro: erroDetalhe,
  })

  const encomendasService = useEncomendasService()

  function getIdUsuario() {
    const authStore = useAuthStore()
    const id = authStore.usuario?.id
    if (!id) throw new Error('Usuário não autenticado')
    return id
  }

  // ── Carrega lista de pedidos ──────────────────────────────
  const carregarEncomendas = async () => {
    const idUsuario = getIdUsuario()
    const lista = await withHandling(
      () => encomendasService.buscarEncomendas(idUsuario),
      'Erro ao carregar encomendas'
    )
    encomendas.value = Array.isArray(lista) ? lista : []
  }

  // ── Carrega detalhe de um pedido ──────────────────────────
  const carregarDetalhe = async (idEncomenda) => {
    const idUsuario = getIdUsuario()
    encomendaDetalhe.value = null
    const detalhe = await withHandlingDetalhe(
      () => encomendasService.buscarDetalhe(idUsuario, idEncomenda),
      'Erro ao carregar detalhe do pedido'
    )
    encomendaDetalhe.value = detalhe
    return detalhe
  }

  // ── Cria um novo pedido ───────────────────────────────────
  const adicionarEncomenda = async (encomenda) => {
    const idUsuario = getIdUsuario()
    const criada = await withHandling(
      () => encomendasService.criarEncomenda(idUsuario, encomenda),
      'Erro ao criar encomenda'
    )
    if (criada) {
      // Adiciona no topo da lista (mais recente primeiro)
      encomendas.value.unshift({
        id: criada.id,
        numeroPedido: criada.numeroPedido,
        dataHora: criada.dataHora,
        formaPagamento: criada.formaPagamento,
        status: criada.status,
        total: criada.total,
      })
    }
    return criada
  }

  return {
    encomendas,
    encomendaDetalhe,
    carregando,
    carregandoDetalhe,
    erro,
    erroDetalhe,

    carregarEncomendas,
    carregarDetalhe,
    adicionarEncomenda,
  }
})
