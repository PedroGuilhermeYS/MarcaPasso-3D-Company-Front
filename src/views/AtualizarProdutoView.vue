<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProdutosStore } from '@/stores/useProdutosStore'
import { useSupabaseStorage } from '@/composables/useSupabaseStorage'

const route = useRoute()
const produtosStore = useProdutosStore()
const { uploadando, erroUpload, uploadarImagem, deletarImagem, extrairPathDaUrl } = useSupabaseStorage()

const id = computed(() => route.params.id)

// ─── Dados do formulário ────────────────────────────────────────────────────
const nome = ref('')
const preco = ref('')
const categoria = ref('')
const personalizavel = ref(false)
const descricao = ref('')

// ─── Estado da imagem ───────────────────────────────────────────────────────
const imagemAtualUrl = ref(null)      // URL já salva no banco (imagem existente)
const arquivoNovo = ref(null)         // Novo arquivo selecionado pelo admin
const previewNovoUrl = ref(null)      // Preview local do novo arquivo
const imagemTrocada = ref(false)      // Flag: o admin escolheu nova imagem

const mensagem = ref('')
const loading = ref(false)

// ─── Carregamento inicial ───────────────────────────────────────────────────
onMounted(async () => {
  try {
    const p = await produtosStore.buscarProduto(id.value)
    nome.value = p.nome
    preco.value = p.preco
    categoria.value = p.categoria
    personalizavel.value = p.personalizavel
    descricao.value = p.descricao
    imagemAtualUrl.value = p.imagemPrincipal ?? null
  } catch (e) {
    console.error(e)
    mensagem.value = '<span class="material-symbols-outlined">error</span> Erro ao carregar produto.'
  }
})

// ─── Handlers de imagem ─────────────────────────────────────────────────────
function aoSelecionarNovaImagem(evento) {
  const arquivo = evento.target.files[0]
  if (!arquivo) return

  arquivoNovo.value = arquivo
  imagemTrocada.value = true

  if (previewNovoUrl.value) URL.revokeObjectURL(previewNovoUrl.value)
  previewNovoUrl.value = URL.createObjectURL(arquivo)
}

function cancelarTrocaDeImagem() {
  arquivoNovo.value = null
  imagemTrocada.value = false
  if (previewNovoUrl.value) {
    URL.revokeObjectURL(previewNovoUrl.value)
    previewNovoUrl.value = null
  }
}

// ─── Submit ─────────────────────────────────────────────────────────────────
async function atualizarProduto() {
  loading.value = true
  mensagem.value = ''

  try {
    let novaImagemUrl = imagemAtualUrl.value   // mantém a atual por padrão

    // 1. Se o admin selecionou nova imagem:
    //    a) Faz upload para o Supabase
    //    b) Deleta a imagem antiga do bucket (evita lixo acumulado)
    if (imagemTrocada.value && arquivoNovo.value) {
      const resultado = await uploadarImagem(arquivoNovo.value)
      novaImagemUrl = resultado.publicUrl

      // Deletar a imagem antiga do Supabase (só tenta se havia uma URL)
      if (imagemAtualUrl.value) {
        const pathAntigo = extrairPathDaUrl(imagemAtualUrl.value)
        await deletarImagem(pathAntigo)
      }
    }

    // 2. Envia os dados ao backend com a URL pública (nova ou a mesma)
    await produtosStore.atualizarProduto(id.value, {
      nome: nome.value,
      preco: parseFloat(preco.value),
      categoria: categoria.value,
      personalizavel: personalizavel.value,
      descricao: descricao.value,
      imagemPrincipal: novaImagemUrl,
    })

    // Atualiza o estado local para refletir a nova imagem
    imagemAtualUrl.value = novaImagemUrl
    imagemTrocada.value = false
    arquivoNovo.value = null
    if (previewNovoUrl.value) {
      URL.revokeObjectURL(previewNovoUrl.value)
      previewNovoUrl.value = null
    }

    mensagem.value = '<span class="material-symbols-outlined">check_circle</span> Produto atualizado com sucesso!'

  } catch (e) {
    console.error(e)
    const msg = erroUpload.value || e?.message || 'Erro desconhecido'
    mensagem.value = `<span class="material-symbols-outlined">error</span> ${msg}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="admin-wrapper">
    <h1 class="titulo">Atualizar Produto</h1>

    <form @submit.prevent="atualizarProduto" class="admin-card">

      <div class="input-group">
        <label>Nome</label>
        <input v-model="nome" required />
      </div>

      <div class="row">
        <div class="input-group">
          <label>Preço</label>
          <input v-model="preco" type="number" step="0.01" min="0" />
        </div>
        <div class="input-group">
          <label>Categoria</label>
          <input v-model="categoria" />
        </div>
      </div>

      <label class="checkbox-area">
        <input type="checkbox" v-model="personalizavel" />
        Produto Personalizável
      </label>

      <div class="input-group">
        <label>Descrição</label>
        <textarea v-model="descricao" rows="4"></textarea>
      </div>

      <!-- ─── Seção de Imagem ──────────────────────────────────────────────── -->
      <div class="input-group">
        <label>Imagem Principal</label>

        <!-- Caso 1: Nova imagem selecionada (preview) -->
        <div v-if="imagemTrocada && previewNovoUrl" class="preview-wrapper">
          <span class="badge-novo">Nova imagem</span>
          <img :src="previewNovoUrl" alt="Preview da nova imagem" class="preview-img" />
          <button type="button" class="btn-remover-img" @click="cancelarTrocaDeImagem">
            ✕ Cancelar troca
          </button>
        </div>

        <!-- Caso 2: Imagem atual já salva no banco -->
        <div v-else-if="imagemAtualUrl" class="preview-wrapper">
          <span class="badge-atual">Imagem atual</span>
          <img :src="imagemAtualUrl" alt="Imagem atual do produto" class="preview-img" />
        </div>

        <!-- Caso 3: Sem imagem (produto novo ou sem foto) -->
        <div v-else class="sem-imagem">
          <span>📷 Nenhuma imagem cadastrada</span>
        </div>

        <!-- Botão de troca — sempre disponível -->
        <label v-if="!imagemTrocada" class="btn-trocar-img">
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="input-file"
            @change="aoSelecionarNovaImagem" />

          <template v-if="imagemAtualUrl">
            <span class="material-symbols-outlined">sync</span> Trocar imagem
          </template>

          <template v-else>
            <span class="material-symbols-outlined">photo_camera</span> Adicionar imagem
          </template>
        </label>

        <!-- Status do upload -->
        <div v-if="uploadando" class="upload-status">
          <div class="spinner"></div>
          <span>Enviando nova imagem...</span>
        </div>
        <p v-if="erroUpload" class="upload-erro"><span class="material-symbols-outlined">warning</span> {{ erroUpload }}
        </p>
      </div>
      <!-- ─────────────────────────────────────────────────────────────────── -->

      <button type="submit" :disabled="loading || uploadando" class="btn-submit">
        {{ loading ? 'Atualizando...' : 'Atualizar Produto' }}
      </button>

      <p v-if="mensagem" class="mensagem" v-html="mensagem"></p>
    </form>
  </main>
</template>

<style scoped>
.admin-wrapper {
  max-width: 700px;
  margin: 2rem auto;
  font-family: var(--font-family-base);
}

.titulo {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.admin-card {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  border: 2px solid var(--color-brand-blue);
  border-radius: 14px;
  padding: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-weight: 600;
}

.row {
  display: flex;
  gap: 1.5rem;
}

input:not([type='checkbox']):not([type='file']),
textarea {
  padding: 12px;
  border: 1px solid var(--color-brand-blue);
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
}

input:focus,
textarea:focus {
  border-color: var(--color-brand-blue);
}

.checkbox-area {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

/* ─── Imagem ─────────────────────────────────────────────────────────── */
.preview-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.preview-img {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--color-border-input);
}

.badge-novo,
.badge-atual {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
}

.badge-novo {
  background: #16a34a;
}

.badge-atual {
  background: #3b82f6;
}

.btn-remover-img {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 0.85rem;
}

.sem-imagem {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed var(--color-border-input);
  border-radius: 10px;
  color: var(--color-muted, #9ca3af);
}

.btn-trocar-img {
  display: inline-flex;
  align-items: center;
  justify-content: center; 
  gap: 6px;
  margin-top: 8px;
  padding: 8px 16px;
  border: 2px solid var(--color-brand-blue);
  border-radius: 8px;
  color: var(--color-brand-blue);
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-trocar-img:hover {
  background: rgba(59, 130, 246, 0.08);
}

.input-file {
  display: none;
}

.upload-status {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-brand-blue, #3b82f6);
  font-weight: 600;
  margin-top: 6px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(59, 130, 246, 0.25);
  border-top-color: var(--color-brand-blue, #3b82f6);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.upload-erro {
  color: #dc2626;
  font-weight: 600;
  margin: 0;
}

/* ─── Botão e mensagem ───────────────────────────────────────────────── */
.btn-submit {
  background: var(--color-brand-blue);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) {
  background: #0A377A;
  transform: scale(1.02);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensagem {
  text-align: center;
  font-weight: 600;
}
</style>
