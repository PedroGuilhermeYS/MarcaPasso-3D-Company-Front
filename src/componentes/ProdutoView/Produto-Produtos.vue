<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
    import { useFavoritosStore } from '@/stores/useFavoritosStore';
    import { useProdutosStore } from '@/stores/useProdutosStore';
    import { useAuthStore } from '@/stores/useAuthStore'
    import { formatarPreco } from '@/composables/useFormatadorPreco.js'

    const auth = useAuthStore()
    const usuarioLogado = computed(() => !!auth.usuario)
    const route = useRoute()
    const produto = ref(null)
    const produtoFavoritavel = computed(() => {
        if (!produto.value) return null
        return {
            id: produto.value.id,
            nome: produto.value.nome,
            preco: produto.value.preco,
            imagem: produto.value.imagemPrincipal
        }
    })
    const itens = ref(1)
    const carrinho = useCarrinhoStore()
    const favoritos = useFavoritosStore()
    const currentUrl = window.location.href
    const imagemAtual = ref(null)
    const produtosStore = useProdutosStore()

    const router = useRouter()
    const isAdmin = computed(() => auth.isAdmin())

    const sugestoes = computed(() => {
        const lista = produtosStore.produtos || []
        const filtrada = lista.filter(p => produto.value ? String(p.id) !== String(produto.value.id) : true)
        return filtrada.slice(0, 4)
    })

    const sugViewport = ref(null)

    function scrollNext() {
        if (!sugViewport.value) return
        const w = sugViewport.value.clientWidth
        sugViewport.value.scrollBy({ left: w * 0.9, behavior: 'smooth' })
    }

    function scrollPrev() {
        if (!sugViewport.value) return
        const w = sugViewport.value.clientWidth
        sugViewport.value.scrollBy({ left: -w * 0.9, behavior: 'smooth' })
    }

    function gotoProduto(id) {
        router.push({ name: 'Produto', params: { id: String(id) } })
    }

    onMounted(async () => {

        await produtosStore.carregarProdutos()
        await carrinho.carregarCarrinho()
        await favoritos.carregarFavoritos()


        produto.value = produtosStore.produtos.find(p => String(p.id) === String(route.params.id))

        if (!produto.value) {
            console.warn('Produto não encontrado para o ID:', route.params.id)
        } else {
            imagemAtual.value = produto.value.imagemPrincipal
        }
    })

    function validarQuantidade() {
        itens.value = Math.floor(itens.value);

        if (isNaN(itens.value) || itens.value < 1) itens.value = 1;
        if (itens.value > 100) itens.value = 100;
    }

    async function compartilharProduto() {
        const link = `${window.location.origin}/produto/${route.params.id}`
        const titulo = produto.value.nome

        if (navigator.share) {
            await navigator.share({
                title: titulo,
                text: `Confira este produto: ${titulo}`,
                url: link,
            })
        } else {
            await navigator.clipboard.writeText(link)
            alert('Link copiado para a área de transferência!')
        }
    }

    async function onToggleFavorito() {
        if (!produtoFavoritavel.value) return
        if (favoritos.isFavoritado(produto.value.id)) {
            await favoritos.removerFavorito(produto.value.id)
        } else {
            await favoritos.adicionarFavorito(produtoFavoritavel.value)
        }
    }

    function editarProduto() {
        if (!produto.value) return
        router.push({ name: 'AtualizarProduto', params: { id: String(produto.value.id) } })
    }

    async function deletarProduto() {
        if (!produto.value) return
        const ok = confirm(`Deseja remover o produto "${produto.value.nome}"? Esta ação não pode ser desfeita.`)
        if (!ok) return

        try {
            await produtosStore.removerProduto(produto.value.id)
            alert('Produto removido com sucesso.')
            router.push({ name: 'Home' })
        } catch (e) {
            console.error(e)
            alert('Erro ao remover produto.')
        }
    }

</script>

<template>
    <div v-if="produto">
        <!-- BREADCRUMB -->
        <div class="bc">
            <span>Home</span>
            <span class="bc-sep">›</span>
            <span>{{ produto.categoria }}</span>
            <span class="bc-sep">›</span>
            <span class="cur">{{ produto.nome }}</span>
        </div>

        <div class="pd-wrap">
            <!-- GALLERY -->
            <div>
                <div class="pd-gallery">
                    <div class="pd-main-img">
                        <img v-if="imagemAtual" :src="imagemAtual" :alt="produto.nome" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                        <svg v-else class="ph" viewBox="0 0 24 24"><polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/><line x1="12" y1="22" x2="12" y2="11.5"/><polyline points="22 6.5 12 11.5 2 6.5"/></svg>
                        <div class="pd-img-badge">
                            <span class="pill pill-g">✦ Personaliz​ável</span>
                        </div>
                    </div>

                    <div class="pd-thumbs">
                        <div class="pd-thumb" :class="{ act: imagemAtual === produto.imagemPrincipal }" @click="imagemAtual = produto.imagemPrincipal">
                            <img v-if="produto.imagemPrincipal" :src="produto.imagemPrincipal" :alt="produto.nome" style="width: 100%; height: 100%; object-fit: cover;" />
                            <svg v-else viewBox="0 0 24 24"><polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/></svg>
                        </div>
                        <div v-for="(foto, index) in produto.imagensSecundarias" :key="index" class="pd-thumb" :class="{ act: imagemAtual === foto }" @click="imagemAtual = foto">
                            <img :src="foto" :alt="`Imagem ${index + 1}`" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                    </div>

                    <div class="pd-share">
                        <button class="share-btn" @click="compartilharProduto">
                            <svg width="13" height="13" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            Copiar link
                        </button>
                        <a :href="`https://api.whatsapp.com/send?text=${encodeURIComponent('Confira este produto: ' + produto.nome + ' - ' + currentUrl)}`" target="_blank" rel="noopener noreferrer">
                            <button class="share-btn wpp">📱 WhatsApp</button>
                        </a>
                        <button v-if="usuarioLogado" class="share-btn fav" :style="{ borderColor: favoritos.isFavoritado(produto.id) ? 'var(--color-brand-green)' : 'var(--color-brand-green)', backgroundColor: favoritos.isFavoritado(produto.id) ? 'var(--color-brand-green)' : 'transparent', color: favoritos.isFavoritado(produto.id) ? '#fff' : 'var(--color-brand-green)' }" @click="onToggleFavorito">♡ {{ favoritos.isFavoritado(produto.id) ? 'Favorito' : 'Favoritar' }}</button>
                        <router-link v-if="!usuarioLogado" to="/Login">
                            <button class="share-btn fav">♡ Favoritar</button>
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="pd-right">
                <div class="pd-card">
                    <div class="pd-cat">{{ produto.categoria }} · Impressão 3D</div>
                    <div class="pd-name">{{ produto.nome }}</div>
                    <div class="pd-stars">
                        <span class="stars">★★★★★</span>
                        <span class="stars-txt">Seja o primeiro a opinar</span>
                    </div>

                    <div class="pd-price-block">
                        <div class="pd-old" v-if="produto.precoAntigo">De: {{ formatarPreco(produto.precoAntigo) }}</div>
                        <div class="pd-pix-lbl">à vista no PIX</div>
                        <div class="pd-pix">{{ formatarPreco(produto.preco) }}</div>
                        <div class="pd-inst">ou 3× de {{ formatarPreco(produto.preco / 3) }} sem juros no cartão</div>
                    </div>

                    <div class="pd-qty-row">
                        <span class="pd-qty-lbl">Quantidade</span>
                        <div class="qty-ctrl">
                            <button @click="itens = Math.max(1, itens - 1)">−</button>
                            <span>{{ itens }}</span>
                            <button @click="itens = Math.min(100, itens + 1)">+</button>
                        </div>
                    </div>

                    <div v-if="usuarioLogado">
                        <button class="btn-cart-main" @click="carrinho.adicionarItem(produto, itens)">
                            <svg width="18" height="18" viewBox="0 0 24 24" stroke="white"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            Adicionar ao carrinho
                        </button>
                    </div>
                    <router-link v-if="!usuarioLogado" to="/Login">
                        <button class="btn-cart-main">
                            <svg width="18" height="18" viewBox="0 0 24 24" stroke="white"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            Adicionar ao carrinho
                        </button>
                    </router-link>

                    <div class="trust">
                        <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Compra 100% segura e protegida
                    </div>
                    <div v-if="isAdmin" class="admin-ctrls">
                        <button class="btn-edit" @click="editarProduto">✎ Editar</button>
                        <button class="btn-delete" @click="deletarProduto">🗑 Remover</button>
                    </div>
                </div>   
            </div>

            <!-- DESCRIPTION full-width -->
            <div class="pd-desc-card">
                <div class="pd-desc-title">Descrição do produto</div>
                <div class="pd-desc-body">
                    {{ produto.descricao || 'Produto impressionante de alta qualidade. Confira os detalhes técnicos e especificações abaixo.' }}
                </div>
            </div>
        </div>

        <!-- SUGESTÕES: carrossel de produtos -->
        <div class="sugestoes">
            <div class="sug-title">Você também pode gostar</div>
            <div class="sug-carousel">
                <button class="sug-nav prev" @click="scrollPrev" aria-label="Anterior">‹</button>
                <div class="sug-viewport" ref="sugViewport">
                    <div class="sug-track">
                        <div v-for="p in sugestoes" :key="p.id" class="sug-card" role="link" tabindex="0" :aria-label="`Abrir ${p.nome}`" @click="gotoProduto(p.id)" @keyup.enter="gotoProduto(p.id)" @keydown.space.prevent="gotoProduto(p.id)">
                            <div class="sug-img" style="cursor:pointer">
                                <img v-if="p.imagemPrincipal" :src="p.imagemPrincipal" :alt="p.nome" style="width:100%;height:100%;object-fit:cover" />
                                <svg v-else width="60" height="60" viewBox="0 0 24 24" style="opacity:.15;color:var(--color-brand-indigo)"><rect x="2" y="7" width="20" height="14" rx="2"/></svg>
                            </div>
                            <div class="sug-body">
                                <div class="sug-name">{{ p.nome }}</div>
                                <div class="sug-price">{{ formatarPreco(p.preco) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="sug-nav next" @click="scrollNext" aria-label="Próximo">›</button>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* ─── BREADCRUMB ─── */
.bc {
    max-width: 1340px;
    margin: 0 auto;
    padding: 14px 28px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--color-g400);
}
.bc span.cur {
    color: var(--color-g800);
    font-weight: 500;
}
.bc-sep {
    color: var(--color-g300);
}

/* ─── PRODUCT PAGE ─── */
.pd-wrap {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 28px 60px;
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 36px;
    align-items: start;
}

.pd-gallery {
    background: #fff;
    border: 1px solid var(--color-g200);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(17, 71, 152, 0.09);
}

.pd-main-img {
    height: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-g50);
    position: relative;
    border-bottom: 1px solid var(--color-g100);
}

.pd-main-img svg.ph {
    width: 160px;
    height: 160px;
    opacity: 0.12;
    color: var(--color-brand-indigo);
}

.pd-img-badge {
    position: absolute;
    top: 16px;
    left: 16px;
}

.pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
}

.pill-ind {
    background: #eeeffe;
    color: var(--color-brand-indigo);
}

.pill-g {
    background: #e4f5ef;
    color: var(--color-brand-green-d);
}

.pill-w {
    background: #fef0eb;
    color: var(--color-warning);
}

.pd-thumbs {
    display: flex;
    gap: 10px;
    padding: 14px 18px;
    overflow-x: auto;
}

.pd-thumb {
    width: 70px;
    height: 70px;
    border-radius: var(--radius);
    border: 2px solid var(--color-g200);
    background: var(--color-g50);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.2s;
}

.pd-thumb:hover, .pd-thumb.act {
    border-color: var(--color-brand-blue);
}

.pd-thumb svg {
    width: 28px;
    height: 28px;
    opacity: 0.25;
    color: var(--color-brand-indigo);
}

.pd-share {
    padding: 0 18px 14px;
    display: flex;
    gap: 8px;
}

.share-btn {
    padding: 7px 15px;
    border-radius: var(--radius);
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1.5px solid var(--color-g200);
    background: none;
    color: var(--color-g600);
    cursor: pointer;
    transition: all 0.2s;
}

.share-btn:hover {
    border-color: var(--color-brand-blue);
    color: var(--color-brand-blue);
}

.share-btn.wpp {
    border-color: #25D366;
    color: #25D366;
}

.share-btn.wpp:hover {
    background: #25D366;
    color: #fff;
}

.share-btn.fav {
    border-color: var(--color-brand-green);
    color: var(--color-brand-green);
}

.share-btn.fav:hover {
    background: var(--color-brand-green);
    color: #fff;
}

.pd-right {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.pd-card {
    background: #fff;
    border: 1px solid var(--color-g200);
    border-radius: var(--radius-lg);
    padding: 26px;
    box-shadow: 0 2px 12px rgba(17, 71, 152, 0.09);
}

.pd-cat {
    font-size: 11px;
    font-weight: 700;
    color: var(--color-brand-indigo);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 8px;
}

.pd-name {
    font-family: var(--font-family-head);
    font-size: 23px;
    font-weight: 800;
    color: var(--color-g900);
    line-height: 1.25;
    margin-bottom: 12px;
}

.pd-stars {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
}

.stars {
    color: #f6b900;
    font-size: 15px;
}

.stars-txt {
    font-size: 12px;
    color: var(--color-g400);
}

.pd-price-block {
    border-top: 1px solid var(--color-g100);
    border-bottom: 1px solid var(--color-g100);
    padding: 18px 0;
    margin-bottom: 18px;
}

.pd-old {
    font-size: 13px;
    color: var(--color-g400);
    text-decoration: line-through;
    margin-bottom: 3px;
}

.pd-pix-lbl {
    font-size: 11px;
    color: var(--color-g400);
    margin-bottom: 2px;
}

.pd-pix {
    font-family: var(--font-family-head);
    font-size: 34px;
    font-weight: 800;
    color: var(--color-brand-green);
    margin-bottom: 4px;
}

.pd-inst {
    font-size: 13px;
    color: var(--color-g600);
}

.pd-qty-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
}

.pd-qty-lbl {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-g800);
}

.qty-ctrl {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--color-g200);
    border-radius: var(--radius);
    overflow: hidden;
}

.qty-ctrl button {
    width: 38px;
    height: 38px;
    background: none;
    border: none;
    font-size: 20px;
    color: var(--color-g600);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.qty-ctrl button:hover {
    background: var(--color-g100);
    color: var(--color-g800);
}

.qty-ctrl span {
    min-width: 36px;
    text-align: center;
    font-weight: 700;
    font-size: 15px;
    border-left: 1.5px solid var(--color-g200);
    border-right: 1.5px solid var(--color-g200);
    line-height: 38px;
}

.btn-cart-main {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, var(--color-brand-indigo), var(--color-brand-blue));
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 15px;
    font-weight: 700;
    font-family: var(--font-family-head);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cart-main:hover {
    opacity: 0.9;
    transform: scale(1.01);
}

.btn-cart-main:active {
    transform: scale(0.98);
}

.trust {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--color-brand-green);
    font-weight: 500;
    margin-top: 12px;
    justify-content: center;
}

.pd-info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 0;
    border-bottom: 1px solid var(--color-g100);
    font-size: 13px;
}

.pd-info-row:last-child {
    border-bottom: none;
}

.pd-info-lbl {
    color: var(--color-g400);
}

.pd-info-val {
    color: var(--color-g800);
    font-weight: 500;
}

.pd-info-val.ok {
    color: var(--color-brand-green);
}

.pd-desc-card {
    background: #fff;
    border: 1px solid var(--color-g200);
    border-radius: var(--radius-lg);
    padding: 26px;
    box-shadow: 0 2px 12px rgba(17, 71, 152, 0.09);
    grid-column: 1/-1;
}

.pd-desc-title {
    font-family: var(--font-family-head);
    font-size: 17px;
    font-weight: 700;
    color: var(--color-g900);
    padding-bottom: 12px;
    border-bottom: 2px solid var(--color-brand-indigo);
    display: inline-block;
    margin-bottom: 18px;
}

.pd-desc-body {
    font-size: 14px;
    color: var(--color-g600);
    line-height: 1.9;
}

/* especificações removidas */

/* ─── SUGESTÕES DE PRODUTOS ─── */
.sugestoes {
    max-width: 1340px;
    margin: 0 auto 48px;
    padding: 0 28px;
}

.sug-title {
    font-family: var(--font-family-head);
    font-size: 20px;
    font-weight: 800;
    color: var(--color-g900);
    margin-bottom: 20px;
}

.sug-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
}

.sug-card {
    background: #fff;
    border: 1px solid var(--color-g200);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.sug-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 24px rgba(17, 71, 152, 0.13);
}

.sug-img {
    height: 150px;
    background: var(--color-g50);
    display: flex;
    align-items: center;
    justify-content: center;
}

.sug-img svg {
    width: 60px;
    height: 60px;
    opacity: 0.15;
    color: var(--color-brand-indigo);
}

.sug-body {
    padding: 12px 14px 16px;
}

.sug-name {
    font-size: 12.5px;
    color: var(--color-g800);
    line-height: 1.4;
    height: 2.8em;
    overflow: hidden;
    margin-bottom: 6px;
}

.sug-price {
    font-family: var(--font-family-head);
    font-size: 16px;
    font-weight: 700;
    color: var(--color-brand-green);
}

.sug-btn {
    width: 100%;
    margin-top: 10px;
    padding: 9px;
    background: linear-gradient(135deg, var(--color-brand-indigo), var(--color-brand-blue));
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.sug-btn:hover {
    opacity: 0.9;
}

/* carrossel */
.sug-carousel{display:flex;align-items:center;gap:12px;position:relative}
.sug-viewport{overflow:hidden;flex:1}
.sug-track{display:flex;gap:18px;padding-bottom:4px}
.sug-card{flex:0 0 calc((100% - 3*18px)/4);min-width:180px}
.sug-nav{background:rgba(255,255,255,0.95);border:1px solid var(--color-g200);width:36px;height:36px;border-radius:999px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px}
.sug-nav:hover{transform:scale(1.03)}

/* responsividade: 4 → 3 → 2 → 1 */
@media (max-width: 1200px) {
    .sug-card{flex:0 0 calc((100% - 2*18px)/3)}
}
@media (max-width: 900px) {
    .sug-card{flex:0 0 calc((100% - 1*18px)/2)}
}
@media (max-width: 520px) {
    .sug-card{flex:0 0 100%;min-width:0}
    .sug-carousel{padding:0 12px}
}

a {
    text-decoration: none;
    color: inherit;
}

/* Admin controls */
.admin-ctrls{display:flex;gap:10px;margin-top:12px;justify-content:center}
.btn-edit{padding:8px 12px;border-radius:8px;border:1.5px solid var(--color-brand-blue);background:transparent;color:var(--color-brand-blue);cursor:pointer;font-weight:700}
.btn-edit:hover{background:var(--color-brand-blue);color:#fff}
.btn-delete{padding:8px 12px;border-radius:8px;border:1.5px solid var(--color-danger);background:transparent;color:var(--color-danger);cursor:pointer;font-weight:700}
.btn-delete:hover{background:var(--color-danger);color:#fff}
</style>