<script setup>
import { ref } from 'vue'
import { useProdutosStore } from '@/stores/useProdutosStore'
import { useSupabaseStorage } from '@/composables/useSupabaseStorage'
import { useRouter } from 'vue-router'

const produtosStore = useProdutosStore()
const router = useRouter()
const { uploadando, erroUpload, uploadarImagem } = useSupabaseStorage()

// ─── Dados do formulário ────────────────────────────────────────────────────
const nome = ref('')
const preco = ref('')
const categoria = ref('')
const personalizavel = ref(false)
const descricao = ref('')

// ─── Estado do upload de imagem ─────────────────────────────────────────────
const arquivoSelecionado = ref(null)        // Objeto File escolhido pelo usuário
const previewUrl = ref(null)                // URL temporária para exibir preview
const imagemPublicUrl = ref(null)           // URL pública após upload no Supabase
const imagemPath = ref(null)               // Path no bucket (para deleção futura)

const mensagem = ref('')
const loading = ref(false)

// ─── Handlers de imagem ─────────────────────────────────────────────────────
function aoSelecionarArquivo(evento) {
  const arquivo = evento.target.files[0]
  if (!arquivo) return

  arquivoSelecionado.value = arquivo

  // Cria URL temporária apenas para o preview local (não consome banda)
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(arquivo)

  // Limpa upload anterior se o admin trocou a imagem antes de salvar
  imagemPublicUrl.value = null
  imagemPath.value = null
}

function removerImagem() {
  arquivoSelecionado.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  imagemPublicUrl.value = null
  imagemPath.value = null
}

// ─── Submit ─────────────────────────────────────────────────────────────────
async function cadastrarProduto() {
  mensagem.value = ''
  loading.value = true

  try {
    // 1. Upload da imagem direto para o Supabase Storage (se houver arquivo)
    if (arquivoSelecionado.value) {
      const resultado = await uploadarImagem(arquivoSelecionado.value)
      imagemPublicUrl.value = resultado.publicUrl
      imagemPath.value = resultado.path
    }

    // 2. Enviar os dados do produto ao backend — incluindo apenas a URL pública
    //    O backend recebe uma string simples e salva em produto.imagem_principal
    await produtosStore.adicionarProduto({
      nome: nome.value,
      preco: parseFloat(preco.value),
      categoria: categoria.value,
      personalizavel: personalizavel.value,
      descricao: descricao.value,
      imagemPrincipal: imagemPublicUrl.value ?? null,
      // imagemPath não é enviado ao backend nesse projeto,
      // mas pode ser salvo em coluna separada para gerenciamento futuro
    })

    mensagem.value = '<span class="material-symbols-outlined">check_circle</span> Produto cadastrado com sucesso!'
    _resetarFormulario()

    await new Promise(r => setTimeout(r, 2000))
    router.push({ name: 'NovoCrud' })

  } catch (error) {
    console.error(error)
    const msg = erroUpload.value || error?.message || 'Erro desconhecido'
    mensagem.value = `<span class="material-symbols-outlined">error</span> ${msg}`
  } finally {
    loading.value = false
  }
}

function _resetarFormulario() {
  nome.value = ''
  preco.value = ''
  categoria.value = ''
  personalizavel.value = false
  descricao.value = ''
  removerImagem()
}
</script>

<template>
  <main class="admin-wrapper">
    <h1 class="titulo">Cadastrar Novo Produto</h1>

    <form @submit.prevent="cadastrarProduto" class="admin-card">

      <div class="input-group">
        <label>Nome do Produto</label>
        <input v-model="nome" placeholder="Ex: Luminária 3D Lua" required />
      </div>

      <div class="row">
        <div class="input-group">
          <label>Preço</label>
          <input v-model="preco" type="number" step="0.01" min="0" placeholder="0,00" required />
        </div>
        <div class="input-group">
          <label>Categoria</label>
          <input v-model="categoria" placeholder="Ex: Decoração" required />
        </div>
      </div>

      <label class="checkbox-area">
        <input type="checkbox" v-model="personalizavel" />
        Produto Personalizável
      </label>

      <div class="input-group">
        <label>Descrição</label>
        <textarea v-model="descricao" placeholder="Descreva o produto..." rows="4"></textarea>
      </div>

      <!-- ─── Upload de Imagem ─────────────────────────────────────────────── -->
      <div class="input-group">
        <label>Imagem Principal</label>

        <!-- Preview antes do upload -->
        <div v-if="previewUrl" class="preview-wrapper">
          <img :src="previewUrl" alt="Preview da imagem" class="preview-img" />
          <button type="button" class="btn-remover-img" @click="removerImagem">✕ Remover</button>
        </div>

        <!-- Área de seleção de arquivo -->
        <label v-else class="upload-area">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="input-file"
            @change="aoSelecionarArquivo"
          />
          <span class="upload-icone"><span class="material-symbols-outlined">photo_camera</span></span>
          <span class="upload-texto">Clique para selecionar uma imagem</span>
          <small class="upload-hint">JPG, PNG, WEBP ou GIF — máximo 5MB</small>
        </label>

        <!-- Barra de progresso durante o upload -->
        <div v-if="uploadando" class="upload-status">
          <div class="spinner"></div>
          <span>Enviando imagem para o servidor...</span>
        </div>

        <!-- Confirmação de upload concluído -->
        <p v-if="imagemPublicUrl" class="upload-ok">
          <span class="material-symbols-outlined">check_circle</span> Imagem enviada com sucesso
        </p>

        <!-- Erro específico de upload -->
        <p v-if="erroUpload" class="upload-erro"><span class="material-symbols-outlined">warning</span> {{ erroUpload }}</p>
      </div>
      <!-- ─────────────────────────────────────────────────────────────────── -->

      <button type="submit" :disabled="loading || uploadando" class="btn-submit">
        {{ loading ? 'Cadastrando...' : 'Cadastrar Produto' }}
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
  border: 1px solid var(--color-border-input);
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

/* ─── Upload ─────────────────────────────────────────────────────────── */
.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 2px dashed var(--color-brand-blue, #3b82f6);
  border-radius: 10px;
  padding: 2rem;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
}
.upload-area:hover {
  background: rgba(59, 130, 246, 0.05);
}
.input-file {
  display: none;
}
.upload-icone {
  font-size: 2rem;
}
.upload-texto {
  font-weight: 600;
  color: var(--color-brand-blue, #3b82f6);
}
.upload-hint {
  color: var(--color-muted, #9ca3af);
  font-size: 12px;
}
.preview-wrapper {
  position: relative;
  display: inline-block;
}
.preview-img {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--color-border-input);
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
.upload-status {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-brand-blue, #3b82f6);
  font-weight: 600;
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
  to { transform: rotate(360deg); }
}
.upload-ok {
  color: #16a34a;
  font-weight: 600;
  margin: 0;
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
