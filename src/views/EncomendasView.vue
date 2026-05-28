<script setup>
import { onMounted, ref, computed } from 'vue'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'
import { useEncomendasStore } from '@/stores/useEncomendasStore'
import DetalheEncomenda from '@/componentes/EncomendasView/DetalheEncomenda.vue'

const encomendasStore = useEncomendasStore()
const pedidoSelecionadoId = ref(null)
const filtroAtivo = ref('todos')

onMounted(async () => {
  await encomendasStore.carregarEncomendas()
})

async function selecionarPedido(id) {
  if (pedidoSelecionadoId.value === id) return
  pedidoSelecionadoId.value = id
  await encomendasStore.carregarDetalhe(id)
}

function formatarDataHora(dataHora) {
  if (!dataHora) return '—'
  const d = new Date(dataHora)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const statusLabel = (status) => ({
  PENDENTE: 'Pendente', PAGO: 'Pago', ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue', CANCELADO: 'Cancelado',
})[status] ?? status

const statusClass = (status) => ({
  PENDENTE: 'status-pendente', PAGO: 'status-pago', ENVIADO: 'status-enviado',
  ENTREGUE: 'status-entregue', CANCELADO: 'status-cancelado',
})[status] ?? ''

const stats = computed(() => {
  const lista = encomendasStore.encomendas
  return {
    total: lista.length,
    entregues: lista.filter(p => p.status === 'ENTREGUE').length,
    andamento: lista.filter(p => ['ENVIADO', 'PENDENTE', 'PAGO'].includes(p.status)).length,
    totalGasto: lista.reduce((acc, p) => acc + (p.total ?? 0), 0),
  }
})

const filtros = [
  { key: 'todos', label: 'Todos' },
  { key: 'enviado', label: 'Enviados' },
  { key: 'entregue', label: 'Entregues' },
  { key: 'pendente', label: 'Pendentes' },
]

const pedidosFiltrados = computed(() => {
  const lista = encomendasStore.encomendas
  if (filtroAtivo.value === 'todos') return lista
  return lista.filter(p => p.status === filtroAtivo.value.toUpperCase())
})
</script>

<template>
  <main class="users mp-main">

    <!-- Cabeçalho -->
    <div class="page-head">
      <h1 class="page-titulo">Minhas Encomendas</h1>
    </div>

    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span>Home</span>
      <span class="sep">›</span>
      <span class="atual">Minhas Encomendas</span>
    </div>

    <!-- Layout: lista (esq) + painel (dir) -->
    <div class="layout-dois">

      <!-- Lista de pedidos -->
      <div class="coluna-lista">

        <!-- Stats dentro da coluna (mesma largura da lista) -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon icon-blue">
              <span class="material-symbols-outlined">shopping_bag</span>
            </div>
            <div>
              <div class="stat-num">{{ stats.total }}</div>
              <div class="stat-lbl">Total de pedidos</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-green">
              <span class="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <div class="stat-num">{{ stats.entregues }}</div>
              <div class="stat-lbl">Entregue</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-warn">
              <span class="material-symbols-outlined">warning</span>
            </div>
            <div>
              <div class="stat-num">{{ stats.andamento }}</div>
              <div class="stat-lbl">Em andamento</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-red">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <div>
              <div class="stat-num">{{ formatarPreco(stats.totalGasto) }}</div>
              <div class="stat-lbl">Total gasto</div>
            </div>
          </div>
        </div>

        <!-- Card da lista -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Histórico de pedidos</div>
            <div class="filtros">
              <button v-for="f in filtros" :key="f.key" class="filtro-btn" :class="{ ativo: filtroAtivo === f.key }"
                @click="filtroAtivo = f.key">{{ f.label }}</button>
            </div>
          </div>

          <div v-if="encomendasStore.carregando" class="estado-info">
            <span class="spinner"></span>
            <p>Carregando pedidos...</p>
          </div>

          <div v-else-if="encomendasStore.erro" class="estado-erro">
            <p>{{ encomendasStore.erro }}</p>
          </div>

          <div v-else-if="!pedidosFiltrados.length" class="estado-vazio">
            <span class="material-symbols-outlined">shopping_bag</span>
            <p>Nenhum pedido encontrado.</p>
          </div>

          <div v-for="pedido in pedidosFiltrados" :key="pedido.id" class="pedido-item"
            :class="{ selecionado: pedidoSelecionadoId === pedido.id }" @click="selecionarPedido(pedido.id)"
            role="button">
            <div class="pedido-icone">
              <span class="material-symbols-outlined">shopping_bag</span>
            </div>
            <div class="pedido-info">
              <div class="pedido-num">{{ pedido.numeroPedido }}</div>
              <div class="pedido-data">{{ formatarDataHora(pedido.dataHora) }}</div>
              <div class="pedido-produtos">
                {{pedido.itens?.map(i => i.nomeProduto + (i.quantidade > 1 ? ` (×${i.quantidade})` : '')).join(' · ')
                }}
              </div>
            </div>
            <div class="pedido-direita">
              <div class="pedido-valor">{{ formatarPreco(pedido.total) }}</div>
              <span class="status" :class="statusClass(pedido.status)">{{ statusLabel(pedido.status) }}</span>
            </div>
            <span class="pedido-seta">›</span>
          </div>
        </div>
      </div>

      <!-- Painel lateral fixo -->
      <div class="coluna-painel">
        <div class="card painel-card">
          <DetalheEncomenda :encomenda="encomendasStore.encomendaDetalhe"
            :carregando="encomendasStore.carregandoDetalhe" :selecionado="pedidoSelecionadoId !== null" />
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200..900&display=swap');

.mp-main {
  color: #252f4a;
}

.page-titulo {
  font-family: 'Source Sans 3', sans-serif;
  padding: 0px 28px;
  font-size: 26px;
  font-weight: 700;
  color: #141824;
  margin: 0;
}

/* ── Breadcrumb ── */
.breadcrumb {
  padding: 14px 28px;
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: #9aa3bb;
}

.breadcrumb .sep {
  color: #cbd2e0;
}

.breadcrumb .atual {
  color: #252f4a;
  font-weight: 600;
}

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e4e9f2;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 10px rgba(17, 71, 152, .07);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke-width: 1.5;
}

.icon-blue {
  background: #eeeffe;
}

.icon-blue svg {
  stroke: #2C18A0;
}

.icon-green {
  background: #e4f5ef;
}

.icon-green svg {
  stroke: #049377;
}

.icon-warn {
  background: #fff8ee;
}

.icon-warn svg {
  stroke: #e17055;
}

.icon-red {
  background: #fff0f0;
}

.icon-red svg {
  stroke: #d63031;
}

.stat-num {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #141824;
}

.stat-lbl {
  font-size: 12px;
  color: #8f9db8;
  margin-top: 2px;
}

/* ── Layout dois ── */
.layout-dois {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  align-items: start;
}

.coluna-lista {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Card ── */
.card {
  background: #fff;
  border: 1px solid #e4e9f2;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(17, 71, 152, .07);
}

/* ── Painel ── */
.coluna-painel {
  position: sticky;
  top: 20px;
}

.painel-card {
  overflow: visible;
}

/* ── Header da lista ── */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px 22px;
  border-bottom: 1px solid #eef1f8;
}

.card-title {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #141824;
}

/* ── Filtros ── */
.filtros {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filtro-btn {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1.5px solid #d6dcea;
  background: #fff;
  color: #8f9db8;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}

.filtro-btn:hover {
  border-color: #114798;
  color: #114798;
}

.filtro-btn.ativo {
  background: #114798;
  color: #fff;
  border-color: #114798;
}

/* ── Pedido item ── */
.pedido-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 22px;
  border-bottom: 1px solid #eef1f8;
  cursor: pointer;
  transition: background .15s;
}

.pedido-item:last-child {
  border-bottom: none;
}

.pedido-item:hover {
  background: #f7f9fc;
}

.pedido-item.selecionado {
  background: #f0f4ff;
  border-left: 3px solid #2C18A0;
  padding-left: 19px;
}

.pedido-icone {
  width: 42px;
  height: 42px;
  background: #eef1f8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pedido-icone svg {
  width: 20px;
  height: 20px;
  stroke: #2C18A0;
  fill: none;
  stroke-width: 1.5;
  opacity: .6;
}

.pedido-info {
  flex: 1;
  min-width: 0;
}

.pedido-num {
  font-size: 13px;
  font-weight: 700;
  color: #2C18A0;
  margin-bottom: 2px;
  font-family: 'Source Sans 3', sans-serif;
}

.pedido-data {
  font-size: 12px;
  color: #8f9db8;
}

.pedido-produtos {
  font-size: 12px;
  color: #6b7a9a;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pedido-direita {
  text-align: right;
  flex-shrink: 0;
}

.pedido-valor {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #141824;
}

.pedido-seta {
  color: #d6dcea;
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}

/* ── Status ── */
.status {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  margin-top: 4px;
}

.status-pendente {
  background: #fff3e0;
  color: #c35a00;
}

.status-pago {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-enviado {
  background: #e3f2fd;
  color: #1565c0;
}

.status-entregue {
  background: #f3e5f5;
  color: #6a1b9a;
}

.status-cancelado {
  background: #ffebee;
  color: #b71c1c;
}

/* ── Estados da lista ── */
.estado-info,
.estado-vazio,
.estado-erro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  color: #8f9db8;
  font-size: 14px;
}

.estado-vazio svg {
  width: 40px;
  height: 40px;
  fill: none;
  stroke: #8f9db8;
  stroke-width: 1.5;
  opacity: .4;
}

.estado-erro {
  color: #d63031;
}

/* ── Spinner ── */
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e4e9f2;
  border-top-color: #2C18A0;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
</style>