<script setup>
import { onMounted, watch } from 'vue'
import { usePesquisaStore } from '@/stores/usePesquisaStore'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const pesquisa = usePesquisaStore()

onMounted(async () => {
    await pesquisa.init()
})

function aplicarModoEntrada() {
  const veioPesquisar = !!pesquisa.termo
  if (!veioPesquisar) {
    pesquisa.limparFiltros()
    pesquisa.setTerm('')
  }
}

watch(
    () => route.fullPath,
    () => {
        aplicarModoEntrada()
    },
    { immediate: true }
)
</script>

<template>
    <div class="catalog-page">
        <div class="page-header">
            <div>
                <h1 class="page-title">Catálogo</h1>
                <p class="page-subtitle">Encontre os produtos com os filtros ao lado.</p>
            </div>
            <div class="header-actions">
                <select class="sort-select" v-model="pesquisa.ordenacaoSelecionada">
                    <option value="">Relevância</option>
                    <option value="az">Nome (A-Z)</option>
                    <option value="menor">Menor preço</option>
                    <option value="maior">Maior preço</option>
                </select>
            </div>
        </div>

        <div class="breadcrumb">
            <span>Home</span>
            <span class="sep"><span class="material-symbols-outlined">chevron_right</span></span>
            <span>Catálogo</span>
        </div>

        <div class="catalog-layout">
            <aside class="filters-card">
                <div class="filters-card-header">Filtros</div>

                <div class="filter-section">
                    <label class="filter-label">Faixa de preço</label>
                    <select class="filter-select" v-model="pesquisa.precoSelecionado">
                        <option value="">Todos os preços</option>
                        <option value="1">Até R$ 50</option>
                        <option value="2">R$ 50 a R$ 100</option>
                        <option value="3">Acima de R$ 100</option>
                    </select>
                </div>

                <div class="filter-section">
                    <label class="filter-label">Categoria</label>
                    <select class="filter-select" v-model="pesquisa.categoriaSelecionada">
                        <option value="">Todas</option>
                        <option value="Decoração">Decoração</option>
                        <option value="Roupas">Roupas</option>
                        <option value="Acessórios">Acessórios</option>
                    </select>
                </div>

                <div class="filter-section">
                    <label class="filter-label">Personalização</label>
                    <select class="filter-select" v-model="pesquisa.personalizavelSelecionado">
                        <option value="">Todas</option>
                        <option value="true">Personalizável</option>
                        <option value="false">Não personalizável</option>
                    </select>
                </div>

                <button class="clear-btn" @click="pesquisa.limparFiltros">
                    Limpar filtros
                </button>
            </aside>

            <section class="products-area">
                <div class="products-top">
                    <div>
                        <h2 class="products-title">Produtos</h2>
                        <p class="products-count">{{ pesquisa.produtosFiltrados.length }} produtos encontrados</p>
                    </div>
                </div>

                <div class="products-grid">
                    <div v-if="pesquisa.produtosFiltrados.length === 0" class="empty">
                        Nenhum produto encontrado
                    </div>

                    <article v-for="p in pesquisa.produtosFiltrados" :key="p.id" class="product-card">
                        <div class="product-image">
                            <img v-if="p.imagemPrincipal" :src="p.imagemPrincipal" :alt="p.nome" />
                            <div v-else class="image-placeholder">Imagem</div>
                        </div>
                        <div class="product-body">
                            <p class="product-category">{{ p.categoria }}</p>
                            <h3 class="product-name">{{ p.nome }}</h3>
                            <div class="product-meta">
                                <span class="stars">★★★★★</span>
                                <span class="rating-text">{{ p.avaliacao }}</span>
                            </div>
                            <div class="product-price">
                                {{ formatarPreco(p.preco) }}
                            </div>
                            <p class="product-installments">{{ p.parcelamento }}</p>
                            <button class="buy-btn" @click="$router.push({ name: 'Produto', params: { id: p.id } })">
                                Comprar
                            </button>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
:global(*) {
    box-sizing: border-box;
}

.catalog-page {
    min-height: 100vh;
    background: #f8f9fc;
    color: #181e33;
    font-family: "DM Sans", sans-serif;
    padding: 24px;
}

.page-header {
    max-width: 1300px;
    margin: 0 auto 18px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
}

.page-title {
    font-family: "Syne", sans-serif;
    font-size: 28px;
    font-weight: 800;
    margin: 0;
}

.page-subtitle {
    margin: 4px 0 0;
    color: #5a6380;
    font-size: 13px;
}

.header-actions {
    display: flex;
    gap: 10px;
}

.sort-select {
    padding: 10px 14px;
    border: 1px solid #e2e6f0;
    border-radius: 12px;
    background: #fff;
    color: #2a3050;
    outline: none;
    font-size: 13px;
}

.breadcrumb {
    max-width: 1300px;
    margin: 0 auto 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #9aa3bb;
}

.breadcrumb span:last-child {
    color: #2a3050;
    font-weight: 500;
}

.sep {
    color: #c8cedc;
}

.catalog-layout {
    max-width: 1300px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
    align-items: flex-start;
}

.filters-card {
    width: 260px;
    flex-shrink: 0;
    background: #ffffff;
    border: 1px solid #e2e6f0;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(17, 71, 152, 0.08);
    overflow: hidden;
}

.filters-card-header {
    padding: 14px 18px;
    background: linear-gradient(135deg, #2c18a0, #114798);
    color: #fff;
    font-family: "Syne", sans-serif;
    font-weight: 700;
    font-size: 14px;
}

.filter-section {
    padding: 16px 18px;
    border-bottom: 1px solid #f0f2f7;
}

.filter-section:last-of-type {
    border-bottom: none;
}

.filter-label {
    display: block;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 700;
    color: #5a6380;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.filter-select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e2e6f0;
    border-radius: 12px;
    background: #fff;
    color: #2a3050;
    font-size: 13px;
    outline: none;
}

.filter-select:focus,
.sort-select:focus {
    border-color: #114798;
}

.clear-btn {
    width: calc(100% - 36px);
    margin: 0 18px 18px;
    padding: 11px 14px;
    border: 1.5px solid #114798;
    border-radius: 12px;
    background: transparent;
    color: #114798;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
}

.clear-btn:hover {
    background: #114798;
    color: #fff;
}

.products-area {
    flex: 1;
    min-width: 0;
}

.products-top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 18px;
}

.products-title {
    font-family: "Syne", sans-serif;
    font-size: 22px;
    font-weight: 800;
    margin: 0;
}

.products-count {
    margin: 2px 0 0;
    font-size: 13px;
    color: #9aa3bb;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
}

.empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    color: #9aa3bb;
}

.product-card {
    background: #fff;
    border: 1px solid #e2e6f0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(17, 71, 152, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(17, 71, 152, 0.14);
}

.product-image {
    height: 180px;
    background: #f0f2f7;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.image-placeholder {
    color: #9aa3bb;
    font-size: 13px;
    font-weight: 600;
}

.product-body {
    padding: 14px 14px 16px;
}

.product-category {
    margin: 0 0 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #2c18a0;
}

.product-name {
    margin: 0 0 8px;
    font-size: 14px;
    line-height: 1.4;
    color: #181e33;
    min-height: 39px;
}

.product-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

.stars {
    font-size: 12px;
    color: #f6b900;
}

.rating-text {
    font-size: 12px;
    color: #9aa3bb;
}

.product-price {
    font-family: "Syne", sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #049377;
}

.product-installments {
    margin: 2px 0 0;
    font-size: 11px;
    color: #9aa3bb;
}

.buy-btn {
    width: 100%;
    margin-top: 12px;
    padding: 10px 12px;
    border: none;
    border-radius: 12px;
    background: #114798;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.buy-btn:hover {
    background: #0A377A;
}

.buy-btn:active {
    transform: scale(0.98);
}
</style>