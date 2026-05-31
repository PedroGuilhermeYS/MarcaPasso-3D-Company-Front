<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const aberto = ref(false)

const senhaAtual = ref('')
const novaSenha = ref('')
const confirmarSenha = ref('')
const mensagem = ref('')
const loading = ref(false)

function abrir() {
  senhaAtual.value = ''
  novaSenha.value = ''
  confirmarSenha.value = ''
  mensagem.value = ''
  aberto.value = true
}

function fechar() {
  aberto.value = false
}

async function salvar() {
  mensagem.value = ''

  if (novaSenha.value.length < 6) {
    mensagem.value = '<span class="material-symbols-outlined">error</span> A nova senha deve ter pelo menos 6 caracteres.'
    return
  }
  if (novaSenha.value !== confirmarSenha.value) {
    mensagem.value = '<span class="material-symbols-outlined">error</span> As senhas não coincidem.'
    return
  }

  loading.value = true
  try {
    await authStore.alterarSenha({ senhaAtual: senhaAtual.value, novaSenha: novaSenha.value })
    mensagem.value = '<span class="material-symbols-outlined">check_circle</span> Senha alterada com sucesso!'
    setTimeout(fechar, 1400)
  } catch (e) {
    mensagem.value = '<span class="material-symbols-outlined">error</span> ' + (e?.message ?? 'Erro ao alterar senha.')
  } finally {
    loading.value = false
  }
}

// Expõe o método abrir() para o pai chamar via ref
defineExpose({ abrir })
</script>

<template>
  <Teleport to="body">
    <div v-if="aberto" class="modal-backdrop" @click.self="fechar">
      <div class="modal-card">

        <div class="modal-header">
          <span class="modal-title">Alterar Senha</span>
          <button class="modal-close" @click="fechar">✕</button>
        </div>

        <div class="modal-body">
          <div class="field-modal">
            <label>Senha atual</label>
            <input type="password" v-model="senhaAtual" placeholder="Digite sua senha atual" />
          </div>
          <div class="field-modal">
            <label>Nova senha</label>
            <input type="password" v-model="novaSenha" placeholder="Mínimo 6 caracteres" />
          </div>
          <div class="field-modal">
            <label>Confirmar nova senha</label>
            <input type="password" v-model="confirmarSenha" placeholder="Repita a nova senha" />
          </div>
          <p v-if="mensagem" class="mensagem-modal">{{ mensagem }}</p>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-cancel" @click="fechar">Cancelar</button>
          <button class="btn-modal-confirm" :disabled="loading" @click="salvar">
            {{ loading ? 'Salvando...' : 'Confirmar' }}
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
  width: 420px;
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
  display: flex;
  flex-direction: column;
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