<script setup>
import { onMounted, ref } from 'vue'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'
import { useEncomendasStore } from '@/stores/useEncomendasStore'
import DetalheEncomenda from '@/componentes/EncomendasView/DetalheEncomenda.vue'

const encomendasStore = useEncomendasStore()
const pedidoSelecionadoId = ref(null)

onMounted(async () => {
  await encomendasStore.carregarEncomendas()
})

async function selecionarPedido(id) {
  if (pedidoSelecionadoId.value === id) {
    pedidoSelecionadoId.value = null
    encomendasStore.encomendaDetalhe = null
    return
  }
  pedidoSelecionadoId.value = id
  await encomendasStore.carregarDetalhe(id)
}

function fecharDetalhe() {
  pedidoSelecionadoId.value = null
  encomendasStore.encomendaDetalhe = null
}

function formatarDataHora(dataHora) {
  if (!dataHora) return '—'
  const d = new Date(dataHora)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const statusLabel = (status) => {
  const map = {
    PENDENTE: 'Pendente',
    PAGO: 'Pago',
    ENVIADO: 'Enviado',
    ENTREGUE: 'Entregue',
    CANCELADO: 'Cancelado',
  }
  return map[status] ?? status
}

const statusClass = (status) => {
  const map = {
    PENDENTE: 'status-pendente',
    PAGO: 'status-pago',
    ENVIADO: 'status-enviado',
    ENTREGUE: 'status-entregue',
    CANCELADO: 'status-cancelado',
  }
  return map[status] ?? ''
}
</script>

<template>
  <main>
    <div class="container1">

      <div class="lista-header">
        <h1 class="page-title">Meus Pedidos</h1>
        <span v-if="encomendasStore.encomendas.length" class="total-badge">
          {{ encomendasStore.encomendas.length }} pedido(s)
        </span>
      </div>

      <!-- Carregando -->
      <div v-if="encomendasStore.carregando" class="estado-info">
        <span class="spinner"></span>
        <p>Carregando pedidos...</p>
      </div>

      <!-- Erro -->
      <div v-else-if="encomendasStore.erro" class="estado-erro">
        <p>{{ encomendasStore.erro }}</p>
      </div>

      <!-- Vazio -->
      <div v-else-if="!encomendasStore.encomendas.length" class="estado-vazio">
        <p>Você ainda não realizou nenhum pedido.</p>
      </div>

      <!-- Cards + detalhe inline -->
      <template v-for="pedido in encomendasStore.encomendas" :key="pedido.id">

        <!-- Card do pedido -->
        <div
          class="pedido-card"
          :class="{ ativo: pedidoSelecionadoId === pedido.id }"
          @click="selecionarPedido(pedido.id)"
          role="button"
          :aria-expanded="pedidoSelecionadoId === pedido.id"
        >
          <div class="pedido-header">

            <div class="col">
              <span class="label">PEDIDO</span>
              <span class="value orange">{{ pedido.numeroPedido }}</span>
            </div>

            <div class="col">
              <span class="label">DATA / HORA</span>
              <span class="value">{{ formatarDataHora(pedido.dataHora) }}</span>
            </div>

            <div class="col">
              <span class="label">PAGAMENTO</span>
              <span class="value pagamento-pill" :class="'pag-' + pedido.formaPagamento">
                {{ pedido.formaPagamento === 'pix' ? 'PIX' : 'Cartão' }}
              </span>
            </div>

            <div class="col">
              <span class="label">STATUS</span>
              <span class="badge" :class="statusClass(pedido.status)">
                {{ statusLabel(pedido.status) }}
              </span>
            </div>

            <div class="col valor-col">
              <span class="label">TOTAL</span>
              <span class="value bold">{{ formatarPreco(pedido.total) }}</span>
            </div>

            <div class="seta" :class="{ girar: pedidoSelecionadoId === pedido.id }">›</div>

          </div>
        </div>

        <!-- Detalhe abre ABAIXO do card clicado -->
        <transition name="expand">
          <div
            v-if="pedidoSelecionadoId === pedido.id"
            class="detalhe-inline"
          >
            <DetalheEncomenda
              :encomenda="encomendasStore.encomendaDetalhe"
              :carregando="encomendasStore.carregandoDetalhe"
              @fechar="fecharDetalhe"
            />
          </div>
        </transition>

      </template>

    </div>
  </main>
</template>

<style scoped>
main {
  width: 1400px;
  max-width: 100%;
  margin: 0 auto;
  font-family: var(--font-family-base);
  font-weight: 300;
  padding: 0 1rem;
}

.container1 {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 3rem;
}

/* ── Header da lista ───────────────────── */
.lista-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
}

.total-badge {
  font-size: .75rem;
  font-weight: 600;
  background: var(--color-primary);
  color: #fff;
  padding: .25rem .75rem;
  border-radius: 999px;
}

/* ── Card de pedido ────────────────────── */
.pedido-card {
  background: var(--color-surface);
  border-radius: 12px;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px #00000010;
  padding: 1.2rem;
  margin-bottom: .75rem;
  cursor: pointer;
  transition: border-color .15s, background .15s, box-shadow .15s;
}

.pedido-card:hover {
  background: var(--color-bg-hover, #f9f9f9);
  box-shadow: 0 4px 14px #00000018;
}

.pedido-card.ativo {
  border-color: var(--color-primary);
  background: var(--color-bg-hover, #f9f9f9);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 0;
}

.pedido-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.col {
  display: flex;
  flex-direction: column;
  text-align: left;
  min-width: 120px;
}

.label {
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .6px;
  color: var(--color-text-muted, #999);
  text-transform: uppercase;
  margin-bottom: .2rem;
}

.value {
  font-size: .85rem;
  color: var(--color-text);
}

.orange { color: var(--color-warning, #f57c00); font-weight: 700; }
.bold   { font-weight: 700; }

.valor-col { margin-left: auto; text-align: right; min-width: 100px; }

/* ── Seta indicadora ───────────────────── */
.seta {
  font-size: 1.4rem;
  color: var(--color-text-muted, #bbb);
  margin-left: auto;
  transition: transform .25s;
  line-height: 1;
}
.seta.girar { transform: rotate(90deg); color: var(--color-primary); }

/* ── Detalhe inline abaixo do card ─────── */
.detalhe-inline {
  border: 2px solid var(--color-primary);
  border-top: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  background: var(--color-surface);
  margin-bottom: .75rem;
  overflow: hidden;
}

/* ── Badge de status ────────────────────── */
.badge {
  display: inline-block;
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .5px;
  padding: .2rem .55rem;
  border-radius: 999px;
  text-transform: uppercase;
  width: fit-content;
}
.status-pendente  { background: #fff3e0; color: #e65100; }
.status-pago      { background: #e8f5e9; color: #2e7d32; }
.status-enviado   { background: #e3f2fd; color: #1565c0; }
.status-entregue  { background: #f3e5f5; color: #6a1b9a; }
.status-cancelado { background: #ffebee; color: #b71c1c; }

/* ── Pagamento pill ─────────────────────── */
.pagamento-pill {
  font-size: .72rem;
  font-weight: 700;
  padding: .15rem .5rem;
  border-radius: 6px;
  width: fit-content;
}
.pag-pix    { background: #e0f7fa; color: #00838f; }
.pag-cartao { background: #ede7f6; color: #4527a0; }

/* ── Estados da lista ───────────────────── */
.estado-info,
.estado-vazio,
.estado-erro {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-muted, #aaa);
  font-size: .9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .8rem;
}

.estado-erro { color: var(--color-danger, #e53935); }

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--color-border, #e0e0e0);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Animação expand ────────────────────── */
.expand-enter-active,
.expand-leave-active {
  transition: opacity .2s ease, max-height .25s ease;
  max-height: 2000px;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
