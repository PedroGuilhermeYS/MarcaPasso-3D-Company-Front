<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogoTop from '@/componentes/LogoTop.vue'
import { useCupomStore } from '@/stores/useCupomStore'

const route = useRoute()
const router = useRouter()
const cupomStore = useCupomStore()

const id = computed(() => route.params.id)

const nomeCupom = ref('')
const valorDesconto = ref('')
const tipoValidade = ref('INDEFINIDO')
const dataExpiracao = ref('')

const mensagem = ref('')
const loading = ref(false)
const carregandoDados = ref(false)

const precisaData = computed(() => tipoValidade.value === 'TEMPORARIO')

function paraInputData(valor) {
  if (!valor) return ''
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return String(valor).slice(0, 10)
  return data.toISOString().slice(0, 10)
}

function voltarParaCrud() {
  router.push({ name: 'NovoCrud' })
}

onMounted(async () => {
  carregandoDados.value = true
  try {
    const cupom = await cupomStore.buscarCupom(id.value)
    if (!cupom) {
      mensagem.value = '<span class="material-symbols-outlined">error</span> Cupom não encontrado.'
      return
    }

    nomeCupom.value = cupom.nomeCupom ?? ''
    valorDesconto.value = cupom.valorDesconto ?? ''
    tipoValidade.value = cupom.tipoValidade ?? 'INDEFINIDO'
    dataExpiracao.value = paraInputData(cupom.dataExpiracao)
  } catch (e) {
    console.error(e)
    mensagem.value = '<span class="material-symbols-outlined">error</span> Erro ao carregar cupom.'
  } finally {
    carregandoDados.value = false
  }
})

async function atualizarCupom() {
  loading.value = true
  mensagem.value = ''

  try {
    await cupomStore.atualizarCupom(id.value, {
      nomeCupom: nomeCupom.value.trim().toUpperCase(),
      valorDesconto: Number(valorDesconto.value),
      tipoValidade: tipoValidade.value,
      dataExpiracao: precisaData.value ? dataExpiracao.value : null,
    })

    mensagem.value = '<span class="material-symbols-outlined">check_circle</span> Cupom atualizado com sucesso!'
    setTimeout(() => voltarParaCrud(), 1200)
  } catch (error) {
    console.error(error)
    mensagem.value = '<span class="material-symbols-outlined">error</span> Erro ao atualizar cupom.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LogoTop />
  <main class="admin-wrapper">
    <h1 class="titulo">Atualizar Cupom</h1>

    <form @submit.prevent="atualizarCupom" class="admin-card">
      <div v-if="carregandoDados" class="estado">
        Carregando cupom...
      </div>

      <template v-else>
        <div class="input-group">
          <label>Nome do cupom</label>
          <input v-model="nomeCupom" maxlength="40" required />
        </div>

        <div class="row">
          <div class="input-group">
            <label>Valor de desconto (%)</label>
            <input v-model="valorDesconto" type="number" step="0.01" min="0.01" required />
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
          {{ loading ? 'Atualizando...' : 'Atualizar Cupom' }}
        </button>

        <p class="mensagem">{{ mensagem }}</p>
      </template>
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

input, select {
  padding: 12px;
  border: 1px solid var(--color-border-input);
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
}

input:focus, select:focus {
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
  transform: scale(1.02);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensagem, .estado {
  text-align: center;
  font-weight: 600;
}
</style>
