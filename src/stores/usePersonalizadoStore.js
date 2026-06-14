import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAsyncHandler } from '@/composables/useAsyncHandler'
import { usePersonalizadoService } from '@/services/personalizadoService'
import { useAuthStore } from '@/stores/useAuthStore'

export const usePersonalizadoStore = defineStore('personalizado', () => {

  const pedidos = ref([])
  const pedidoDetalhe = ref(null)
  const carregando = ref(false)
  const carregandoDetalhe = ref(false)
  const erro = ref(null)
  const erroDetalhe = ref(null)

  const { run: withHandling } = useAsyncHandler({ carregando, erro })
  const { run: withHandlingDetalhe } = useAsyncHandler({
    carregando: carregandoDetalhe,
    erro: erroDetalhe,
  })

  const personalizadoService = usePersonalizadoService()

  function getIdUsuario() {
    const authStore = useAuthStore()
    const id = authStore.usuario?.id
    if (!id) throw new Error('Usuário não autenticado')
    return id
  }

  const criarPedido = async (pedido) => {
    const idUsuario = getIdUsuario()
    const criado = await withHandling(
      () => personalizadoService.criarPedido(idUsuario, pedido),
      'Erro ao enviar pedido personalizado'
    )
    if (criado) {
      pedidos.value.unshift(criado)
    }
    return criado
  }

  const carregarPedidos = async () => {
    const idUsuario = getIdUsuario()
    const lista = await withHandling(
      () => personalizadoService.buscarPedidos(idUsuario),
      'Erro ao carregar pedidos personalizados'
    )
    pedidos.value = Array.isArray(lista) ? lista : []
  }

  const carregarDetalhe = async (idPedido) => {
    const idUsuario = getIdUsuario()
    pedidoDetalhe.value = null
    const detalhe = await withHandlingDetalhe(
      () => personalizadoService.buscarDetalhe(idUsuario, idPedido),
      'Erro ao carregar detalhe do pedido personalizado'
    )
    pedidoDetalhe.value = detalhe
    return detalhe
  }

  return {
    pedidos,
    pedidoDetalhe,
    carregando,
    carregandoDetalhe,
    erro,
    erroDetalhe,

    criarPedido,
    carregarPedidos,
    carregarDetalhe,
  }
})
