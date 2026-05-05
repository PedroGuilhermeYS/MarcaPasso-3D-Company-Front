<script setup>
import { ref, onMounted } from 'vue'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'

const carrinho = useCarrinhoStore()

const selecionado = ref(carrinho.formaPagamento || null)

const cartao = ref({
  numero: '',
  nome: '',
  validade: '',
  cvv: '',
  parcelas: '1'
})

function selecionar(metodo) {
  selecionado.value = metodo
  carrinho.definirFormaPagamento(metodo)
}

function formatarNumero(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16)
  cartao.value.numero = v.replace(/(.{4})/g, '$1 ').trim()
}

function formatarValidade(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
  cartao.value.validade = v
}

onMounted(() => {
  selecionado.value = carrinho.formaPagamento || null
})
</script>

<template>
  <div class="sec">
    <div class="sec-hd">
      <div class="sec-hd-left">
        <div class="sec-icon">
          <span class="material-symbols-outlined icon">payments</span>
        </div>
        <span class="sec-title">Forma de Pagamento</span>
      </div>
    </div>

    <div class="sec-body">
      <div class="payment-list">

        <div
          class="payment-opt"
          :class="{ sel: selecionado === 'pix' }"
          @click="selecionar('pix')"
        >
          <div class="radio">
            <div class="radio-dot" :class="{ active: selecionado === 'pix' }"></div>
          </div>

          <div class="payment-icon-wrap pix">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M11.354 2.646a.9.9 0 0 1 1.292 0l2.122 2.122a3.6 3.6 0 0 0 2.546 1.055h.436a.9.9 0 0 1 .9.9v.436a3.6 3.6 0 0 0 1.055 2.546l2.121 2.122a.9.9 0 0 1 0 1.292l-2.121 2.122a3.6 3.6 0 0 0-1.055 2.546v.436a.9.9 0 0 1-.9.9h-.436a3.6 3.6 0 0 0-2.546 1.055l-2.122 2.121a.9.9 0 0 1-1.292 0l-2.122-2.121A3.6 3.6 0 0 0 6.686 19.8H6.25a.9.9 0 0 1-.9-.9v-.436a3.6 3.6 0 0 0-1.055-2.546L2.174 13.796a.9.9 0 0 1 0-1.292l2.121-2.122A3.6 3.6 0 0 0 5.35 7.836V7.4a.9.9 0 0 1 .9-.9h.436A3.6 3.6 0 0 0 9.232 5.445z" />
            </svg>
          </div>

          <div class="payment-info">
            <div class="payment-nome">Pix</div>
            <div class="payment-desc">Aprovação imediata · 5% de desconto</div>
          </div>

          <div class="payment-badge pix-badge">5% OFF</div>
        </div>

        <div
          class="payment-opt"
          :class="{ sel: selecionado === 'cartao' }"
          @click="selecionar('cartao')"
        >
          <div class="radio">
            <div class="radio-dot" :class="{ active: selecionado === 'cartao' }"></div>
          </div>

          <div class="payment-icon-wrap cartao">
            <span class="material-symbols-outlined">credit_card</span>
          </div>

          <div class="payment-info">
            <div class="payment-nome">Cartão de Crédito</div>
            <div class="payment-desc">Em até 2x sem juros</div>
          </div>
        </div>

        <div class="cartao-form" :class="{ visible: selecionado === 'cartao' }">
          <div class="form-row">
            <div class="form-group full">
              <label>Número do cartão</label>
              <input
                v-model="cartao.numero"
                type="text"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                @input="formatarNumero"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full">
              <label>Nome no cartão</label>
              <input
                v-model="cartao.nome"
                type="text"
                placeholder="Como está no cartão"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Validade</label>
              <input
                v-model="cartao.validade"
                type="text"
                placeholder="MM/AA"
                maxlength="5"
                @input="formatarValidade"
              />
            </div>

            <div class="form-group">
              <label>CVV</label>
              <input
                v-model="cartao.cvv"
                type="text"
                placeholder="123"
                maxlength="3"
              />
            </div>

            <div class="form-group">
              <label>Parcelas</label>
              <select v-model="cartao.parcelas">
                <option value="1">1x sem juros</option>
                <option value="2">2x sem juros</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.sec {
  background: #fff;
  height: 16rem;
  border: 1px solid #e4e9f2;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 8px rgba(17, 71, 152, .08);
}

.sec-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  border-bottom: 1px solid #eef1f8;
}

.sec-hd-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sec-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2C18A0, #114798);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sec-icon .icon {
  font-size: 18px;
  color: #fff;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.sec-title {
  font-family: 'Source Sans 3', var(--font-family-base), sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #141824;
}

.sec-body {
  padding: 20px 22px;
}

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-opt {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border: 1.5px solid #d6dcea;
  border-radius: 10px;
  cursor: pointer;
  transition: all .18s;
  background: #fff;
}

.payment-opt:hover {
  border-color: #114798;
  background: #f4f7ff;
}

.payment-opt.sel {
  border-color: #114798;
  background: #f0f4ff;
  box-shadow: 0 0 0 3px rgba(17, 71, 152, .08);
}

.radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #b8c1d8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color .18s;
}

.payment-opt.sel .radio {
  border-color: #114798;
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #114798;
  opacity: 0;
  transition: opacity .18s;
}

.payment-opt.sel .radio-dot {
  opacity: 1;
}

.payment-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.payment-icon-wrap.pix {
  background: #e6f9f4;
  color: #00b894;
}

.payment-icon-wrap.cartao {
  background: #eef1ff;
  color: #114798;
}

.payment-icon-wrap .material-symbols-outlined {
  font-size: 20px;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.payment-nome {
  font-size: 14px;
  font-weight: 700;
  color: #141824;
}

.payment-desc {
  font-size: 12px;
  color: #6b7a9a;
}

.payment-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
}

.pix-badge {
  background: #e6f9f4;
  color: #00b894;
}

/* Formulário do cartão */
.cartao-form {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows .3s ease, opacity .3s ease;
  overflow: hidden;
}

.cartao-form.visible {
  grid-template-rows: 1fr;
  opacity: 1;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.form-group.full {
  flex: 1;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7a9a;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1.5px solid #d6dcea;
  border-radius: 8px;
  font-size: 14px;
  color: #141824;
  outline: none;
  transition: border-color .18s;
  background: #fff;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #114798;
}
</style>