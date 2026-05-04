<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
import CartItem from '@/componentes/CarrinhoView/CartItem.vue'
import OrderSummary from '@/componentes/CarrinhoView/OrderSummary.vue'

const router = useRouter()
const carrinhoStore = useCarrinhoStore()

const segundosRestantes = ref(30 * 60 - 1)
let timerId = null

const totalItens = computed(() => carrinhoStore.itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0))

const timerLabel = computed(() => {
    const minutos = Math.floor(segundosRestantes.value / 60)
    const segundos = segundosRestantes.value % 60
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
})

const timerTone = computed(() => {
    const progresso = segundosRestantes.value / (30 * 60)
    if (progresso < 0.15) return 'red'
    if (progresso < 0.4) return 'amb'
    return 'grn'
})

function atualizarQuantidade(payload) {
    carrinhoStore.alterarQuantidade(payload.id, payload.quantidade)
}

function removerItem(id) {
    carrinhoStore.removerItem(id)
}

// navigation for summary moved to OrderSummary component

onMounted(async () => {
    await carrinhoStore.carregarCarrinho()

    timerId = window.setInterval(() => {
        if (segundosRestantes.value > 0) {
            segundosRestantes.value -= 1
        }
    }, 1000)
})

onUnmounted(() => {
    if (timerId) window.clearInterval(timerId)
})
</script>

<template>
    <main class="cart-page">
        <div class="bc">
            <span class="bc-link" @click="router.push({ name: 'Home' })">Home</span>
            <span class="bc-sep">›</span>
            <span class="cur">Carrinho de compras</span>
        </div>

        <div class="ct-wrap">
            <div class="ct-steps">
                <div class="steps-row">
                    <div class="step-it">
                        <div class="step-circ act">1</div>
                        <div class="step-lbl act">Carrinho</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="step-it">
                        <div class="step-circ ina">2</div>
                        <div class="step-lbl ina">Endereço</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="step-it">
                        <div class="step-circ ina">3</div>
                        <div class="step-lbl ina">Entrega</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="step-it">
                        <div class="step-circ ina">4</div>
                        <div class="step-lbl ina">Pagamento</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="step-it">
                        <div class="step-circ ina">5</div>
                        <div class="step-lbl ina">Concluir</div>
                    </div>
                </div>
            </div>

            <section class="ct-left">
                <div class="timer-bar" :class="timerTone">
                    <div class="timer-dot"></div>
                    <span>Reserve seus itens - finalize antes que esgotem!</span>
                    <span class="timer-val">{{ timerLabel }}</span>
                </div>

                <div class="ct-card">
                    <div class="ct-card-hd">
                        <div class="ct-card-title">
                            Produto e serviço
                            <span class="ct-count">{{ totalItens }} itens</span>
                        </div>
                        <button class="btn-rm-all" type="button" @click="carrinhoStore.limparCarrinho()">
                            <svg width="13" height="13" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                            Remover todos
                        </button>
                    </div>

                    <div v-if="carrinhoStore.itens.length" class="ct-items">
                        <div class="sold-by">Vendido e entregue por: <strong>MarcaPasso Official</strong></div>
                        <CartItem
                            v-for="item in carrinhoStore.itens"
                            :key="item.id"
                            :item="item"
                            @updateQuantity="atualizarQuantidade"
                            @removeItem="removerItem"
                        />
                    </div>

                    <div v-else class="ct-empty">
                        <div class="ct-empty-title">Seu carrinho está vazio</div>
                        <div class="ct-empty-text">Adicione produtos para continuar a compra.</div>
                        <button class="btn-checkout btn-empty" type="button" @click="router.push({ name: 'Home' })">Ir para a loja</button>
                    </div>
                </div>

                <div class="extras-card">
                    <div class="extras-sec">
                        <div class="extras-lbl">
                            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            Calcular frete e prazo
                        </div>
                        <div class="extras-row">
                            <input class="extras-in" type="text" placeholder="00000-000" maxlength="9">
                            <button class="btn-apply" type="button">Calcular</button>
                        </div>
                    </div>

                    <div class="extras-toggle">
                        <div class="extras-toggle-lbl">
                            <svg width="14" height="14" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            Cupom de desconto
                        </div>
                        <span class="chev">▼</span>
                    </div>

                    <div class="coll open">
                        <div class="extras-sec extras-sec-topless">
                            <div class="extras-row">
                                <input class="extras-in" type="text" placeholder="Digite o código do cupom">
                                <button class="btn-apply" type="button">Aplicar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <OrderSummary />
        </div>
    </main>
</template>

<style scoped>
main {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 28px 60px;
    font-family: var(--font-family-base);
    font-weight: 300;
}

.bc {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 14px 0 18px;
    font-size: 13px;
    color: var(--color-g400);
}

.bc-link {
    cursor: pointer;
}

.bc-link:hover {
    color: var(--color-brand-blue);
}

.cur {
    color: var(--color-g800);
    font-weight: 500;
}

.bc-sep {
    color: var(--color-g300);
}

.ct-wrap {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 24px;
    align-items: start;
}

.ct-steps {
    grid-column: 1 / -1;
    background: #fff;
    border: 1px solid var(--color-g200);
    border-radius: var(--radius);
    padding: 22px 32px;
    box-shadow: 0 2px 12px rgba(17, 71, 152, 0.09);
}

.steps-row {
    display: flex;
    align-items: flex-start;
}

.step-it {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
}

.step-circ {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    font-family: var(--font-family-head);
}

.step-circ.act {
    background: linear-gradient(135deg, var(--color-brand-indigo), var(--color-brand-blue));
    color: #fff;
    box-shadow: 0 4px 12px rgba(44, 24, 160, 0.3);
}

.step-circ.ina {
    background: var(--color-g100);
    color: var(--color-g400);
    border: 1.5px solid var(--color-g200);
}

.step-lbl {
    font-size: 11px;
    font-weight: 600;
    text-align: center;
}

.step-lbl.act {
    color: var(--color-brand-blue);
}

.step-lbl.ina {
    color: var(--color-g400);
}

.step-line {
    flex: 1;
    height: 2px;
    background: var(--color-g200);
    align-self: flex-start;
    margin-top: 17px;
}

.ct-left {
    min-width: 0;
}

.timer-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 18px;
    border-radius: var(--radius);
    margin-bottom: 18px;
    font-size: 13px;
    font-weight: 500;
    border: 1.5px solid;
    transition: all 0.6s;
}

.timer-bar.grn {
    background: #e8f8f4;
    border-color: #a8e6d8;
    color: var(--color-brand-green-d);
}

.timer-bar.amb {
    background: #fff8ee;
    border-color: #fcd89c;
    color: #9a6400;
}

.timer-bar.red {
    background: #fff0f0;
    border-color: #ffbdbd;
    color: var(--color-danger);
}

.timer-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.timer-bar.grn .timer-dot {
    background: var(--color-brand-green);
}

.timer-bar.amb .timer-dot {
    background: #e6920a;
}

.timer-bar.red .timer-dot {
    background: var(--color-danger);
}

.timer-val {
    font-family: var(--font-family-head);
    font-weight: 800;
    font-size: 20px;
    margin-left: auto;
    font-variant-numeric: tabular-nums;
}

.ct-card,
.sum-card,
.extras-card {
    background: #fff;
    border: 1px solid var(--color-g200);
    border-radius: var(--radius);
    box-shadow: 0 2px 12px rgba(17, 71, 152, 0.09);
}

.ct-card {
    overflow: hidden;
    margin-bottom: 16px;
}

.ct-card-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 22px;
    border-bottom: 1px solid var(--color-g100);
}

.ct-card-title {
    font-family: var(--font-family-head);
    font-size: 15px;
    font-weight: 700;
    color: var(--color-g900);
    display: flex;
    align-items: center;
    gap: 10px;
}

.ct-count {
    background: var(--color-g100);
    color: var(--color-g500);
    font-size: 11px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 20px;
}

.btn-rm-all {
    background: none;
    border: 1.5px solid var(--color-danger);
    color: var(--color-danger);
    padding: 7px 15px;
    border-radius: var(--radius);
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
}

.btn-rm-all:hover {
    background: var(--color-danger);
    color: #fff;
}

.btn-rm-all svg {
    stroke: currentColor;
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.sold-by {
    padding: 10px 22px 0;
    font-size: 12px;
    color: var(--color-g400);
}

.sold-by strong {
    color: var(--color-brand-blue);
    font-weight: 600;
}

.ct-items {
    display: flex;
    flex-direction: column;
}

.ct-empty {
    padding: 34px 22px 26px;
    text-align: center;
}

.ct-empty-title {
    font-family: var(--font-family-head);
    font-size: 18px;
    font-weight: 800;
    color: var(--color-g900);
    margin-bottom: 8px;
}

.ct-empty-text {
    color: var(--color-g500);
    font-size: 14px;
    margin-bottom: 18px;
}

.btn-empty {
    display: inline-flex;
}

.extras-card {
    overflow: hidden;
}

.extras-sec {
    padding: 18px 22px;
}

.extras-sec-topless {
    padding-top: 0;
}

.extras-lbl {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-g800);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.extras-lbl svg,
.extras-toggle-lbl svg {
    stroke: currentColor;
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.extras-row {
    display: flex;
    gap: 8px;
}

.extras-in {
    flex: 1;
    padding: 9px 14px;
    border: 1.5px solid var(--color-g200);
    border-radius: var(--radius);
    font-size: 13px;
    outline: none;
    color: var(--color-g800);
    transition: border 0.2s;
}

.extras-in:focus {
    border-color: var(--color-brand-blue);
}

.btn-apply {
    padding: 10px 20px;
    background: var(--color-brand-green);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
}

.btn-apply:hover {
    background: var(--color-brand-green-d);
}

.extras-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 22px;
    cursor: pointer;
    border-top: 1px solid var(--color-g100);
}

.extras-toggle:hover {
    background: var(--color-g50);
}

.extras-toggle-lbl {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-g800);
    display: flex;
    align-items: center;
    gap: 8px;
}

.chev {
    color: var(--color-g400);
    font-size: 11px;
}

.coll.open {
    max-height: 150px;
}

.sum-sticky {
    position: sticky;
    top: 24px;
}

.sum-card {
    padding: 22px;
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

.s-lbl {
    color: var(--color-g500);
}

.s-val {
    color: var(--color-g800);
    font-weight: 600;
}

.s-val.ok {
    color: var(--color-brand-green-d);
}

.s-val.off {
    color: var(--color-danger);
}

.s-div {
    border: none;
    border-top: 1px solid var(--color-g100);
    margin: 10px 0 14px;
}

.s-total-blk {
    padding-bottom: 10px;
}

.s-total-lbl {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-g400);
    margin-bottom: 4px;
}

.s-pix-lbl {
    font-size: 11px;
    color: var(--color-g400);
    margin-bottom: 2px;
}

.s-pix-val {
    font-family: var(--font-family-head);
    font-size: 32px;
    font-weight: 800;
    color: var(--color-brand-green);
}

.s-or {
    text-align: center;
    color: var(--color-g400);
    font-size: 12px;
    font-weight: 600;
    margin: 8px 0;
}

.s-card-val {
    font-family: var(--font-family-head);
    font-size: 18px;
    font-weight: 800;
    color: var(--color-g900);
    text-align: center;
}

.s-card-det {
    text-align: center;
    color: var(--color-g500);
    font-size: 12px;
    margin: 4px 0 16px;
}

.btn-checkout,
.btn-bk {
    width: 100%;
    border: none;
    border-radius: var(--radius);
    font-family: var(--font-family-head);
    font-weight: 700;
    font-size: 14px;
    padding: 14px 16px;
}

.btn-checkout {
    background: linear-gradient(135deg, var(--color-brand-indigo), var(--color-brand-blue));
    color: #fff;
    box-shadow: 0 6px 24px rgba(17, 71, 152, 0.18);
}

.btn-checkout:hover {
    opacity: 0.95;
    transform: translateY(-1px);
}

.btn-bk {
    margin-top: 10px;
    background: var(--color-g50);
    color: var(--color-g800);
}

.btn-bk:hover {
    background: var(--color-g100);
}

.s-secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 14px;
    font-size: 12px;
    color: var(--color-brand-green-d);
    font-weight: 500;
    text-align: center;
}

@media (max-width: 1120px) {
    .ct-wrap {
        grid-template-columns: 1fr;
    }

    .sum-sticky {
        position: static;
    }
}

@media (max-width: 768px) {
    main {
        padding: 0 16px 48px;
    }

    .ct-steps {
        padding: 18px 14px;
    }

    .steps-row {
        gap: 8px;
    }

    .step-line {
        margin-top: 15px;
    }

    .ct-card-hd,
    .sold-by,
    .extras-sec,
    .extras-toggle,
    .sum-card {
        padding-left: 16px;
        padding-right: 16px;
    }

    .ct-card-hd {
        align-items: flex-start;
        flex-direction: column;
    }

    .btn-rm-all {
        align-self: flex-end;
    }

    .extras-row {
        flex-direction: column;
    }

    .btn-apply {
        width: 100%;
    }
}
</style>