<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'

import ListaPagamentos from '@/componentes/PagamentoView/ListaPagamentos.vue'
import MarketResumo from '@/componentes/PagamentoView/MarketResumo.vue'
import ModaisPagamento from '@/componentes/PagamentoView/ModaisPagamento.vue'

const router = useRouter()
const carrinho = useCarrinhoStore()

// ── Estado de pagamento ───────────────────────────────────
const metodoPagamento = ref(null)       // "pix" | "cartao" | null
const dadosFinanceiros = ref(null)      // {subtotal, frete, desconto, descontoCupom, total}
const modalAberto = ref(false)
const erroPagamento = ref('')

// ── Guard: frete precisa estar selecionado ────────────────
onMounted(() => {
  if (carrinho.freteSelecionado == null) {
    alert('Selecione o endereço de entrega primeiro.')
    router.push({ name: 'EnderecoEntrega' })
  }
})

// ── Recebe seleção do método de pagamento ─────────────────
function aoSelecionarPagamento(tipo) {
  metodoPagamento.value = tipo
  erroPagamento.value = ''
}

// ── Recebe clique no botão "CONFIRMAR PAGAMENTO" ──────────
function aoConfirmar(dados) {
  erroPagamento.value = ''

  if (!metodoPagamento.value) {
    erroPagamento.value = 'Selecione uma forma de pagamento antes de continuar.'
    return
  }

  if (!carrinho.enderecoSelecionado) {
    erroPagamento.value = 'Nenhum endereço de entrega selecionado. Volte e selecione um endereço.'
    return
  }

  dadosFinanceiros.value = dados
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
}
</script>

<template>
  <main>
    <div class="container1">

      <!-- ── Coluna esquerda: seletor de pagamento ─────── -->
      <div class="produtos-col">
        <ListaPagamentos @selecionarPagamento="aoSelecionarPagamento" />

        <!-- Feedback de validação -->
        <transition name="fade">
          <div v-if="erroPagamento" class="alerta-erro">
            ⚠️ {{ erroPagamento }}
          </div>
        </transition>
      </div>

      <!-- ── Coluna direita: resumo e botão ────────────── -->
      <div class="market-col">
        <MarketResumo @confirmar="aoConfirmar" />
      </div>

    </div>

    <!-- ── Modal (PIX ou Cartão) ─────────────────────── -->
    <Teleport to="body">
      <ModaisPagamento
        v-if="modalAberto"
        :formaPagamento="metodoPagamento"
        :dadosFinanceiros="dadosFinanceiros"
        @fechar="fecharModal"
      />
    </Teleport>
  </main>
</template>

<style scoped>
main {
  width: 1400px;
  margin: 0 auto;
  font-family: var(--font-family-base);
  font-weight: 300;
}

.container1 {
  width: 100%;
  display: flex;
  gap: 2.9rem;
  justify-content: space-evenly;
  align-items: flex-start;
  margin-bottom: 2rem;
}

/* ── Coluna esquerda ───────────────────────────────── */
.produtos-col {
  width: 60rem;
  border-radius: 20px;
  border: 2px solid var(--color-primary);
  padding: 2rem 2rem;
}

/* ── Coluna direita ────────────────────────────────── */
.market-col {
  width: 26rem;
  border-radius: 20px;
  border: 2px solid var(--color-primary);
  padding: 1.5rem;
  background: var(--color-surface);
  position: sticky;
  top: 1.5rem;
}

/* ── Alerta de erro de validação ───────────────────── */
.alerta-erro {
  margin-top: 1.2rem;
  background: #fff0f0;
  border-left: 4px solid var(--color-error);
  color: var(--color-error);
  font-size: .85rem;
  font-weight: 500;
  padding: .7rem 1rem;
  border-radius: 6px;
}

/* ── Transição do alerta ───────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
