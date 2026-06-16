<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFretesStore } from '@/stores/useFretesStore'

const props = defineProps({ id: { type: String, required: true } })

const router = useRouter()
const fretesStore = useFretesStore()

const cepEntrega = ref('')
const cidade = ref('')
const valorFrete = ref('')
const prazoEntregaDias = ref('')

const mensagem = ref('')
const loading = ref(false)
const carregando = ref(true)

function voltarParaCrud() {
  router.push({
    name: 'NovoCrud',
    query: { aba: 'Fretes' }
  })
}

onMounted(async () => {
  try {
    await fretesStore.carregarFretes()
    const frete = fretesStore.fretes.find(f => String(f.id) === String(props.id))

    if (!frete) {
      mensagem.value = '<span class="material-symbols-outlined">error</span> Frete não encontrado.'
      return
    }

    cepEntrega.value = frete.cep_entrega ?? frete.cepEntrega ?? ''
    cidade.value = frete.cidade ?? ''
    valorFrete.value = frete.valor_frete ?? frete.valorFrete ?? ''
    prazoEntregaDias.value = frete.prazo_entrega_dias ?? frete.prazoEntregaDias ?? ''
  } catch (error) {
    mensagem.value = '<span class="material-symbols-outlined">error</span> Erro ao carregar frete.'
    console.error(error)
  } finally {
    carregando.value = false
  }
})

async function atualizarFrete() {
  mensagem.value = ''
  loading.value = true

  try {
    await fretesStore.atualizarFrete(props.id, {
      cep_entrega: cepEntrega.value.trim(),
      cidade: cidade.value.trim(),
      valor_frete: Number(valorFrete.value),
      prazo_entrega_dias: Number(prazoEntregaDias.value)
    })

    mensagem.value = '<span class="material-symbols-outlined">check_circle</span> Frete atualizado com sucesso!'

    setTimeout(() => {
      voltarParaCrud()
    }, 1200)

  } catch (error) {
    console.error(error)
    if (error?.response?.data?.message) {
      mensagem.value = `<span class="material-symbols-outlined">error</span> ${error.response.data.message}`
    } else {
      mensagem.value = '<span class="material-symbols-outlined">error</span> Erro ao atualizar o frete.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="admin-wrapper">
    <h1 class="titulo">Editar Frete</h1>

    <div v-if="carregando" class="estado-vazio">Carregando frete…</div>

    <form v-else @submit.prevent="atualizarFrete" class="admin-card">
      <div class="row">
        <div class="input-group">
          <label>CEP</label>
          <input v-model="cepEntrega" placeholder="Ex: 55535-000" maxlength="9" required />
        </div>

        <div class="input-group">
          <label>Cidade</label>
          <input v-model="cidade" placeholder="Ex: Bezerros" required />
        </div>
      </div>

      <div class="row">
        <div class="input-group">
          <label>Valor do frete (R$)</label>
          <input v-model="valorFrete" type="number" step="0.01" min="0" placeholder="15.00" required />
        </div>

        <div class="input-group">
          <label>Prazo de entrega (dias)</label>
          <input v-model="prazoEntregaDias" type="number" min="1" placeholder="5" required />
        </div>
      </div>

      <button type="submit" :disabled="loading" class="btn-submit">
        {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
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
  flex: 1;
}

.input-group label {
  font-weight: 600;
}

input {
  padding: 12px;
  border: 1px solid var(--color-border-input);
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
}

input:focus {
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

.mensagem {
  text-align: center;
  font-weight: 600;
}

.estado-vazio {
  text-align: center;
  padding: 3rem;
  color: var(--color-muted, #888);
  font-size: 1rem;
  border: 2px dashed var(--color-brand-blue);
  border-radius: 14px;
}
</style>