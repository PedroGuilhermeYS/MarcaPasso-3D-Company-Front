<script setup>
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'

const props = defineProps({
    ValorFrete: { type: Number, default: null }
})

const carrinho = useCarrinhoStore()

function totalPix() {
    return carrinho.total + (props.ValorFrete || 0)
}

function totalCartao() {
    return totalPix() * 1.05
}
</script>

<template>
    <div class="sum-sticky">
        <div class="sum-card">
            <div class="sum-hd">
                <div class="sum-hd-title">Resumo do pedido</div>
            </div>

            <div class="s-row">
                <span class="s-lbl">Valor dos produtos ({{ carrinho.itens.length }})</span>
                <span class="s-val ok">{{ formatarPreco(carrinho.total) }}</span>
            </div>

            <div class="s-row">
                <span class="s-lbl">Frete</span>
                <span v-if="props.ValorFrete === null" class="s-val">R$ 0,00</span>
                <span v-else class="s-val">{{ formatarPreco(props.ValorFrete) }}</span>
            </div>

            <hr class="s-div">

            <div class="s-total-blk">
                <div class="s-total-lbl">Total</div>
                <div class="s-pix-lbl">à vista no PIX</div>
                <div class="s-pix-val">{{ formatarPreco(totalPix()) }}</div>
            </div>

            <div class="s-or">ou</div>
            <div class="s-card-val">{{ formatarPreco(totalCartao()) }}</div>
            <div class="s-card-det">até 2× de {{ formatarPreco(totalCartao() / 2) }} sem juros no cartão</div>

            <router-link v-if="carrinho.itens.length > 0" :to="{ name: 'EnderecoEntrega' }">
                <button class="btn-checkout">Continuar para entrega →</button>
            </router-link>
            <button v-else class="btn-checkout btn-checkout-disabled">CARRINHO VAZIO!</button>

            <router-link to="/">
                <button class="btn-bk">← Continuar comprando</button>
            </router-link>

            <div class="s-secure">🔒 Pagamento 100% seguro e criptografado</div>
        </div>
    </div>
</template>

<style scoped>
.sum-sticky {
    position: sticky;
    top: 84px;
}

.sum-card {
    background: #fff;
    border: 1px solid #e2e6f0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 28px rgba(17, 71, 152, .14);
}

.sum-hd {
    padding: 18px 22px;
    background: linear-gradient(135deg, #2C18A0, #114798);
    color: #fff;
}

.sum-hd-title {
    font-size: 16px;
    font-weight: 800;
}

.s-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 22px;
}

.s-row+.s-row {
    border-top: 1px solid #f0f2f7;
}

.s-lbl {
    font-size: 13px;
    color: #9aa3bb;
}

.s-val {
    font-size: 13px;
    font-weight: 600;
    color: #2a3050;
}

.s-val.ok {
    color: #049377;
}

.s-div {
    border: none;
    border-top: 2px solid #f0f2f7;
}

.s-total-blk {
    padding: 18px 22px;
}

.s-total-lbl {
    font-size: 14px;
    font-weight: 700;
    color: #2a3050;
    margin-bottom: 14px;
}

.s-pix-lbl {
    font-size: 11px;
    color: #9aa3bb;
    margin-bottom: 3px;
}

.s-pix-val {
    font-size: 30px;
    font-weight: 800;
    color: #049377;
}

.s-or {
    text-align: center;
    font-size: 12px;
    color: #c8cedc;
    padding: 10px 0;
}

.s-card-val {
    font-size: 14px;
    color: #6e7a99;
    font-weight: 500;
    padding: 0 22px;
}

.s-card-det {
    font-size: 11px;
    color: #9aa3bb;
    padding: 4px 22px 18px;
}

.btn-checkout {
    display: block;
    margin: 0 22px 10px;
    padding: 15px;
    background: linear-gradient(135deg, #2C18A0, #114798);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 800;
    text-align: center;
    width: calc(100% - 44px);
    cursor: pointer;
    font-family: inherit;
}

.btn-checkout:hover {
    opacity: .9;
    transform: scale(1.01);
}

.btn-checkout-disabled {
    background: #c8cedc;
    cursor: not-allowed;
}

.btn-checkout-disabled:hover {
    transform: none;
    opacity: 1;
}

.btn-bk {
    display: block;
    margin: 0 22px 18px;
    padding: 11px;
    background: none;
    color: #6e7a99;
    border: 1.5px solid #e2e6f0;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    width: calc(100% - 44px);
    cursor: pointer;
    font-family: inherit;
}

.btn-bk:hover {
    border-color: #114798;
    color: #114798;
}

.s-secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 22px 18px;
    font-size: 11.5px;
    color: #9aa3bb;
}

a {
    text-decoration: none;
}
</style>
