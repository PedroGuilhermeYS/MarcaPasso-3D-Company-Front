<script setup>
import { computed, ref, onMounted } from 'vue'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'
import { useCupomStore } from '@/stores/useCupomStore'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEncomendasStore } from '@/stores/useEncomendasStore'

const router = useRouter()
const carrinho = useCarrinhoStore()
const authStore = useAuthStore()
const encomendasStore = useEncomendasStore()
const cupons = useCupomStore()

// Tabela de frete fixo por CEP
const FRETES_POR_CEP = {
  '55535000': 15,
  '51160220': 20,
}

const ValorFrete = computed(() => {
  const cepEndereco = (carrinho.enderecoSelecionado?.cep ?? '').replace(/\D/g, '')
  if (cepEndereco && FRETES_POR_CEP[cepEndereco] !== undefined) {
    return FRETES_POR_CEP[cepEndereco]
  }
  return carrinho.freteSelecionado
})

const cupomDigitado = ref('')
const percentualDesconto = ref(0)
const msgCupom = ref('')
const cupomValido = ref(false)

const enviando = ref(false)
const erroMsg = ref('')

const totalComDesconto = computed(() => {
  const subtotal = carrinho.total + (ValorFrete.value ?? 0)
  return percentualDesconto.value > 0 ? subtotal * (1 - percentualDesconto.value) : subtotal
})

const totalPrazo = computed(() => {
  const base = totalComDesconto.value * 1.05
  return base
})

const totalVista = computed(() => {
  return totalComDesconto.value
})

const podeContinuar = computed(() => {
  return ValorFrete.value !== null && carrinho.formaPagamento !== null
})

onMounted(async () => {
  await cupons.carregarCupons()
})

function aplicarCupom() {
  const codigo = cupomDigitado.value.trim().toUpperCase()

  // Cupom local fixo
  if (codigo === 'PRIMEIRACOMPRA') {
    percentualDesconto.value = 0.15
    msgCupom.value = 'Cupom aplicado! 15% de desconto no valor final'
    cupomValido.value = true
    return
  }

  const cupom = cupons.cupons.find(c =>
    c.cupom_nome === codigo
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

function montarPayload() {
  const usuario = authStore.usuario
  const end = carrinho.enderecoSelecionado ?? {}

  return {
    itens: carrinho.itens.map(item => ({
      idProduto: Number(item.idProduto ?? item.id),
      quantidade: item.quantidade,
      precoUnitario: Number(item.preco),
    })),
    subtotal: carrinho.total,
    frete: ValorFrete.value ?? 0,
    desconto: percentualDesconto.value > 0 ? (carrinho.total + (ValorFrete.value ?? 0)) * percentualDesconto.value : 0,
    descontoCupom: percentualDesconto.value > 0 ? (carrinho.total + (ValorFrete.value ?? 0)) * percentualDesconto.value : 0,
    total: totalComDesconto.value,

    endRua: end.rua ?? '',
    endNumero: end.numero ?? '',
    endComplemento: end.complemento ?? '',
    endBairro: end.bairro ?? '',
    endCidade: end.cidade ?? '',
    endEstado: end.estado ?? '',
    endCep: end.cep ?? '',

    clienteNome: usuario?.nome ?? '',
    clienteEmail: usuario?.email ?? '',
    clienteCpf: usuario?.cpf ?? '',

    formaPagamento: carrinho.formaPagamento,
    tipoPagamento: carrinho.formaPagamento === 'pix' ? 'pix' : 'crédito',
  }
}

async function salvarFreteNoCarrinho() {
  erroMsg.value = ''

  if (ValorFrete.value === null || ValorFrete.value === undefined) {
    erroMsg.value = 'Selecione um endereço de entrega.'
    return
  }

  if (!carrinho.formaPagamento) {
    erroMsg.value = 'Selecione uma forma de pagamento.'
    return
  }

  enviando.value = true
  try {
    const payload = montarPayload()

    await encomendasStore.adicionarEncomenda(payload)
    await carrinho.limparCarrinho()

    router.push({ name: 'Home' })
  } catch (err) {
    erroMsg.value = 'Erro ao finalizar pedido.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="sum-sticky">
    <div class="sum-card">
      <div class="sum-hd">
        <div class="sum-hd-title">
          <span class="material-symbols-outlined">shopping_cart</span>
          Resumo do pedido
        </div>
      </div>

      <div class="sum-items" v-for="item in carrinho.itens" :key="item.id">
        <div class="sum-item">
          <div class="sum-item-img">
            <img v-if="item.imagem" :src="item.imagem" :alt="item.nome" />
          </div>

          <div class="sum-item-info">
            <div class="sum-item-name">{{ item.nome }}</div>
            <div class="sum-item-qty">Quantidade: {{ item.quantidade }}</div>
            <div class="sum-item-price">{{ formatarPreco(item.preco) }}</div>
          </div>
        </div>
      </div>

      <div class="sum-cupom">
        <span class="cupom-label">Cupom de desconto</span>

        <div class="cupom-box">
          <input
            v-model="cupomDigitado"
            type="text"
            placeholder="Digite o cupom"
            class="input-cupom"
            @keyup.enter="aplicarCupom"
          />

          <button class="btn-cupom" @click="aplicarCupom" type="button">
            Aplicar
          </button>
        </div>

        <span v-if="msgCupom" class="msg-cupom" :class="cupomValido ? 'ok' : 'erro'">
          {{ msgCupom }}
        </span>
      </div>

      <div class="sum-rows">
        <div class="sum-row">
          <span class="sum-row-lbl">Produtos</span>
          <span class="sum-row-val">{{ formatarPreco(carrinho.total) }}</span>
        </div>

        <div class="sum-row">
          <span class="sum-row-lbl">Frete</span>
          <span class="sum-row-val" :class="{ ok: ValorFrete !== null }">
            {{ ValorFrete !== null ? formatarPreco(ValorFrete) : '—' }}
          </span>
        </div>

        <div class="sum-row" v-if="percentualDesconto > 0">
          <span class="sum-row-lbl">Desconto ({{ Math.round(percentualDesconto * 100) }}%)</span>
          <span class="sum-row-val" style="color: #e53935;">
            - {{ formatarPreco((carrinho.total + (ValorFrete ?? 0)) * percentualDesconto) }}
          </span>
        </div>
      </div>

      <div class="sum-total-blk">
        <div class="sum-total-row">
          <span class="sum-total-lbl">
            À vista no <strong>Pix <i class="fa-solid fa-heart" style="color: green;"></i></strong>
          </span>
          <span class="sum-total-val ok">{{ formatarPreco(totalVista) }}</span>
        </div>
      </div>

      <div class="sum-pix-blk">
        <div class="sum-row">
          <span class="sum-row-lbl">Total a prazo</span>
          <span class="sum-row-val pix-val">{{ formatarPreco(totalPrazo) }}</span>
        </div>
        <div class="sum-total-sub">Em até 2× de {{ formatarPreco(totalPrazo / 2) }} sem juros</div>
      </div>

      <div v-if="erroMsg" class="msg-erro">
        {{ erroMsg }}
      </div>

      <div class="sum-footer">
        <button
          class="btn-continuar"
          @click="salvarFreteNoCarrinho"
          :disabled="!podeContinuar || enviando"
          type="button"
        >
          <svg width="15" height="15" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>{{ enviando ? 'Processando...' : 'Finalizar pedido' }}</span>
        </button>

        <router-link :to="{ name: 'Carrinho' }">
          <button class="btn-voltar" type="button">Voltar ao Carrinho</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sum-sticky {
    position: sticky;
    top: 80px;
}

.sum-card {
    background: #fff;
    border: 1px solid #e4e9f2;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(17, 71, 152, .13);
    position: sticky;
    top: 80px;
}

.sum-hd {
    padding: 16px;
    background: linear-gradient(135deg, #2C18A0, #114798);
    color: #fff;
}

.sum-hd-title {
    font-size: 16px;
    font-weight: 800;
}

.sum-hd-title svg {
    opacity: .8;
    stroke: #fff;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
}

.sum-items {
    padding: 16px;
    border-bottom: 1px solid #eee;
}

.sum-item {
    display: flex;
    gap: 12px;
}

.sum-item-img {
    width: 50px;
    height: 50px;
    background: #f5f5f5;
    border-radius: 8px;
}

.sum-item-name {
    font-size: 14px;
}

.sum-item-qty {
    font-size: 12px;
    color: #777;
}

.sum-item-price {
    font-weight: bold;
    color: #049377;
}

.sum-rows {
    padding: 16px 20px;
    border-bottom: 1px solid #eef1f8;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sum-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
}

.sum-row-lbl {
    color: #6b7a9a;
}

.sum-row-val {
    color: #252f4a;
    font-weight: 500;
}

.sum-row-val.ok {
    color: #049377;
}

.sum-total-blk {
    padding: 16px 20px;
    background: #f7f9fc;
    border-bottom: 1px solid #eef1f8;
}

.sum-total-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
}

.sum-total-lbl {
    font-family: 'Source Sans 3', var(--font-family-base), sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #252f4a;
}

.sum-total-val {
    font-family: 'Source Sans 3', var(--font-family-base), sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #252f4a;
}

.sum-total-val.ok {
    color: #049377;
}

.sum-total-sub {
    font-size: 11.5px;
    color: #8f9db8;
    margin-top: 4px;
}

.sum-pix-blk {
    padding: 14px 20px;
    border-bottom: 1px solid #eef1f8;
}

.pix-val {
    font-size: 15px;
    font-weight: 700;
}

.sum-footer {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn-continuar {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #037a64, #049377);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Source Sans 3', var(--font-family-base), sans-serif;
    font-size: 14px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: .03em;
    box-shadow: 0 4px 20px rgba(4, 147, 119, .35);
    cursor: pointer;
    transition: all .2s;
}

.btn-continuar:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(4, 147, 119, .45);
}

.btn-continuar svg {
    stroke: #fff;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
}

.btn-voltar {
    width: 100%;
    padding: 11px;
    background: #fff;
    color: #6b7a9a;
    border: 1.5px solid #d6dcea;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all .18s;
}

.btn-voltar:hover {
    border-color: #114798;
    color: #114798;
}

.sum-cupom {
    padding: 16px 20px;
    border-bottom: 1px solid #eef1f8;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.cupom-label {
    font-size: 13px;
    color: #6b7a9a;
}

.cupom-box {
    display: flex;
    gap: 8px;
}

.input-cupom {
    flex: 1;
    padding: 10px;
    border: 1px solid #d6dcea;
    border-radius: 8px;
    font-size: 13px;
}

.btn-cupom {
    padding: 10px 14px;
    background: #114798;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
}

.msg-cupom {
    font-size: 12px;
}

.msg-cupom.ok {
    color: #049377;
}

.msg-cupom.erro {
    color: #e53935;
}
</style>