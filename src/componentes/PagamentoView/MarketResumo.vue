<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
import { useCupomStore } from '@/stores/useCupomStore'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'

const emit = defineEmits(['confirmar'])

const carrinho = useCarrinhoStore()
const cupons = useCupomStore()

const cupomDigitado = ref('')
const percentualDesconto = ref(0)
const msgCupom = ref('')
const cupomValido = ref(false)

onMounted(async () => {
  await cupons.carregarCupons()
})

function aplicarCupom() {
  const cupom = cupons.cupons.find(c =>
    c.cupom_nome === cupomDigitado.value.trim().toUpperCase()
  )
  if (cupom) {
    percentualDesconto.value = cupom.desconto / 100
    msgCupom.value = `Cupom aplicado! ${cupom.desconto}% de desconto`
    cupomValido.value = true
  } else {
    percentualDesconto.value = 0
    msgCupom.value = 'Cupom inválido ou não encontrado'
    cupomValido.value = false
  }
}

// ── Valores calculados ────────────────────────────────────
const subtotal = computed(() => Number(carrinho.total) || 0)
const frete    = computed(() => Number(carrinho.freteSelecionado) || 0)

// Desconto PIX só aparece como referência na tela; não é deduzido aqui
// O desconto de cupom é aplicado sobre o subtotal
const descontoCupom = computed(() =>
  subtotal.value * percentualDesconto.value
)

const totalFinal = computed(() =>
  subtotal.value + frete.value - descontoCupom.value
)

// ── Confirmar pagamento ───────────────────────────────────
function confirmar() {
  emit('confirmar', {
    subtotal: subtotal.value,
    frete: frete.value,
    desconto: 0,
    descontoCupom: descontoCupom.value,
    total: totalFinal.value,
  })
}
</script>

<template>
  <div class="resumo-wrap">
    <h2 class="titulo-resumo"># RESUMO</h2>

    <!-- Subtotal -->
    <div class="linha">
      <span class="label">Valor dos Produtos</span>
      <span>{{ formatarPreco(subtotal) }}</span>
    </div>
    <hr>

    <!-- Frete -->
    <div class="linha">
      <span class="label">Frete</span>
      <span>{{ frete > 0 ? formatarPreco(frete) : 'Grátis' }}</span>
    </div>
    <hr>

    <!-- Cupom -->
    <div class="linha linha-col">
      <span class="label">Cupom de Desconto</span>
      <div class="cupom-box">
        <input
          v-model="cupomDigitado"
          type="text"
          class="input-cupom"
          placeholder="Digite o cupom"
          @keyup.enter="aplicarCupom"
        />
        <button class="btn-cupom" @click="aplicarCupom">Aplicar</button>
      </div>
      <span
        v-if="msgCupom"
        class="msg-cupom"
        :class="cupomValido ? 'ok' : 'erro'"
      >{{ msgCupom }}</span>
    </div>

    <div v-if="descontoCupom > 0" class="linha linha-desconto">
      <span class="label">Desconto Cupom</span>
      <span class="valor-desconto">– {{ formatarPreco(descontoCupom) }}</span>
    </div>

    <hr>

    <!-- Total -->
    <div class="linha linha-total">
      <span class="label-total">TOTAL</span>
      <span class="valor-total">{{ formatarPreco(totalFinal) }}</span>
    </div>

    <hr>

    <!-- Botões -->
    <button class="btn-confirmar" @click="confirmar">
      CONFIRMAR PAGAMENTO
    </button>
    <router-link :to="{ name: 'EnderecoEntrega' }">
      <button class="btn-voltar">VOLTAR PARA ENTREGA</button>
    </router-link>
  </div>
</template>

<style scoped>
.resumo-wrap {
  font-family: var(--font-family-base);
}

.titulo-resumo {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1rem;
}

/* Linhas */
.linha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: .75rem 0;
  font-size: .93rem;
}
.linha-col {
  flex-direction: column;
  align-items: flex-start;
  gap: .45rem;
}
.linha-desconto {
  color: #1a6b2a;
  font-size: .88rem;
}
.linha-total {
  padding: .5rem .6rem;
  background: var(--color-bg-pale);
  border-radius: 6px;
  margin: .8rem 0;
}

.label {
  font-weight: 500;
  color: var(--color-muted);
  font-size: .88rem;
}
.label-total {
  font-weight: 700;
  font-size: .95rem;
}
.valor-total {
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--color-primary);
}
.valor-desconto {
  font-weight: 600;
}

/* Cupom */
.cupom-box {
  display: flex;
  gap: 8px;
  width: 100%;
}
.input-cupom {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid var(--color-border-input);
  border-radius: 6px;
  font-size: .85rem;
  font-family: var(--font-family-base);
}
.input-cupom:focus { outline: 2px solid var(--color-primary); border-color: transparent; }

.btn-cupom {
  padding: 7px 14px;
  background: var(--color-primary);
  border: none;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: .82rem;
  white-space: nowrap;
  transition: background .15s;
}
.btn-cupom:hover { background: var(--color-primary-hover); }

.msg-cupom {
  font-size: .8rem;
  margin-top: .1rem;
}
.msg-cupom.ok   { color: #1a6b2a; }
.msg-cupom.erro { color: var(--color-error); }

/* Botões de ação */
.btn-confirmar {
  width: 100%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: .95rem;
  font-size: .95rem;
  font-weight: 700;
  margin-top: .8rem;
  cursor: pointer;
  transition: background .15s, transform .1s;
  font-family: var(--font-family-base);
}
.btn-confirmar:hover {
  background: var(--color-primary-hover);
  transform: scale(1.02);
}

.btn-voltar {
  width: 100%;
  background: #fff;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  padding: .9rem;
  font-size: .92rem;
  font-weight: 700;
  margin-top: .5rem;
  cursor: pointer;
  transition: transform .1s;
  font-family: var(--font-family-base);
}
.btn-voltar:hover { transform: scale(1.02); }

a { text-decoration: none; color: inherit; }

hr {
  border: none;
  border-top: 1px solid var(--color-bg-light);
  margin: .4rem 0;
}
</style>
