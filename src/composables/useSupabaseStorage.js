import { ref } from 'vue'
import { supabase, BUCKET_PRODUTOS } from '@/lib/supabase'

/**
 * Composable responsável por toda interação com o Supabase Storage.
 * Upload direto do frontend — o backend só recebe a URL pública final.
 */
export function useSupabaseStorage() {
  const uploadando = ref(false)
  const progresso = ref(0)
  const erroUpload = ref(null)

  /**
   * Faz upload de uma imagem para o bucket e retorna a URL pública.
   * @param {File} arquivo - O arquivo de imagem selecionado pelo usuário
   * @param {string} [pasta='produtos'] - Subpasta dentro do bucket (ex: 'produtos')
   * @returns {Promise<{ publicUrl: string, path: string }>}
   */
  async function uploadarImagem(arquivo, pasta = 'produtos') {
    uploadando.value = true
    progresso.value = 0
    erroUpload.value = null

    try {
      // Valida tipo e tamanho antes de enviar
      _validarArquivo(arquivo)

      // Gera nome único para evitar colisões e sobrescrita acidental
      const extensao = arquivo.name.split('.').pop().toLowerCase()
      const nomeUnico = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extensao}`

      // Upload direto para o Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_PRODUTOS)
        .upload(nomeUnico, arquivo, {
          cacheControl: '3600',
          upsert: false,         // false = nunca sobrescreve; gera nome único acima
          contentType: arquivo.type,
        })

      if (error) throw new Error(`Falha no upload: ${error.message}`)

      progresso.value = 100

      // Obter a URL pública que qualquer usuário pode visualizar
      const { data: urlData } = supabase.storage
        .from(BUCKET_PRODUTOS)
        .getPublicUrl(data.path)

      return {
        publicUrl: urlData.publicUrl,
        path: data.path,          // Salvar o path facilita deleção futura
      }

    } catch (err) {
      erroUpload.value = err.message || 'Erro desconhecido no upload'
      throw err
    } finally {
      uploadando.value = false
    }
  }

  /**
   * Deleta uma imagem do bucket pelo seu path (ex: "produtos/1234-xyz.jpg").
   * Chamado pelo backend ou pelo frontend ao substituir/remover imagem.
   * @param {string} path - Caminho retornado pelo upload
   */
  async function deletarImagem(path) {
    if (!path) return

    const { error } = await supabase.storage
      .from(BUCKET_PRODUTOS)
      .remove([path])

    if (error) {
      console.warn(`[Storage] Não foi possível deletar a imagem "${path}":`, error.message)
    }
  }

  /**
   * Extrai o path relativo a partir de uma URL pública do Supabase.
   * Útil para recuperar o path quando só temos a URL salva no banco.
   *
   * Exemplo de URL:
   * https://xxxx.supabase.co/storage/v1/object/public/imagens-produtos/produtos/abc.jpg
   * → retorna: "produtos/abc.jpg"
   */
  function extrairPathDaUrl(publicUrl) {
    if (!publicUrl) return null
    const marcador = `/object/public/${BUCKET_PRODUTOS}/`
    const idx = publicUrl.indexOf(marcador)
    return idx !== -1 ? publicUrl.slice(idx + marcador.length) : null
  }

  // ─── Helpers privados ───────────────────────────────────────────────────────

  function _validarArquivo(arquivo) {
    const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const TAMANHO_MAX_MB = 5

    if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
      throw new Error(`Tipo de arquivo não permitido. Use: ${TIPOS_PERMITIDOS.join(', ')}`)
    }

    if (arquivo.size > TAMANHO_MAX_MB * 1024 * 1024) {
      throw new Error(`O arquivo excede o limite de ${TAMANHO_MAX_MB}MB.`)
    }
  }

  return {
    uploadando,
    progresso,
    erroUpload,
    uploadarImagem,
    deletarImagem,
    extrairPathDaUrl,
  }
}
