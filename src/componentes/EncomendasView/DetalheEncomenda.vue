<script setup>
import { computed } from 'vue'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'

const props = defineProps({
  encomenda: { type: Object, required: true },
  carregando: { type: Boolean, default: false },
})

const emit = defineEmits(['fechar'])

const statusLabel = computed(() => {
  const map = {
    PENDENTE: 'Pendente',
    PAGO: 'Pago',
    ENVIADO: 'Enviado',
    ENTREGUE: 'Entregue',
    CANCELADO: 'Cancelado',
  }
  return map[props.encomenda?.status] ?? props.encomenda?.status ?? '—'
})

const statusClass = computed(() => {
  const map = {
    PENDENTE: 'status-pendente',
    PAGO: 'status-pago',
    ENVIADO: 'status-enviado',
    ENTREGUE: 'status-entregue',
    CANCELADO: 'status-cancelado',
  }
  return map[props.encomenda?.status] ?? ''
})

function formatarDataHora(dataHora) {
  if (!dataHora) return '—'
  const d = new Date(dataHora)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const ehCartao = computed(() => props.encomenda?.formaPagamento === 'cartao')
</script>

<template>
  <aside class="detalhe-painel">

    <!-- Cabeçalho -->
    <div class="detalhe-header">
      <h2 class="detalhe-titulo">Detalhes do Pedido</h2>
      <button class="btn-fechar" @click="emit('fechar')" aria-label="Fechar detalhes">✕</button>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="loading-wrap">
      <span class="spinner"></span>
      <p>Carregando detalhes...</p>
    </div>

    <template v-else-if="encomenda">

      <!-- Número e status -->
      <div class="secao info-topo">
        <div class="linha-destaque">
          <span class="label">Nº do Pedido</span>
          <span class="numero-pedido">{{ encomenda.numeroPedido }}</span>
        </div>
        <div class="linha-destaque">
          <span class="label">Data e Hora</span>
          <span>{{ formatarDataHora(encomenda.dataHora) }}</span>
        </div>
        <div class="linha-destaque">
          <span class="label">Status</span>
          <span class="badge" :class="statusClass">{{ statusLabel }}</span>
        </div>
      </div>

      <!-- Produtos comprados -->
      <div class="secao">
        <h3 class="secao-titulo">Produtos</h3>
        <div
          v-for="(item, idx) in encomenda.itens"
          :key="idx"
          class="item-produto"
        >
          <div class="item-nome">{{ item.nomeProduto }}</div>
          <div class="item-qtd-preco">
            <span class="qtd">{{ item.quantidade }}x</span>
            <span class="preco-unit">{{ formatarPreco(item.precoUnitario) }}</span>
            <span class="preco-total">= {{ formatarPreco(item.quantidade * item.precoUnitario) }}</span>
          </div>
        </div>
      </div>

      <!-- Dados do cliente -->
      <div class="secao">
        <h3 class="secao-titulo">Dados do Cliente</h3>
        <div class="campo"><span class="label">Nome</span><span>{{ encomenda.clienteNome || '—' }}</span></div>
        <div class="campo"><span class="label">E-mail</span><span>{{ encomenda.clienteEmail || '—' }}</span></div>
        <div class="campo"><span class="label">CPF</span><span>{{ encomenda.clienteCpf || '—' }}</span></div>
      </div>

      <!-- Dados de entrega -->
      <div class="secao">
        <h3 class="secao-titulo">Dados de Entrega</h3>
        <div class="campo">
          <span class="label">Rua e Número</span>
          <span>{{ encomenda.endRua }}, {{ encomenda.endNumero }}</span>
        </div>
        <div v-if="encomenda.endComplemento" class="campo">
          <span class="label">Complemento</span>
          <span>{{ encomenda.endComplemento }}</span>
        </div>
        <div class="campo"><span class="label">Bairro</span><span>{{ encomenda.endBairro || '—' }}</span></div>
        <div class="campo">
          <span class="label">Cidade / Estado</span>
          <span>{{ encomenda.endCidade }} – {{ encomenda.endEstado }}</span>
        </div>
        <div class="campo"><span class="label">CEP</span><span>{{ encomenda.endCep || '—' }}</span></div>
      </div>

      <!-- Resumo de valores -->
      <div class="secao">
        <h3 class="secao-titulo">Resumo de Valores</h3>
        <div class="campo"><span class="label">Subtotal</span><span>{{ formatarPreco(encomenda.subtotal) }}</span></div>
        <div class="campo"><span class="label">Frete</span><span>{{ formatarPreco(encomenda.frete) }}</span></div>
        <div v-if="encomenda.desconto > 0" class="campo">
          <span class="label">Desconto</span>
          <span class="valor-desconto">– {{ formatarPreco(encomenda.desconto) }}</span>
        </div>
        <div v-if="encomenda.descontoCupom > 0" class="campo">
          <span class="label">Desconto Cupom</span>
          <span class="valor-desconto">– {{ formatarPreco(encomenda.descontoCupom) }}</span>
        </div>
        <div class="campo total-linha">
          <span class="label">Total</span>
          <span class="total-valor">{{ formatarPreco(encomenda.total) }}</span>
        </div>
      </div>

      <!-- Forma de pagamento -->
      <div class="secao">
        <h3 class="secao-titulo">Forma de Pagamento</h3>
        <div class="campo">
          <span class="label">Pagamento</span>
          <span class="pagamento-tag" :class="'pag-' + encomenda.formaPagamento">
            {{ encomenda.formaPagamento === 'pix' ? 'PIX' : 'Cartão' }}
          </span>
        </div>

        <!-- Campos exclusivos de cartão -->
        <template v-if="ehCartao">
          <div class="campo"><span class="label">Tipo</span><span>{{ encomenda.tipoPagamento || '—' }}</span></div>
          <div class="campo"><span class="label">Bandeira</span><span>{{ encomenda.bandeiraCartao || '—' }}</span></div>
          <div class="campo"><span class="label">Parcelamento</span><span>{{ encomenda.parcelamento || '—' }}</span></div>
          <div class="campo"><span class="label">Titular do Cartão</span><span>{{ encomenda.titularCartao || '—' }}</span></div>
          <div class="campo"><span class="label">CPF do Titular</span><span>{{ encomenda.cpfTitular || '—' }}</span></div>
          <div class="campo"><span class="label">BIN do Cartão</span><span>{{ encomenda.binCartao || '—' }}</span></div>
        </template>
      </div>

    </template>

    <div v-else class="vazio">
      <p>Nenhuma informação disponível.</p>
    </div>

  </aside>
</template>

<style scoped>
.detalhe-painel {
  width: 100%;
  background: var(--color-surface);
  border-radius: 16px;
  border: 2px solid var(--color-primary);
  padding: 1.8rem 1.6rem;
  font-family: var(--font-family-base);
  font-weight: 300;
  overflow-y: auto;
  max-height: 85vh;
  position: sticky;
  top: 1rem;
}

.detalhe-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.4rem;
}

.detalhe-titulo {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: .4px;
  color: var(--color-text);
  margin: 0;
}

.btn-fechar {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--color-text-muted, #888);
  padding: 0 .3rem;
  line-height: 1;
  transition: color .15s;
}
.btn-fechar:hover { color: var(--color-danger, #e53935); }

/* ── Seções ─────────────────────────────── */
.secao {
  border-top: 1px solid var(--color-border, #e0e0e0);
  padding: 1rem 0 .4rem;
}
.secao:first-of-type { border-top: none; }

.secao-titulo {
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .8px;
  text-transform: uppercase;
  color: var(--color-primary);
  margin: 0 0 .75rem;
}

/* ── Info topo ──────────────────────────── */
.info-topo .linha-destaque {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .55rem;
}

.numero-pedido {
  font-weight: 700;
  color: var(--color-warning, #f57c00);
  font-size: .9rem;
}

/* ── Campos ─────────────────────────────── */
.campo {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: .5rem;
  margin-bottom: .45rem;
  font-size: .82rem;
}

.label {
  font-size: .7rem;
  font-weight: 600;
  letter-spacing: .3px;
  color: var(--color-text-muted, #888);
  white-space: nowrap;
  padding-top: .05rem;
}

/* ── Itens do pedido ────────────────────── */
.item-produto {
  background: var(--color-bg-hover, #f9f9f9);
  border-radius: 8px;
  padding: .65rem .8rem;
  margin-bottom: .5rem;
}

.item-nome {
  font-size: .83rem;
  font-weight: 600;
  margin-bottom: .3rem;
  color: var(--color-text);
}

.item-qtd-preco {
  display: flex;
  gap: .6rem;
  align-items: center;
  font-size: .78rem;
  color: var(--color-text-muted, #666);
}

.qtd { font-weight: 700; color: var(--color-primary); }

.preco-total {
  margin-left: auto;
  font-weight: 700;
  color: var(--color-text);
}

/* ── Total ──────────────────────────────── */
.total-linha {
  margin-top: .6rem;
  padding-top: .6rem;
  border-top: 1px dashed var(--color-border, #ddd);
}

.total-valor {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-primary);
}

.valor-desconto { color: var(--color-success, #43a047); font-weight: 600; }

/* ── Badge de status ────────────────────── */
.badge {
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: .5px;
  padding: .25rem .65rem;
  border-radius: 999px;
  text-transform: uppercase;
}
.status-pendente  { background: #fff3e0; color: #e65100; }
.status-pago      { background: #e8f5e9; color: #2e7d32; }
.status-enviado   { background: #e3f2fd; color: #1565c0; }
.status-entregue  { background: #f3e5f5; color: #6a1b9a; }
.status-cancelado { background: #ffebee; color: #b71c1c; }

/* ── Pagamento tag ──────────────────────── */
.pagamento-tag {
  font-size: .75rem;
  font-weight: 700;
  padding: .2rem .6rem;
  border-radius: 6px;
  letter-spacing: .5px;
}
.pag-pix    { background: #e0f7fa; color: #00838f; }
.pag-cartao { background: #ede7f6; color: #4527a0; }

/* ── Loading ────────────────────────────── */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .8rem;
  padding: 2.5rem 0;
  color: var(--color-text-muted, #888);
  font-size: .85rem;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--color-border, #e0e0e0);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.vazio {
  text-align: center;
  color: var(--color-text-muted, #aaa);
  padding: 2rem 0;
  font-size: .85rem;
}
</style>
