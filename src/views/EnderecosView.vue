<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import axiosInstance from '@/api/config'
import ModalAdicionarEndereco from '@/componentes/AlteraçõesView/ModalAdicionarEndereco.vue'
import ModalAlterarEndereco from '@/componentes/AlteraçõesView/ModalAlterarEndereco.vue'

const authStore = useAuthStore()
const enderecos = ref([])

const modalAdicionar = ref(null)
const modalEditar = ref(null)

const confirmandoExclusao = ref(null)
const loadingExcluir = ref(false)

async function carregarEnderecos() {
  const idUsuario = authStore.usuario?.id
  if (!idUsuario) return
  const { data } = await axiosInstance.get(`/api/enderecos/${idUsuario}`)
  enderecos.value = data
}

onMounted(carregarEnderecos)

function cadastrarNovo() {
  modalAdicionar.value?.abrir()
}

function editar(endereco) {
  modalEditar.value?.abrir(endereco)
}

function pedirConfirmacaoExclusao(id) {
  confirmandoExclusao.value = id
}

function cancelarExclusao() {
  confirmandoExclusao.value = null
}

async function confirmarExclusao() {
  if (!confirmandoExclusao.value) return
  loadingExcluir.value = true
  try {
    await axiosInstance.delete(`/api/enderecos/${confirmandoExclusao.value}`)
    await carregarEnderecos()
  } catch (e) {
    alert('Erro ao excluir endereço: ' + (e?.message ?? 'Tente novamente.'))
  } finally {
    loadingExcluir.value = false
    confirmandoExclusao.value = null
  }
}

// Recarrega a lista quando os modais fecham com sucesso
async function onEnderecoSalvo() {
  await carregarEnderecos()
}
</script>

<template>
  <main class="users">
    <div class="breadcrumb">
      <span>Home</span>
      <span>›</span>
      <span>Minha Conta</span>
      <span>›</span>
      <span class="atual">Endereços</span>
    </div>

    <div class="page-head">
      <span class="page-icon">📍</span>
      <h1 class="page-titulo">ENDEREÇOS</h1>
    </div>

    <div class="welcome-card">
      <div class="card-top">
        <button class="btn-novo" type="button" @click="cadastrarNovo">
          + CADASTRAR NOVO ENDEREÇO
        </button>
      </div>

      <div class="enderecos-grid">
        <div
          v-for="end in enderecos"
          :key="end.id"
          class="addr-card"
          :class="{ padrao: end.padrao }"
        >
          <div class="card-header">
            <span class="addr-nome">{{ end.nome }}</span>
            <span v-if="end.padrao" class="badge-padrao">(PADRÃO)</span>
          </div>

          <span class="addr-linha">{{ end.rua }}, {{ end.numero }}</span>
          <span v-if="end.complemento" class="addr-linha">{{ end.complemento }}</span>
          <span class="addr-linha">{{ end.bairro }}</span>
          <span class="addr-linha">CEP {{ end.cep }} – {{ end.cidade }}, {{ end.estado }}</span>

          <div class="addr-actions">
            <button
              class="btn-action excluir"
              type="button"
              @click="pedirConfirmacaoExclusao(end.id)"
            >
              EXCLUIR
            </button>
            <button
              class="btn-action"
              type="button"
              @click="editar(end)"
            >
              EDITAR
            </button>
          </div>
        </div>
      </div>

      <div v-if="!enderecos.length" class="sem-endereco">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#d7deea">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <p>Nenhum endereço cadastrado.</p>
      </div>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <Teleport to="body">
      <div v-if="confirmandoExclusao" class="modal-backdrop" @click.self="cancelarExclusao">
        <div class="modal-confirm-card">
          <div class="modal-header">
            <span class="modal-title">Excluir Endereço</span>
            <button class="modal-close" @click="cancelarExclusao">✕</button>
          </div>
          <div class="modal-body-confirm">
            <p>Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-modal-cancel" @click="cancelarExclusao">Cancelar</button>
            <button
              class="btn-modal-delete"
              :disabled="loadingExcluir"
              @click="confirmarExclusao"
            >
              {{ loadingExcluir ? 'Excluindo...' : 'Excluir' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modais reutilizáveis -->
    <ModalAdicionarEndereco ref="modalAdicionar" @salvo="onEnderecoSalvo" />
    <ModalAlterarEndereco ref="modalEditar" @salvo="onEnderecoSalvo" />
  </main>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: #8f9db8;
  margin-bottom: 16px;
}

.breadcrumb .atual {
  color: #252f4a;
  font-weight: 500;
}

.page-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.page-titulo {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #141824;
  margin: 0;
}

/* ── Card principal ─────────────────────────────────── */
.welcome-card {
  background: #ffffff;
  padding: 20px 24px 24px;
  box-shadow: 0 10px 30px rgba(17, 71, 152, 0.08);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2c18a0, #114798, #049377);
}

/* ── Botão novo endereço ────────────────────────────── */
.card-top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.btn-novo {
  height: 36px;
  padding: 0 16px;
  border: 1.4px solid #ff7a00;
  border-radius: 4px;
  background: transparent;
  color: #ff7a00;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-novo:hover {
  background: #fff5ee;
}

/* ── Grid de endereços ──────────────────────────────── */
.enderecos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* ── Card de endereço ───────────────────────────────── */
.addr-card {
  border: 1.4px solid #d7deea;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #ffffff;
}

.addr-card.padrao {
  background: #fff5ee;
  border-color: #ffc49a;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.addr-nome {
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 800;
  color: #141824;
}

.badge-padrao {
  font-family: 'Syne', sans-serif;
  font-size: 11px;
  font-weight: 800;
  color: #ff7a00;
}

.addr-linha {
  font-size: 13px;
  color: #51607f;
  line-height: 1.5;
}

/* ── Ações do card ──────────────────────────────────── */
.addr-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #edf0f7;
}

.btn-action {
  border: 0;
  background: transparent;
  font-family: 'Syne', sans-serif;
  font-size: 11px;
  font-weight: 800;
  color: #51607f;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  transition: color 0.2s;
}

.btn-action:hover {
  color: #141824;
}

.btn-action.excluir:hover {
  color: #d63031;
}

/* ── Estado vazio ───────────────────────────────────── */
.sem-endereco {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: #8f9db8;
  font-size: 14px;
}

/* ── Modal de confirmação de exclusão ───────────────── */
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

.modal-confirm-card {
  background: #ffffff;
  border-radius: 20px;
  width: 400px;
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

.modal-body-confirm {
  padding: 24px;
}

.modal-body-confirm p {
  font-size: 14px;
  color: #51607f;
  line-height: 1.6;
  margin: 0;
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

.btn-modal-delete {
  height: 36px;
  padding: 0 24px;
  border: 0;
  border-radius: 30px;
  background: #d63031;
  color: #ffffff;
  font-family: "Syne", sans-serif;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-modal-delete:hover {
  background: #b71c1c;
}

.btn-modal-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>