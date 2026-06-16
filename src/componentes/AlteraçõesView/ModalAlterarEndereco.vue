<script setup>
import { ref } from 'vue'
import axiosInstance from '@/api/config'

const emit = defineEmits(['salvo'])

const aberto = ref(false)
const loading = ref(false)
const mensagem = ref('')
const enderecoId = ref(null)

const bairro = ref('')
const cep = ref('')
const cidade = ref('')
const complemento = ref('')
const estado = ref('')
const nome = ref('')
const numero = ref('')
const rua = ref('')

function preencherCampos(endereco = {}) {
  enderecoId.value = endereco.id ?? null
  bairro.value = endereco.bairro ?? ''
  cep.value = endereco.cep ?? ''
  cidade.value = endereco.cidade ?? ''
  complemento.value = endereco.complemento ?? ''
  estado.value = endereco.estado ?? ''
  nome.value = endereco.nome ?? ''
  numero.value = endereco.numero ?? ''
  rua.value = endereco.rua ?? ''
  mensagem.value = ''
}

function abrir(endereco) {
  preencherCampos(endereco)
  aberto.value = true
}

function fechar() {
  aberto.value = false
}

async function salvar() {
  mensagem.value = ''

  if (!nome.value || !rua.value || !numero.value || !bairro.value || !cidade.value || !estado.value || !cep.value) {
    mensagem.value = '❌ Preencha todos os campos obrigatórios.'
    return
  }

  loading.value = true
  try {
    await axiosInstance.put(`/api/enderecos/${enderecoId.value}`, {
      bairro: bairro.value,
      cep: cep.value,
      cidade: cidade.value,
      complemento: complemento.value,
      estado: estado.value,
      nome: nome.value,
      numero: numero.value,
      rua: rua.value
    })

    mensagem.value = '<span class="material-symbols-outlined">check_circle</span> Endereço atualizado com sucesso!'
    emit('salvo')
    setTimeout(fechar, 1400)
  } catch (e) {
    mensagem.value = '<span class="material-symbols-outlined">error</span> ' + (e?.message ?? 'Erro ao editar endereço.')
  } finally {
    loading.value = false
  }
}

defineExpose({ abrir })
</script>

<template>
  <Teleport to="body">
    <div v-if="aberto" class="modal-backdrop" @click.self="fechar">
      <div class="modal-card">

        <div class="modal-header">
          <span class="modal-title">Editar Endereço</span>
          <button class="modal-close" @click="fechar">✕</button>
        </div>

        <div class="modal-body">
          <div class="field-modal">
            <label>Nome *</label>
            <input type="text" v-model="nome" placeholder="Ex: Casa, Trabalho" />
          </div>

          <div class="field-modal">
            <label>CEP *</label>
            <input type="text" v-model="cep" placeholder="00000-000" />
          </div>

          <div class="field-modal">
            <label>Rua *</label>
            <input type="text" v-model="rua" placeholder="Nome da rua" />
          </div>

          <div class="field-modal">
            <label>Número *</label>
            <input type="text" v-model="numero" placeholder="Número" />
          </div>

          <div class="field-modal">
            <label>Bairro *</label>
            <input type="text" v-model="bairro" placeholder="Bairro" />
          </div>

          <div class="field-modal">
            <label>Complemento</label>
            <input type="text" v-model="complemento" placeholder="Apto, bloco, referência..." />
          </div>

          <div class="field-modal">
            <label>Cidade *</label>
            <input type="text" v-model="cidade" placeholder="Cidade" />
          </div>

          <div class="field-modal">
            <label>Estado *</label>
            <input type="text" v-model="estado" placeholder="UF" maxlength="2" />
          </div>

          <p v-if="mensagem" class="mensagem-modal" v-html="mensagem"></p>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-cancel" @click="fechar">Cancelar</button>
          <button class="btn-modal-confirm" :disabled="loading" @click="salvar">
            {{ loading ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 18, 40, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #ffffff;
  border-radius: 20px;
  width: 520px;
  max-width: 95vw;
  box-shadow: 0 20px 60px rgba(17, 71, 152, 0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #edf0f7;
}

.modal-title {
  font-family: "Syne", sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #141824;
}

.modal-close {
  border: 0;
  background: transparent;
  font-size: 16px;
  color: #8f9db8;
  cursor: pointer;
  line-height: 1;
}

.modal-close:hover {
  color: #d63031;
}

.modal-body {
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.field-modal {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-modal label {
  font-size: 12px;
  font-weight: 600;
  color: #8f9db8;
}

.field-modal input {
  height: 44px;
  border: 1.4px solid #d7deea;
  border-radius: 30px;
  padding: 0 16px;
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  color: #2a3550;
  outline: none;
  transition: border-color 0.2s;
}

.field-modal input:focus {
  border-color: #114798;
}

.mensagem-modal {
  grid-column: 1 / -1;
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  color: #049377;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 20px;
  border-top: 1px solid #edf0f7;
}

.btn-modal-cancel {
  height: 36px;
  padding: 0 20px;
  border: 1.4px solid #d7deea;
  border-radius: 30px;
  background: transparent;
  color: #6b7a9a;
  font-family: "Syne", sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-modal-cancel:hover {
  border-color: #114798;
  color: #114798;
}

.btn-modal-confirm {
  height: 36px;
  padding: 0 24px;
  border: 0;
  border-radius: 30px;
  background: #ff7a00;
  color: #ffffff;
  font-family: "Syne", sans-serif;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.btn-modal-confirm:hover {
  background: #e06a00;
}

.btn-modal-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>