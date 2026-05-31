<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

// ── Dados do perfil ──────────────────────────────────────────
const email = ref('')
const cpf = ref('')
const nome = ref('')
const telefone = ref('')
const mensagemPerfil = ref('')
const loadingPerfil = ref(false)

onMounted(() => {
  const u = authStore.usuario
  if (u) {
    email.value = u.email ?? ''
    cpf.value = u.cpf ?? ''
    nome.value = u.nome ?? ''
    telefone.value = u.telefone ?? ''
  }
})

async function salvarAlteracoes() {
  loadingPerfil.value = true
  mensagemPerfil.value = ''

  try {
    await authStore.atualizarUsuario({
      nome: nome.value,
      telefone: telefone.value
    })
    mensagemPerfil.value = '<span class="material-symbols-outlined">check_circle</span> Dados atualizados com sucesso!'
  } catch {
    mensagemPerfil.value = '<span class="material-symbols-outlined">error</span> Erro ao atualizar dados.'
  } finally {
    loadingPerfil.value = false
  }
}

// ── Modal Alterar E-mail ──────────────────────────────────────
const modalEmail = ref(false)
const novoEmail = ref('')
const senhaEmail = ref('')
const mensagemEmail = ref('')
const loadingEmail = ref(false)

function abrirModalEmail() {
  novoEmail.value = ''
  senhaEmail.value = ''
  mensagemEmail.value = ''
  modalEmail.value = true
}

async function salvarEmail() {
  mensagemEmail.value = ''
  loadingEmail.value = true

  try {
    await authStore.alterarEmail({
      novoEmail: novoEmail.value,
      senha: senhaEmail.value
    })
    email.value = authStore.usuario?.email ?? novoEmail.value
    mensagemEmail.value = '<span class="material-symbols-outlined">check_circle</span> E-mail alterado com sucesso!'
    setTimeout(() => {
      modalEmail.value = false
    }, 1400)
  } catch (e) {
    mensagemEmail.value = '<span class="material-symbols-outlined">error</span> ' + (e?.message ?? 'Erro ao alterar e-mail.')
  } finally {
    loadingEmail.value = false
  }
}
</script>

<template>
  <main class="users">
    <div class="page-head">
      <h1 class="page-titulo">Meus Dados</h1>
    </div>
    <div class="welcome-card account-form-card">

      <button class="alter-email" type="button" @click="abrirModalEmail">ALTERAR E-MAIL</button>

      <div class="account-form-grid">
        <div class="field field-full locked">
          <label>E-mail</label>
          <div class="input-lock m">
            <input type="text" :value="email" readonly placeholder=" " />
            <span class="lock-icon">🔒</span>
          </div>
        </div>

        <div class="field locked">
          <label>CPF</label>
          <div class="input-lock">
            <input type="text" :value="cpf" readonly placeholder=" " />
            <span class="lock-icon">🔒</span>
          </div>
        </div>

        <div class="field">
          <label>Nome completo*</label>
          <input type="text" v-model="nome" placeholder=" " />
        </div>

        <div class="field">
          <label>Telefone celular*</label>
          <input type="text" v-model="telefone" placeholder=" " />
        </div>
      </div>

      <div class="form-note">(*) Campos obrigatórios</div>
      <p v-if="mensagemPerfil" class="mensagem">{{ mensagemPerfil }}</p>

      <div class="form-actions">
        <button class="btn-save" type="button" :disabled="loadingPerfil" @click="salvarAlteracoes">
          {{ loadingPerfil ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES' }}
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="modalEmail" class="modal-backdrop" @click.self="modalEmail = false">
        <div class="modal-card">
          <div class="modal-header">
            <span class="modal-title">Alterar E-mail</span>
            <button class="modal-close" @click="modalEmail = false">✕</button>
          </div>

          <div class="modal-body">
            <div class="field-modal">
              <label>Novo e-mail</label>
              <input type="email" v-model="novoEmail" placeholder="seu@novoemail.com" />
            </div>

            <div class="field-modal">
              <label>Confirme sua senha</label>
              <input type="password" v-model="senhaEmail" placeholder="Digite sua senha para confirmar" />
            </div>

            <p v-if="mensagemEmail" class="mensagem-modal">{{ mensagemEmail }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn-modal-cancel" @click="modalEmail = false">Cancelar</button>
            <button class="btn-modal-confirm" :disabled="loadingEmail" @click="salvarEmail">
              {{ loadingEmail ? 'Salvando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.page-titulo {
  font-family: 'Source Sans 3', sans-serif;
  padding: 0px 28px;
  font-size: 26px;
  font-weight: 700;
  color: #141824;
  margin: 0;
}

/* ── Card principal ─────────────────────────────────── */
.account-form-card {
  background: #ffffff;
  padding: 26px 28px 24px;
  box-shadow: 0 10px 30px rgba(17, 71, 152, 0.08);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.account-form-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2c18a0, #114798, #049377);
}

.alter-email {
  position: absolute;
  right: 28px;
  border: 0;
  background: transparent;
  color: #1c335e;
  font-family: "Syne", sans-serif;
  font-size: 12px;
  font-weight: 800;
  text-decoration: underline;
  cursor: pointer;
}

.account-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 12px;
  margin-top: 44px;
}

.field {
  position: relative;
}

.field-full {
  grid-column: 1 / -1;
}

.field label {
  position: absolute;
  top: -10px;
  left: 12px;
  background: #ffffff;
  font-size: 12px;
  color: #8f9db8;
  font-weight: 500;
  z-index: 2;
}

.field input {
  width: 90%;
  height: 48px;
  border: 1.4px solid #d7deea;
  border-radius: 30px;
  padding: 0 46px 0 14px;
  color: #2a3550;
  background: #ffffff;
  font-family: "DM Sans", sans-serif;
}

.m input {
  width: 95%;
}

.field input::placeholder {
  color: transparent;
}

.locked input {
  color: #51607f;
}

.input-lock {
  position: relative;
}

.lock-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.form-note {
  font-size: 12px;
  color: #6b7a9a;
}

.mensagem {
  font-size: 13px;
  font-weight: 600;
  color: #049377;
  margin: 0;
}

.form-actions {
  display: flex;
  align-items: center;
}

.btn-save {
  margin-left: auto;
  min-width: 330px;
  height: 36px;
  border: 0;
  border-radius: 4px;
  background: #ff7a00;
  color: #ffffff;
  font-family: "Syne", sans-serif;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Modal ──────────────────────────────────────────── */
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