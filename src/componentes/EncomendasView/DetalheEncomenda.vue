<script setup>
import { computed } from 'vue'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'

const props = defineProps({
  encomenda: { type: Object, default: null },
  carregando: { type: Boolean, default: false },
  selecionado: { type: Boolean, default: false },
})

const statusLabel = computed(() => ({
  PENDENTE: 'Pendente', PAGO: 'Pago', ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue', CANCELADO: 'Cancelado',
})[props.encomenda?.status] ?? props.encomenda?.status ?? '—')

const statusClass = computed(() => ({
  PENDENTE: 'status-pendente', PAGO: 'status-pago', ENVIADO: 'status-enviado',
  ENTREGUE: 'status-entregue', CANCELADO: 'status-cancelado',
})[props.encomenda?.status] ?? '')

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

    <div class="detalhe-header">
      <div class="header-esq">
        <div class="detalhe-titulo">Detalhes do Pedido</div>
        <div class="detalhe-num">{{ encomenda?.numeroPedido ?? 'Selecione um pedido' }}</div>
      </div>
      <span v-if="encomenda" class="badge header-badge" :class="statusClass">{{ statusLabel }}</span>
    </div>

    <div v-if="carregando" class="loading-wrap">
      <span class="spinner"></span>
      <p>Carregando detalhes...</p>
    </div>

    <div v-else-if="!encomenda" class="painel-vazio">
      <svg viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <p>Clique em um pedido<br>para ver os detalhes</p>
    </div>

    <template v-else>

      <div class="det-secao">
        <div class="det-secao-titulo">Produtos</div>
        <div v-for="(item, idx) in encomenda.itens" :key="idx" class="det-produto">
          <div class="det-produto-nome">{{ item.nomeProduto }}</div>
          <div class="det-produto-linha">
            <span class="det-produto-qtd">{{ item.quantidade }}×</span>
            <span>{{ formatarPreco(item.precoUnitario) }} un.</span>
            <span class="det-produto-total">{{ formatarPreco(item.quantidade * item.precoUnitario) }}</span>
          </div>
        </div>
      </div>

      <div class="det-secao">
        <div class="det-secao-titulo">Resumo de valores</div>
        <div class="det-linha"><span class="det-lbl">Subtotal</span><span class="det-val">{{
          formatarPreco(encomenda.subtotal) }}</span></div>
        <div class="det-linha">
          <span class="det-lbl">Frete</span>
          <span class="det-val">{{ encomenda.frete === 0 ? 'Grátis' : formatarPreco(encomenda.frete) }}</span>
        </div>
        <div v-if="encomenda.desconto > 0" class="det-linha">
          <span class="det-lbl">Desconto</span>
          <span class="det-val valor-desconto">— {{ formatarPreco(encomenda.desconto) }}</span>
        </div>
        <div v-if="encomenda.descontoCupom > 0" class="det-linha">
          <span class="det-lbl">Desconto cupom</span>
          <span class="det-val valor-desconto">— {{ formatarPreco(encomenda.descontoCupom) }}</span>
        </div>
        <div class="det-total">
          <span class="det-total-lbl">Total pago</span>
          <span class="det-total-val">{{ formatarPreco(encomenda.total) }}</span>
        </div>
      </div>

      <div class="det-secao">
        <div class="det-secao-titulo">Dados do cliente</div>
        <div class="det-linha"><span class="det-lbl">Nome</span> <span class="det-val">{{ encomenda.clienteNome || '—'
        }}</span></div>
        <div class="det-linha"><span class="det-lbl">E-mail</span><span class="det-val">{{ encomenda.clienteEmail || '—'
        }}</span></div>
        <div class="det-linha"><span class="det-lbl">CPF</span> <span class="det-val">{{ encomenda.clienteCpf || '—'
        }}</span></div>
      </div>

      <div class="det-secao">
        <div class="det-secao-titulo">Endereço de entrega</div>
        <div class="det-linha">
          <span class="det-lbl">Logradouro</span>
          <span class="det-val">{{ encomenda.endRua }}, {{ encomenda.endNumero }}</span>
        </div>
        <div v-if="encomenda.endComplemento" class="det-linha">
          <span class="det-lbl">Complemento</span><span class="det-val">{{ encomenda.endComplemento }}</span>
        </div>
        <div class="det-linha"><span class="det-lbl">Bairro</span> <span class="det-val">{{ encomenda.endBairro || '—'
        }}</span></div>
        <div class="det-linha"><span class="det-lbl">Cidade / Estado</span> <span class="det-val">{{ encomenda.endCidade
        }} – {{ encomenda.endEstado }}</span></div>
        <div class="det-linha"><span class="det-lbl">CEP</span> <span class="det-val">{{ encomenda.endCep || '—'
        }}</span></div>
      </div>

      <div class="det-secao">
        <div class="det-secao-titulo">Forma de pagamento</div>
        <div class="det-linha">
          <span class="det-lbl">Método</span>
          <span class="pay-tag" :class="'pag-' + encomenda.formaPagamento">
            {{ encomenda.formaPagamento === 'pix' ? 'PIX' : 'Cartão' }}
          </span>
        </div>
        <template v-if="ehCartao">
          <div class="det-linha"><span class="det-lbl">Tipo</span> <span class="det-val">{{ encomenda.tipoPagamento ||
            '—' }}</span></div>
          <div class="det-linha"><span class="det-lbl">Bandeira</span> <span class="det-val">{{ encomenda.bandeiraCartao
            || '—' }}</span></div>
          <div class="det-linha"><span class="det-lbl">Parcelamento</span> <span class="det-val">{{
            encomenda.parcelamento || '—' }}</span></div>
          <div class="det-linha"><span class="det-lbl">Titular</span> <span class="det-val">{{ encomenda.titularCartao
            || '—' }}</span></div>
          <div class="det-linha"><span class="det-lbl">CPF do Titular</span><span class="det-val">{{
            encomenda.cpfTitular || '—' }}</span></div>
          <div class="det-linha"><span class="det-lbl">BIN do Cartão</span> <span class="det-val">{{ encomenda.binCartao
            || '—' }}</span></div>
        </template>
      </div>

    </template>
  </aside>
</template>

<style scoped>
/* ── Painel ── */
.detalhe-painel {
  width: 100%;
  background: #fff;
  border-radius: 14px;
  font-family: 'Source Sans 3', sans-serif;
  max-height: 620px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ── Cabeçalho azul ── */
.detalhe-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: linear-gradient(135deg, #2C18A0, #114798);
  color: #fff;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 1;
}

.detalhe-titulo {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
}

.detalhe-num {
  font-size: 12px;
  color: rgba(255, 255, 255, .65);
  margin-top: 3px;
}

.header-badge {
  flex-shrink: 0;
  font-size: 11px !important;
  padding: 4px 12px !important;
}

/* ── Seções ── */
.det-secao {
  padding: 18px 22px;
  border-bottom: 1px solid #eef1f8;
}

.det-secao:last-child {
  border-bottom: none;
}

.det-secao-titulo {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #2C18A0;
  margin-bottom: 14px;
}

/* ── Linhas ── */
.det-linha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-bottom: 10px;
  gap: 12px;
}

.det-linha:last-child {
  margin-bottom: 0;
}

.det-lbl {
  color: #8f9db8;
  font-size: 12px;
  white-space: nowrap;
}

.det-val {
  color: #252f4a;
  font-weight: 500;
  text-align: right;
}

/* ── Produtos ── */
.det-produto {
  background: #f7f9fc;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
}

.det-produto:last-child {
  margin-bottom: 0;
}

.det-produto-nome {
  font-size: 13px;
  font-weight: 600;
  color: #252f4a;
  margin-bottom: 5px;
}

.det-produto-linha {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7a9a;
}

.det-produto-qtd {
  font-weight: 700;
  color: #114798;
}

.det-produto-total {
  font-weight: 700;
  color: #252f4a;
  margin-left: auto;
}

/* ── Total ── */
.det-total {
  background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.det-total-lbl {
  font-size: 13px;
  font-weight: 700;
  color: #252f4a;
}

.det-total-val {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #114798;
}

.valor-desconto {
  color: #049377 !important;
  font-weight: 600;
}

/* ── Status badges ── */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 20px;
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

/* ── Pagamento ── */
.pay-tag {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 8px;
}

.pag-pix {
  background: #e0f7fa;
  color: #00838f;
}

.pag-cartao {
  background: #ede7f6;
  color: #4527a0;
}

/* ── Loading ── */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: #8f9db8;
  font-size: 14px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e4e9f2;
  border-top-color: #2C18A0;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Vazio ── */
.painel-vazio {
  padding: 40px;
  text-align: center;
  flex-direction: column;
  align-items: center;
}

.painel-vazio svg {
  width: 48px;
  height: 48px;
  opacity: .35;
  fill: none;
  stroke-width: 1.5;
  stroke: #8f9db8;
}

.painel-vazio p {
  font-size: 14px;
  line-height: 1.6;
}
</style>