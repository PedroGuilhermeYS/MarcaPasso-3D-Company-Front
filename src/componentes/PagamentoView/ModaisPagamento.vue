<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEncomendasStore } from '@/stores/useEncomendasStore'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'
import pixImg from '@/img/meupix.png'

// ── Props ─────────────────────────────────────────────────
const props = defineProps({
  formaPagamento: { type: String, default: null },   // "pix" | "cartao"
  dadosFinanceiros: { type: Object, default: null },  // {subtotal, frete, desconto, descontoCupom, total}
})

const emit = defineEmits(['fechar'])

// ── Stores / router ───────────────────────────────────────
const router = useRouter()
const carrinho = useCarrinhoStore()
const authStore = useAuthStore()
const encomendasStore = useEncomendasStore()

// ── Estado interno ────────────────────────────────────────
const enviando = ref(false)
const erroMsg = ref('')

// Cartão
const cartao = ref({
  nome: '',
  numero: '',
  validade: '',
  cvv: '',
  cpf: '',
  parcelas: '1',
})

// ── Parcelas disponíveis ──────────────────────────────────
const parcelasDisponiveis = computed(() => {
  const total = props.dadosFinanceiros?.total ?? 0
  const opcoes = []
  for (let i = 1; i <= 12; i++) {
    opcoes.push({
      valor: String(i),
      label: i === 1
        ? `1x de ${formatarPreco(total)} (sem juros)`
        : `${i}x de ${formatarPreco(total / i)} (sem juros)`,
    })
  }
  return opcoes
})

// ── Detecção de bandeira pelo BIN ─────────────────────────
const bandeiraCartao = computed(() => {
  const num = cartao.value.numero.replace(/\D/g, '')
  if (!num) return ''
  if (/^4/.test(num))           return 'Visa'
  if (/^5[1-5]/.test(num))      return 'Mastercard'
  if (/^3[47]/.test(num))       return 'Amex'
  if (/^(6011|622|64|65)/.test(num)) return 'Elo'
  if (/^(384|606282)/.test(num))     return 'Hipercard'
  return 'Outro'
})

const binCartao = computed(() =>
  cartao.value.numero.replace(/\D/g, '').slice(0, 6)
)

// ── Formatação: número do cartão com espaços ──────────────
function formatarNumeroCartao(event) {
  let v = event.target.value.replace(/\D/g, '').slice(0, 16)
  cartao.value.numero = v.replace(/(.{4})/g, '$1 ').trim()
}

// ── Formatação: validade MM/AA ────────────────────────────
function formatarValidade(event) {
  let v = event.target.value.replace(/\D/g, '').slice(0, 4)
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
  cartao.value.validade = v
}

// ── Construção do payload de encomenda ────────────────────
function construirPayload(extra = {}) {
  const usuario = authStore.usuario
  const end = carrinho.enderecoSelecionado ?? {}

  return {
    // Itens do carrinho
    itens: carrinho.itens.map(item => ({
      idProduto: Number(item.idProduto ?? item.id),
      quantidade: item.quantidade,
      precoUnitario: Number(item.preco),
    })),

    // Valores
    subtotal: props.dadosFinanceiros?.subtotal ?? 0,
    frete: props.dadosFinanceiros?.frete ?? 0,
    desconto: props.dadosFinanceiros?.desconto ?? 0,
    descontoCupom: props.dadosFinanceiros?.descontoCupom ?? 0,
    total: props.dadosFinanceiros?.total ?? 0,

    // Endereço (snapshot)
    endRua: end.rua ?? '',
    endNumero: end.numero ?? '',
    endComplemento: end.complemento ?? '',
    endBairro: end.bairro ?? '',
    endCidade: end.cidade ?? '',
    endEstado: end.estado ?? '',
    endCep: end.cep ?? '',

    // Cliente (snapshot)
    clienteNome: usuario?.nome ?? '',
    clienteEmail: usuario?.email ?? '',
    clienteCpf: usuario?.cpf ?? '',

    ...extra,
  }
}

// ── CONFIRMAR PIX ─────────────────────────────────────────
async function confirmarPix() {
  erroMsg.value = ''
  enviando.value = true
  try {
    const payload = construirPayload({
      formaPagamento: 'pix',
      tipoPagamento: 'pix',
    })

    const encomenda = await encomendasStore.adicionarEncomenda(payload)
    await carrinho.limparCarrinho()
    router.push({ name: 'Encomendas' })
  } catch (err) {
    erroMsg.value = 'Erro ao processar pagamento. Tente novamente.'
  } finally {
    enviando.value = false
  }
}

// ── CONFIRMAR CARTÃO ──────────────────────────────────────
function validarCartao() {
  const num = cartao.value.numero.replace(/\D/g, '')
  if (!cartao.value.nome.trim())       return 'Informe o nome do titular.'
  if (num.length < 16)                 return 'Número do cartão inválido.'
  if (!/^\d{2}\/\d{2}$/.test(cartao.value.validade)) return 'Validade inválida. Use MM/AA.'
  if (cartao.value.cvv.length < 3)     return 'CVV inválido.'
  if (!cartao.value.cpf.trim())        return 'Informe o CPF do titular.'
  return null
}

async function confirmarCartao() {
  erroMsg.value = ''
  const erro = validarCartao()
  if (erro) { erroMsg.value = erro; return }

  enviando.value = true
  try {
    const payload = construirPayload({
      formaPagamento: 'cartao',
      tipoPagamento: 'crédito',
      bandeiraCartao: bandeiraCartao.value,
      parcelamento: `${cartao.value.parcelas}x sem juros`,
      titularCartao: cartao.value.nome.toUpperCase(),
      cpfTitular: cartao.value.cpf,
      binCartao: binCartao.value,
    })

    await encomendasStore.adicionarEncomenda(payload)
    await carrinho.limparCarrinho()
    router.push({ name: 'Encomendas' })
  } catch (err) {
    erroMsg.value = 'Erro ao processar pagamento. Tente novamente.'
  } finally {
    enviando.value = false
  }
}

function fechar() { emit('fechar') }
</script>

<template>
  <!-- ═══════════════════════════════════════════════════════ -->
  <!--  MODAL PIX                                              -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div v-if="formaPagamento === 'pix'" class="fundo-modal">
    <div class="modal">
      <div class="modal-header">
        <h2>PAGAMENTO VIA PIX</h2>
        <button class="btn-x" @click="fechar">✕</button>
      </div>

      <!-- Total -->
      <div class="total-destaque">
        <span class="total-label">Total a pagar</span>
        <span class="total-valor">{{ formatarPreco(dadosFinanceiros?.total ?? 0) }}</span>
      </div>

      <p class="instrucao">Escaneie o QR Code abaixo com o app do seu banco:</p>
      <img :src="pixImg" alt="QR Code PIX" class="qrcode" />

      <p class="chave-pix">Chave PIX: <strong>Pedro Guilherme — PicPay</strong></p>

      <p class="aviso-pix">
        Após escanear, clique em <strong>"Confirmar Pagamento"</strong>.
        Seu pedido será registrado automaticamente.
      </p>

      <div v-if="erroMsg" class="msg-erro">{{ erroMsg }}</div>

      <div class="modal-botoes">
        <button class="btn-fechar-modal" @click="fechar" :disabled="enviando">Fechar</button>
        <button class="btn-confirmar-modal" @click="confirmarPix" :disabled="enviando">
          <span v-if="enviando" class="spinner-inline"></span>
          {{ enviando ? 'Processando...' : 'Confirmar Pagamento' }}
        </button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!--  MODAL CARTÃO DE CRÉDITO                               -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div v-if="formaPagamento === 'cartao'" class="fundo-modal">
    <div class="modal modal-cartao">
      <div class="modal-header">
        <h2>CARTÃO DE CRÉDITO</h2>
        <button class="btn-x" @click="fechar">✕</button>
      </div>

      <!-- Total -->
      <div class="total-destaque">
        <span class="total-label">Total a pagar</span>
        <span class="total-valor">{{ formatarPreco(dadosFinanceiros?.total ?? 0) }}</span>
      </div>

      <!-- Bandeira detectada -->
      <div v-if="bandeiraCartao" class="bandeira-pill">
        💳 {{ bandeiraCartao }}
      </div>

      <form @submit.prevent="confirmarCartao" novalidate>

        <!-- Nome no cartão -->
        <div class="campo-form">
          <label>Nome impresso no cartão</label>
          <input
            v-model="cartao.nome"
            type="text"
            placeholder="NOME COMO NO CARTÃO"
            maxlength="30"
            style="text-transform: uppercase"
            required
          />
        </div>

        <!-- Número do cartão -->
        <div class="campo-form">
          <label>Número do cartão</label>
          <input
            :value="cartao.numero"
            @input="formatarNumeroCartao"
            type="text"
            placeholder="0000 0000 0000 0000"
            maxlength="19"
            inputmode="numeric"
            required
          />
        </div>

        <!-- Validade + CVV -->
        <div class="linha-dupla">
          <div class="campo-form">
            <label>Validade</label>
            <input
              :value="cartao.validade"
              @input="formatarValidade"
              type="text"
              placeholder="MM/AA"
              maxlength="5"
              inputmode="numeric"
              required
            />
          </div>
          <div class="campo-form">
            <label>CVV</label>
            <input
              v-model="cartao.cvv"
              type="password"
              placeholder="•••"
              maxlength="4"
              inputmode="numeric"
              required
            />
          </div>
        </div>

        <!-- CPF do titular -->
        <div class="campo-form">
          <label>CPF do titular</label>
          <input
            v-model="cartao.cpf"
            type="text"
            placeholder="000.000.000-00"
            maxlength="14"
            inputmode="numeric"
            required
          />
        </div>

        <!-- Parcelamento -->
        <div class="campo-form">
          <label>Parcelamento</label>
          <select v-model="cartao.parcelas" class="select-parcelas">
            <option
              v-for="op in parcelasDisponiveis"
              :key="op.valor"
              :value="op.valor"
            >{{ op.label }}</option>
          </select>
        </div>

        <!-- Erro -->
        <div v-if="erroMsg" class="msg-erro">{{ erroMsg }}</div>

        <div class="modal-botoes">
          <button type="button" class="btn-fechar-modal" @click="fechar" :disabled="enviando">
            Cancelar
          </button>
          <button type="submit" class="btn-confirmar-modal" :disabled="enviando">
            <span v-if="enviando" class="spinner-inline"></span>
            {{ enviando ? 'Processando...' : 'Confirmar Pagamento' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped>
/* ── Fundo ────────────────────────────────────────────── */
.fundo-modal {
  position: fixed;
  inset: 0;
  background: var(--color-overlay-modal);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
}

/* ── Modal ────────────────────────────────────────────── */
.modal {
  width: 400px;
  max-width: 95vw;
  background: #fff;
  padding: 28px 26px;
  border-radius: 16px;
  animation: subir .22s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-cartao {
  width: 440px;
}

@keyframes subir {
  from { transform: translateY(28px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* ── Header ───────────────────────────────────────────── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.modal-header h2 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
}
.btn-x {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--color-muted);
  padding: 0;
  line-height: 1;
}
.btn-x:hover { color: var(--color-error); }

/* ── Total destaque ───────────────────────────────────── */
.total-destaque {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #eaf4ff;
  border-radius: 8px;
  padding: .65rem 1rem;
  margin-bottom: 1rem;
}
.total-label {
  font-size: .82rem;
  font-weight: 600;
  color: var(--color-muted);
}
.total-valor {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-primary);
}

/* ── QR Code PIX ──────────────────────────────────────── */
.instrucao {
  font-size: .85rem;
  color: var(--color-muted);
  text-align: center;
  margin: .6rem 0 .4rem;
}
.qrcode {
  width: 190px;
  height: 190px;
  margin: 0 auto 1rem;
  display: block;
  border-radius: 8px;
}
.chave-pix {
  text-align: center;
  font-size: .82rem;
  color: var(--color-muted);
  margin-bottom: .6rem;
}
.aviso-pix {
  font-size: .8rem;
  color: var(--color-muted);
  background: #fffbe6;
  border-left: 3px solid #f0c040;
  padding: .5rem .8rem;
  border-radius: 4px;
  margin-bottom: .8rem;
}

/* ── Bandeira ─────────────────────────────────────────── */
.bandeira-pill {
  display: inline-block;
  background: #eaf4ff;
  color: var(--color-primary);
  font-size: .78rem;
  font-weight: 700;
  padding: .2rem .65rem;
  border-radius: 999px;
  margin-bottom: .9rem;
}

/* ── Campos do formulário ─────────────────────────────── */
.campo-form {
  text-align: left;
  margin-bottom: .9rem;
}
.campo-form label {
  display: block;
  font-size: .78rem;
  font-weight: 600;
  color: var(--color-muted);
  margin-bottom: .3rem;
}
.campo-form input,
.select-parcelas {
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid var(--color-border-input);
  border-radius: 7px;
  font-size: .88rem;
  font-family: var(--font-family-base);
  box-sizing: border-box;
  transition: border-color .15s;
}
.campo-form input:focus,
.select-parcelas:focus {
  outline: none;
  border-color: var(--color-primary);
}

.linha-dupla {
  display: flex;
  gap: 12px;
}
.linha-dupla .campo-form {
  flex: 1;
}

/* ── Erro ─────────────────────────────────────────────── */
.msg-erro {
  background: #fff0f0;
  border-left: 3px solid var(--color-error);
  color: var(--color-error);
  font-size: .82rem;
  padding: .5rem .8rem;
  border-radius: 4px;
  margin-bottom: .8rem;
}

/* ── Botões ───────────────────────────────────────────── */
.modal-botoes {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}
.btn-fechar-modal {
  flex: 1;
  padding: 10px;
  background: var(--color-bg-subtle);
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 600;
  font-size: .88rem;
  font-family: var(--font-family-base);
  transition: background .15s;
}
.btn-fechar-modal:hover { background: var(--color-bg-light); }

.btn-confirmar-modal {
  flex: 2;
  padding: 10px;
  background: var(--color-primary);
  border: none;
  color: #fff;
  font-weight: 700;
  border-radius: 7px;
  cursor: pointer;
  font-size: .88rem;
  font-family: var(--font-family-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background .15s;
}
.btn-confirmar-modal:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-confirmar-modal:disabled,
.btn-fechar-modal:disabled  { opacity: .6; cursor: not-allowed; }

/* ── Spinner inline ───────────────────────────────────── */
.spinner-inline {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
