<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCupomStore } from '@/stores/useCupomStore'

const router = useRouter()
const cupomStore = useCupomStore()

const nomeCupom = ref('')
const valorDesconto = ref('')
const tipoValidade = ref('INDEFINIDO')
const dataExpiracao = ref('')

const mensagem = ref('')
const loading = ref(false)

const precisaData = computed(() => {
  return tipoValidade.value === 'TEMPORARIO'
})

function normalizarDataParaApi(data) {
  if (!data) return null
  return data
}

function voltarParaCrud() {
  router.push({
    name: 'NovoCrud',
    query: { aba: 'Cupons' }
  })
}

async function cadastrarCupom() {
  mensagem.value = ''
  loading.value = true

  try {
    await cupomStore.criarCupom({
      nomeCupom: nomeCupom.value.trim().toUpperCase(),
      valorDesconto: Number(valorDesconto.value),
      tipoValidade: tipoValidade.value,
      dataExpiracao: precisaData.value
        ? normalizarDataParaApi(dataExpiracao.value)
        : null
    })

    mensagem.value = '<span class="material-symbols-outlined">check_circle</span> Cupom cadastrado com sucesso!'

    nomeCupom.value = ''
    valorDesconto.value = ''
    tipoValidade.value = 'INDEFINIDO'
    dataExpiracao.value = ''

    setTimeout(() => {
      voltarParaCrud()
    }, 1200)

  } catch (error) {
    console.error(error)

    if (error?.response?.data?.message) {
      mensagem.value = `<span class="material-symbols-outlined">error</span> ${error.response.data.message}`
    } else {
      mensagem.value = '<span class="material-symbols-outlined">error</span> Erro ao cadastrar o cupom.'
    }

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="admin-wrapper">
    <h1 class="titulo">Cadastrar Novo Cupom</h1>

    <form @submit.prevent="cadastrarCupom" class="admin-card">
      <div class="input-group">
        <label>Nome do cupom</label>
        <input v-model="nomeCupom" placeholder="Ex: BLACKWEEK" maxlength="40" required />
      </div>

      <div class="row">
        <div class="input-group">
          <label>Valor de desconto (%)</label>
          <input v-model="valorDesconto" type="number" step="0.01" min="0.01" placeholder="10" required />
        </div>

        <div class="input-group">
          <label>Validade</label>
          <select v-model="tipoValidade" required>
            <option value="INDEFINIDO">Indefinido</option>
            <option value="TEMPORARIO">Temporário</option>
          </select>
        </div>
      </div>

      <div v-if="precisaData" class="input-group">
        <label>Data de expiração</label>
        <input v-model="dataExpiracao" type="date" required />
        <small>Na data definida, o cupom será removido automaticamente pelo backend.</small>
      </div>

      <button type="submit" :disabled="loading" class="btn-submit">
        {{ loading ? 'Cadastrando...' : 'Cadastrar Cupom' }}
      </button>

      <p class="mensagem" v-html="mensagem"></p>
    </form>
  </main>
</template>

<style scoped>
.admin-wrapper {
  max-width: 720px;
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
  background: #fff;
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

input,
select {
  padding: 12px;
  border: 1px solid var(--color-border-input);
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
}

input:focus,
select:focus {
  border-color: var(--color-brand-blue);
}

.row {
  display: flex;
  gap: 1.5rem;
}

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

.btn-submit:hover {
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
