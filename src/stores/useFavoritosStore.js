import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useFavoritoService } from '@/services/favoritoService'
import { useAsyncHandler } from '@/composables/useAsyncHandler'
import { normalizarIdObjeto } from '@/composables/useNormalizadorId'
import { useAuthStore } from '../../../../MarcaPasso-3D-Company-Front/src/stores/useAuthStore'

export const useFavoritosStore = defineStore('favoritos', () => {
  const favoritos = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  const authStore = useAuthStore()
  const favoritoService = useFavoritoService()

  const { run: withHandling } = useAsyncHandler({ carregando, erro })

  // Pega o ID do usuário logado
  const idUsuario = computed(() => authStore.usuario?.id ?? null)

  const total = computed(() =>
    favoritos.value.reduce((acc, item) => acc + (item.preco || 0), 0)
  )

  const favoritosIds = computed(() =>
    new Set(favoritos.value.map(f => String(f.id)))
  )

  const isFavoritado = (id) => favoritosIds.value.has(String(id))

  const quantidade = computed(() => favoritos.value.length)

  async function carregarFavoritos() {
    if (!idUsuario.value) {
      favoritos.value = []
      return
    }

    const lista = await withHandling(
      () => favoritoService.buscarTodos(idUsuario.value),
      'Erro ao carregar favoritos'
    )

    favoritos.value = (lista || []).map(normalizarIdObjeto)
  }

  async function adicionarFavorito(produto) {
    if (!idUsuario.value) return null

    const lista = await withHandling(
      () => favoritoService.adicionarFavorito(idUsuario.value, produto.id),
      'Erro ao adicionar favorito'
    )

    favoritos.value = (lista || []).map(normalizarIdObjeto)
    return lista
  }

  async function removerFavorito(idProduto) {
    if (!idUsuario.value) return

    const lista = await withHandling(
      () => favoritoService.removerFavorito(idUsuario.value, idProduto),
      'Erro ao remover favorito'
    )

    favoritos.value = (lista || []).map(normalizarIdObjeto)
  }

  async function limparFavoritos() {
    if (!idUsuario.value) return

    await withHandling(
      () => favoritoService.removerTodosFavoritos(idUsuario.value),
      'Erro ao limpar favoritos'
    )

    favoritos.value = []
  }

  authStore.$subscribe((_, state) => {
    if (state.usuario) {
      carregarFavoritos()
    } else {
      favoritos.value = []
    }
  })

  return {
    favoritos,
    carregando,
    erro,
    total,
    quantidade,
    isFavoritado,
    carregarFavoritos,
    adicionarFavorito,
    removerFavorito,
    limparFavoritos,
  }
})