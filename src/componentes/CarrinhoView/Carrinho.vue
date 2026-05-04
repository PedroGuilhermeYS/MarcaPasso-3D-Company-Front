<script setup>
    import { ref, computed, onMounted, onUnmounted } from 'vue'
    import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
    import { formatarPreco } from '@/composables/useFormatadorPreco.js'

    const props = defineProps({
        ValorFrete: { type: Number, default: null },
        DiaEntrega: { type: String, default: '' },
        cidade: { type: String, default: '' }
    })

    const carrinho = useCarrinhoStore()
    const cepatual = ref('')
</script>

<template>
    <div class="ct-left">

        <div class="ct-card">
            <div class="ct-card-hd">
                <div class="ct-card-title">
                    Produto e serviço
                    <span class="ct-count">{{ carrinho.itens.length }} {{ carrinho.itens.length === 1 ? 'item' : 'itens' }}</span>
                </div>
                <button class="btn-rm-all" @click="carrinho.itens.forEach(i => carrinho.removerItem(i.id))">
                    <svg width="13" height="13" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    Remover todos
                </button>
            </div>

            <div v-if="carrinho.itens.length === 0" class="ct-empty">
                <svg width="48" height="48" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <p>Seu carrinho está vazio</p>
            </div>

            <div v-for="item in carrinho.itens" :key="item.id">
                <div class="sold-by">Vendido e entregue por: <strong>MarcaPasso Official</strong></div>
                <div class="ct-item">
                    <div class="ct-img" @click="$router.push({ name: 'Produto', params: { id: item.id } })">
                        <img v-if="item.imagem" :src="item.imagem" :alt="item.nome">
                        <svg v-else viewBox="0 0 24 24"><polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/><line x1="12" y1="22" x2="12" y2="11.5"/><polyline points="22 6.5 12 11.5 2 6.5"/></svg>
                    </div>
                    <div class="ct-info">
                        <div class="ct-name">{{ item.nome }}</div>
                        <div class="ct-sku">ID: {{ item.idProduto }}</div>
                        <div class="ct-tags">
                            <span class="ct-tag ct-tag-g">✦ Frete grátis</span>
                            <span class="ct-tag ct-tag-i">Personalizável</span>
                        </div>
                    </div>
                    <div class="ct-right">
                        <div class="ct-price-pix">{{ formatarPreco(item.preco * item.quantidade) }}</div>
                        <div class="ct-price-card">{{ formatarPreco((item.preco * item.quantidade) * 1.05) }} no cartão</div>
                        <div class="ct-qty-row">
                            <button class="ct-qty-btn" @click="carrinho.alterarQuantidade(item.id, item.quantidade - 1)">−</button>
                            <span class="ct-qty-n">{{ item.quantidade }}</span>
                            <button class="ct-qty-btn" @click="carrinho.alterarQuantidade(item.id, item.quantidade + 1)">+</button>
                            <button class="ct-trash" @click="carrinho.removerItem(item.id)">🗑</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="extras-card">
            <div class="extras-sec">
                <div class="extras-lbl">
                    <svg width="14" height="14" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Calcular frete e prazo
                </div>
                <div class="extras-row">
                    <input v-model="cepatual" class="extras-in" type="text" placeholder="00000-000" maxlength="9">
                    <button class="btn-apply" @click="calcularFrete">Calcular</button>
                </div>
                <div v-if="props.DiaEntrega" class="frete-resultado">
                    🚚 Entrega{{ props.cidade }}: <strong>{{ props.DiaEntrega }}</strong>
                </div>
                <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" class="cep-help">? Não sei meu CEP</a>
            </div>

        </div>
    </div>
</template>

<style scoped>
    .timer-bar {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 18px;
        border-radius: 10px;
        margin-bottom: 18px;
        font-size: 13px;
        font-weight: 500;
        border: 1.5px solid;
        transition: all .6s;
    }
    .timer-bar.grn { background: #e8f8f4; border-color: #a8e6d8; color: #037a64; }
    .timer-bar.amb { background: #fff8ee; border-color: #fcd89c; color: #9a6400; }
    .timer-bar.red { background: #fff0f0; border-color: #ffbdbd; color: #d63031; }
    .timer-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .timer-bar.grn .timer-dot { background: #049377; }
    .timer-bar.amb .timer-dot { background: #e6920a; }
    .timer-bar.red .timer-dot { background: #d63031; }
    .timer-val { font-weight: 800; font-size: 20px; margin-left: auto; font-variant-numeric: tabular-nums; }

    .ct-card {
        background: #fff;
        border: 1px solid #e2e6f0;
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 16px;
        box-shadow: 0 2px 12px rgba(17,71,152,.09);
    }
    .ct-card-hd {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 22px;
        border-bottom: 1px solid #f0f2f7;
    }
    .ct-card-title {
        font-size: 15px;
        font-weight: 700;
        color: #181e33;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .ct-count {
        background: #f0f2f7;
        color: #6e7a99;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 10px;
        border-radius: 20px;
    }
    .btn-rm-all {
        background: none;
        border: 1.5px solid #d63031;
        color: #d63031;
        padding: 7px 15px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-family: inherit;
    }
    .btn-rm-all:hover { background: #d63031; color: #fff; }
    .btn-rm-all svg { stroke: currentColor; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

    .ct-empty {
        padding: 48px 22px;
        text-align: center;
        color: #c8cedc;
    }
    .ct-empty svg { margin: 0 auto 12px; stroke: currentColor; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
    .ct-empty p { font-size: 14px; }

    .sold-by { padding: 10px 22px 0; font-size: 12px; color: #9aa3bb; }
    .sold-by strong { color: #114798; font-weight: 600; }

    .ct-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 18px 22px;
        border-bottom: 1px solid #f0f2f7;
    }
    .ct-item:last-child { border-bottom: none; }

    .ct-img {
        width: 76px;
        height: 76px;
        border: 1.5px solid #e2e6f0;
        border-radius: 10px;
        background: #f8f9fc;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        cursor: pointer;
    }
    .ct-img img { width: 100%; height: 100%; object-fit: cover; }
    .ct-img svg { width: 36px; height: 36px; opacity: .3; stroke: #2C18A0; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

    .ct-info { flex: 1; min-width: 0; }
    .ct-name { font-size: 13px; color: #2a3050; line-height: 1.4; margin-bottom: 4px; font-weight: 500; }
    .ct-sku { font-size: 11px; color: #9aa3bb; }
    .ct-tags { display: flex; gap: 6px; margin-top: 7px; flex-wrap: wrap; }
    .ct-tag { font-size: 10px; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
    .ct-tag-g { background: #e4f5ef; color: #037a64; }
    .ct-tag-i { background: #eeeffe; color: #2C18A0; }

    .ct-right { text-align: right; flex-shrink: 0; }
    .ct-price-pix { font-size: 17px; font-weight: 700; color: #049377; }
    .ct-price-card { font-size: 11px; color: #9aa3bb; margin-top: 2px; }
    .ct-qty-row { display: flex; align-items: center; gap: 5px; margin-top: 10px; justify-content: flex-end; }
    .ct-qty-btn {
        width: 29px; height: 29px;
        border: 1.5px solid #e2e6f0;
        background: #f8f9fc;
        border-radius: 8px;
        font-size: 16px;
        display: flex; align-items: center; justify-content: center;
        color: #6e7a99;
        cursor: pointer;
        font-family: inherit;
    }
    .ct-qty-btn:hover { border-color: #114798; color: #114798; }
    .ct-qty-n { font-size: 13px; font-weight: 700; min-width: 24px; text-align: center; }
    .ct-trash { background: none; border: none; color: #c8cedc; font-size: 17px; margin-left: 4px; cursor: pointer; }
    .ct-trash:hover { color: #d63031; }

    .extras-card {
        background: #fff;
        border: 1px solid #e2e6f0;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(17,71,152,.09);
    }
    .extras-sec { padding: 18px 22px; }
    .extras-lbl {
        font-size: 13px;
        font-weight: 600;
        color: #2a3050;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
    }
    .extras-lbl svg { stroke: #049377; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
    .extras-row { display: flex; gap: 8px; }
    .extras-in {
        flex: 1;
        padding: 9px 14px;
        border: 1.5px solid #e2e6f0;
        border-radius: 10px;
        font-size: 13px;
        outline: none;
        color: #2a3050;
        transition: border .2s;
        font-family: inherit;
    }
    .extras-in:focus { border-color: #114798; }
    .btn-apply {
        padding: 10px 20px;
        background: #049377;
        color: #fff;
        border: none;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
        cursor: pointer;
        font-family: inherit;
    }
    .btn-apply:hover { background: #037a64; }
    .frete-resultado { font-size: 13px; color: #037a64; margin-top: 10px; }
    .cep-help { display: block; margin-top: 8px; font-size: 12px; color: #9aa3bb; text-decoration: none; }
    .cep-help:hover { color: #114798; }

    .extras-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 22px;
        cursor: pointer;
        border-top: 1px solid #f0f2f7;
    }
    .extras-toggle:hover { background: #f8f9fc; }
    .extras-toggle-lbl {
        font-size: 13px;
        font-weight: 500;
        color: #2a3050;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .extras-toggle-lbl svg { stroke: #2C18A0; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
    .chev { color: #9aa3bb; font-size: 11px; transition: transform .2s; }
    .chev.open { transform: rotate(180deg); }
    .coll { overflow: hidden; max-height: 0; transition: max-height .25s; }
    .coll.open { max-height: 150px; }
</style>
