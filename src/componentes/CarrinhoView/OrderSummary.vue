<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
import { formatarPreco } from '@/composables/useFormatadorPreco'

const router = useRouter()
const carrinhoStore = useCarrinhoStore()

const totalItens = computed(() => carrinhoStore.itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0))
const totalCartao = computed(() => carrinhoStore.total * 1.05)

function continuarEntrega() {
    router.push({ name: 'EnderecoEntrega' })
}

function continuarComprando() {
    router.push({ name: 'Home' })
}
</script>

<template>
    <aside class="sum-sticky">
        <div class="sum-card">
            <div class="sum-hd">
                <div class="sum-hd-title">Resumo do pedido</div>
            </div>

            <div class="s-row">
                <span class="s-lbl">Valor dos produtos ({{ totalItens }})</span>
                <span class="s-val">{{ formatarPreco(carrinhoStore.total) }}</span>
            </div>
            <div class="s-row">
                <span class="s-lbl">Frete</span>
                <span class="s-val ok">A calcular</span>
            </div>
            <div class="s-row">
                <span class="s-lbl">Desconto cupom</span>
                <span class="s-val off">— R$ 0,00</span>
            </div>

            <hr class="s-div">

            <div class="s-total-blk">
                <div class="s-total-lbl">Total</div>
                <div class="s-pix-lbl">à vista no PIX</div>
                <div class="s-pix-val">{{ formatarPreco(carrinhoStore.total) }}</div>
            </div>

            <div class="s-or">ou</div>
            <div class="s-card-val">{{ formatarPreco(totalCartao) }}</div>
            <div class="s-card-det">até 3× de {{ formatarPreco(totalCartao / 3) }} sem juros no cartão</div>

            <button class="btn-checkout" type="button" @click="continuarEntrega">Continuar para entrega →</button>
            <button class="btn-bk" type="button" @click="continuarComprando">← Continuar comprando</button>
            <div class="s-secure">🔒 Pagamento 100% seguro e criptografado</div>
        </div>
    </aside>
</template>

<style scoped>
.sum-sticky {
    position: sticky;
    top: 24px;
}

.sum-card {
    padding: 22px;
    background: #fff;
    border: 1px solid var(--color-g200);
    border-radius: var(--radius);
    box-shadow: 0 2px 12px rgba(17, 71, 152, 0.09);
}

.sum-hd {
    padding-bottom: 14px;
}

.sum-hd-title {
    font-family: var(--font-family-head);
    font-size: 18px;
    font-weight: 800;
    color: var(--color-g900);
}

.s-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 0;
    font-size: 13px;
}

.s-lbl { color: var(--color-g500); }
.s-val { color: var(--color-g800); font-weight: 600; }
.s-val.ok { color: var(--color-brand-green-d); }
.s-val.off { color: var(--color-danger); }

.s-div { border: none; border-top: 1px solid var(--color-g100); margin: 10px 0 14px; }

.s-total-blk { padding-bottom: 10px; }
.s-total-lbl { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-g400); margin-bottom: 4px; }
.s-pix-lbl { font-size: 11px; color: var(--color-g400); margin-bottom: 2px; }
.s-pix-val { font-family: var(--font-family-head); font-size: 32px; font-weight: 800; color: var(--color-brand-green); }

.s-or { text-align: center; color: var(--color-g400); font-size: 12px; font-weight: 600; margin: 8px 0; }

.s-card-val { font-family: var(--font-family-head); font-size: 18px; font-weight: 800; color: var(--color-g900); text-align: center; }
.s-card-det { text-align: center; color: var(--color-g500); font-size: 12px; margin: 4px 0 16px; }

.btn-checkout, .btn-bk {
    width: 100%;
    border: none;
    border-radius: var(--radius);
    font-family: var(--font-family-head);
    font-weight: 700;
    font-size: 14px;
    padding: 14px 16px;
}

.btn-checkout { background: linear-gradient(135deg, var(--color-brand-indigo), var(--color-brand-blue)); color: #fff; box-shadow: 0 6px 24px rgba(17, 71, 152, 0.18); }
.btn-checkout:hover { opacity: 0.95; transform: translateY(-1px); }
.btn-bk { margin-top: 10px; background: var(--color-g50); color: var(--color-g800); }
.btn-bk:hover { background: var(--color-g100); }

.s-secure { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 14px; font-size: 12px; color: var(--color-brand-green-d); font-weight: 500; text-align: center; }

@media (max-width: 1120px) {
    .sum-sticky { position: static; }
}

@media (max-width: 768px) {
    .sum-card { padding-left: 16px; padding-right: 16px; }
}
</style>
