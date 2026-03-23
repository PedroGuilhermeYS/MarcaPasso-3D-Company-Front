<script setup>
import { ref } from 'vue'
import LogoTop from '@/componentes/LogoTop.vue'
import { useProdutosStore } from '@/stores/useProdutosStore'
import { useRouter } from 'vue-router'

const produtosStore = useProdutosStore()
const router = useRouter()

const nome = ref('')
const preco = ref('')
const categoria = ref('')
const personalizavel = ref(false)
const descricao = ref('')
const imagemPrincipalNome = ref('')

const mensagem = ref('')
const loading = ref(false)

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function cadastrarProduto() {
  mensagem.value = ''
  loading.value = true

  try {
    await produtosStore.adicionarProduto({
      nome: nome.value,
      preco: parseFloat(preco.value),
      categoria: categoria.value,
      personalizavel: personalizavel.value,
      descricao: descricao.value,
      imagemPrincipal: imagemPrincipalNome.value || null,
    })

    mensagem.value = '✅ Produto cadastrado com sucesso!'

    nome.value = ''
    preco.value = ''
    categoria.value = ''
    personalizavel.value = false
    descricao.value = ''
    imagemPrincipalNome.value = ''

    await esperar(2000)
    router.push({ name: 'Crud' })

  } catch (error) {
    console.error(error)
    mensagem.value = '❌ Erro ao cadastrar o produto.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LogoTop></LogoTop>
  <main class="admin-wrapper">
    <h1 class="titulo">Cadastrar Novo Produto</h1>

    <form @submit.prevent="cadastrarProduto" class="admin-card">

      <div class="input-group">
        <label>Nome do Produto</label>
        <input v-model="nome" placeholder="Ex: Tênis 3D Azul" required />
      </div>

      <div class="row">
        <div class="input-group">
          <label>Preço</label>
          <input v-model="preco" type="number" step="0.01" min="0" placeholder="0,00" required />
        </div>

        <div class="input-group">
          <label>Categoria</label>
          <input v-model="categoria" placeholder="Ex: calcados" required />
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

      <div class="input-group">
        <label>Nome da Imagem Principal</label>
        <input v-model="imagemPrincipalNome" placeholder="Ex: tenis_azul.jpg" />
        <small>Digite o nome do arquivo de imagem</small>
      </div>

      <button type="submit" :disabled="loading" class="btn-submit">
        {{ loading ? 'Cadastrando...' : 'Cadastrar Produto' }}
      </button>

      <p class="mensagem">{{ mensagem }}</p>
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
    border: 2px solid var(--color-primary);
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
  .input-group small {
    color: var(--color-muted);
    font-size: 12px;
  }
  input, textarea {
    padding: 12px;
    border: 1px solid var(--color-border-input);
    border-radius: 10px;
    font-size: 1rem;
    outline: none;
  }
  input:focus, textarea:focus {
    border-color: var(--color-primary);
  }
  .row {
    display: flex;
    gap: 1.5rem;
  }
  .checkbox-area {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }
  .btn-submit {
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
  }
  .btn-submit:hover {
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