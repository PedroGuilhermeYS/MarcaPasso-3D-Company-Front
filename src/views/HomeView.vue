  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useProdutosStore } from '@/stores/useProdutosStore'
  import { formatarPreco } from '@/composables/useFormatadorPreco'
  import ProductCard from '@/componentes/ProdutoView/ProductCard.vue'

  const router = useRouter()
  const produtosStore = useProdutosStore()

  onMounted(async () => {
      try {
          await produtosStore.carregarProdutos()
      } catch (error) {
          console.warn('sem backend', error.message)
      }
  })

  const produtosMaisVendidos = computed(() => produtosStore.produtos.slice(0, 6))
  const produtosLancamentos = computed(() => produtosStore.produtos.slice(6, 12))
  const produtosDestaqueHero = computed(() => {
    if (produtosStore.produtos.length === 0) return []
    return [...produtosStore.produtos]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
  })

  const posC1 = ref(0)
  const posC2 = ref(0)
  const visibleCards = 4
  const gap = 18
  const cardWidth = ref(248 + gap)

  const maxPosC1 = computed(() => Math.max(0, produtosMaisVendidos.value.length - visibleCards))
  const maxPosC2 = computed(() => Math.max(0, produtosLancamentos.value.length - visibleCards))

  const prevC1 = () => (posC1.value = Math.max(0, posC1.value - 1))
  const nextC1 = () => (posC1.value = Math.min(maxPosC1.value, posC1.value + 1))
  const setPosC1 = (index) => (posC1.value = index)

  const prevC2 = () => (posC2.value = Math.max(0, posC2.value - 1))
  const nextC2 = () => (posC2.value = Math.min(maxPosC2.value, posC2.value + 1))
  const setPosC2 = (index) => (posC2.value = index)

  const track1Style = computed(() => ({ transform: `translateX(-${posC1.value * cardWidth.value}px)` }))
  const track2Style = computed(() => ({ transform: `translateX(-${posC2.value * cardWidth.value}px)` }))

  const Catalogo = () => router.push({ name: 'Catalogo' });
  </script>

  <template>
    <main>
      <div class="hero">
        <div class="hero-inner">
          <div class="hero-text">
            <div class="hero-eyebrow">
              <span class="material-symbols-outlined">view_in_ar</span>
              Impressão 3D Premium
            </div>
            <div class="hero-title">Produtos únicos<br/>feitos <em>para você</em></div>
            <div class="hero-sub">Decoração, acessórios e muito mais com tecnologia de impressão 3D de alto nível. Cada peça é para você.</div>
            <div class="hero-ctas">
              <button class="btn-hero-main" @click="Catalogo">
                <span class="material-symbols-outlined">shopping_cart</span>
                Ver catálogo
              </button>
              <!-- <button class="btn-hero-sec">Personalizar agora →</button> -->
            </div>
          </div>
          <div class="hero-cards">
            <div class="hero-mini-card" v-for="p in produtosDestaqueHero" :key="p.id" @click="router.push({ name: 'Produto', params: { id: p.id } })">
              <div class="hmc-icon"><img :src="p.imagemPrincipal" :alt="p.nome"></div>
              <div class="hmc-name">{{ p.nome }}</div>
              <div class="hmc-price">{{ formatarPreco(p.preco) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="trust-bar">
        <div class="trust-inner">
          <div class="trust-item green">
            <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/></svg>
            Frete grátis acima de R$ 150
          </div>
          <div class="trust-item blue">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Compra 100% segura
          </div>
          <div class="trust-item green">
            <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/></svg>
            Devolução em 30 dias
          </div>
          <div class="trust-item ind">
            <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/></svg>
            PIX com 15% de desconto
          </div>
          <div class="trust-item blue">
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
            Atendimento personalizado
          </div>
        </div>
      </div> -->

      <div class="section">
        <div class="sec-hd">
          <div class="sec-hd-left">
            <div class="sec-accent ind"></div>
            <div>
              <div class="sec-label ind">Top produtos</div>
              <div class="sec-title-txt"><span class="material-symbols-outlined">local_fire_department</span> Recomendados por nós</div>
            </div>
          </div>
          <div class="sec-hd-right">
            <div class="carousel-nav">
              <button class="cnav-btn" :disabled="posC1 === 0" @click="prevC1">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button class="cnav-btn" :disabled="posC1 >= maxPosC1" @click="nextC1">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <div class="carousel-outer">
          <div class="carousel-track-wrap">
            <div class="carousel-track" :style="track1Style">
              <ProductCard v-for="p in produtosMaisVendidos" :key="p.id" :produto="p" />
            </div>
          </div>

          <div class="carousel-dots">
            <div v-for="n in (maxPosC1 + 1)" :key="n" class="dot" :class="{ act: posC1 === (n - 1) }" @click="setPosC1(n - 1)"></div>
          </div>
        </div>
      </div>

      <div class="banner-strip">
        <div class="banner-inner">
          <div class="banner-text">
            <div class="banner-title">Peça seu produto <em></em></div>
            <div class="banner-sub">Cada peça é produzida sob encomenda para você. Escolha o que te chama atenção e receba em casa.</div>
          </div>
          <!-- <button class="btn-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="white"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/></svg>
            Personalizar agora
          </button> -->
        </div>
      </div>

      <div class="section" style="padding-bottom:60px;">
        <div class="sec-hd">
          <div class="sec-hd-left">
            <div class="sec-accent grn"></div>
            <div>
              <div class="sec-label grn">Acabaram de chegar</div>
              <div class="sec-title-txt"><span class="material-symbols-outlined">auto_awesome</span> Lançamentos</div>
            </div>
          </div>
          <div class="sec-hd-right">
            <button class="btn-see-all">
              Ver todos
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
            <div class="carousel-nav">
              <button class="cnav-btn" :disabled="posC2 === 0" @click="prevC2">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button class="cnav-btn" :disabled="posC2 >= maxPosC2" @click="nextC2">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <div class="carousel-track-wrap">
          <div class="carousel-track" :style="track2Style">
            <ProductCard v-for="p in produtosLancamentos" :key="p.id" :produto="p" />
          </div>
        </div>

        <div class="carousel-dots">
          <div v-for="n in (maxPosC2 + 1)" :key="n" class="dot" :class="{ act: posC2 === (n - 1) }" @click="setPosC2(n - 1)"></div>
        </div>
      </div>
    </main>
  </template>

  <style scoped>
  main {
    background: var(--color-g50);
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    font-family: var(--fb, 'DM Sans', sans-serif);
    border: none;
    transition: all .18s;
  }

  svg {
    stroke: currentColor;
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hero {
    background: linear-gradient(130deg, var(--indigo, #2C18A0) 0%, var(--blue, #114798) 55%, #0f5ea8 100%);
    padding: 0;
    overflow: hidden;
    position: relative;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(4,147,119,.2) 0%, transparent 65%);
    pointer-events: none;
  }

  .hero-bg-shapes {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .hs {
    position: absolute;
    border-radius: 50%;
    opacity: .07;
    background: #fff;
  }

  .hs1 {
    width: 320px;
    height: 320px;
    top: -80px;
    right: 120px;
  }

  .hs2 {
    width: 180px;
    height: 180px;
    bottom: -40px;
    right: 360px;
  }

  .hs3 {
    width: 90px;
    height: 90px;
    top: 40px;
    right: 520px;
  }

  .hero-inner {
    max-width: 1300px;
    margin: 0 auto;
    padding: 56px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }

  .hero-text {
    color: #fff;
    max-width: 520px;
    position: relative;
    z-index: 1;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.2);
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: rgba(255,255,255,.85);
    margin-bottom: 18px;
  }

  .hero-title {
    font-family: var(--fh, 'Syne', sans-serif);
    font-size: 46px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .hero-title em {
    color: var(--green-l, #05b090);
    font-style: normal;
  }

  .hero-sub {
    font-size: 16px;
    color: rgba(255,255,255,.78);
    line-height: 1.7;
    margin-bottom: 30px;
    max-width: 420px;
  }

  .hero-ctas {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn-hero-main {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: var(--green, #049377);
    color: #fff;
    padding: 14px 30px;
    border-radius: 50px;
    font-family: var(--fh, 'Syne', sans-serif);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: .04em;
    box-shadow: 0 6px 24px rgba(4,147,119,.4);
  }

  .btn-hero-main:hover {
    background: var(--green-l, #05b090);
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(4,147,119,.5);
  }

  .btn-hero-main svg {
    stroke: white;
    width: 16px;
    height: 16px;
  }

  .btn-hero-sec {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: rgba(255,255,255,.12);
    color: #fff;
    padding: 14px 26px;
    border-radius: 50px;
    border: 1.5px solid rgba(255,255,255,.25);
    font-size: 14px;
    font-weight: 500;
  }

  .btn-hero-sec:hover {
    background: rgba(255,255,255,.22);
  }

  .hero-cards {
    display: flex;
    gap: 14px;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }

  .hero-mini-card {
    background: rgba(255,255,255,.12);
    backdrop-filter: blur(8px);
    border: 1.5px solid rgba(255,255,255,.2);
    border-radius: var(--rl, 16px);
    padding: 20px;
    width: 150px;
    text-align: center;
    cursor: pointer;
    transition: all .2s ease;
  }

  .hero-mini-card:nth-child(2) {
    margin-top: 24px;
  }

  .hero-mini-card:nth-child(3) {
    margin-top: 12px;
  }

  .hero-mini-card:hover {
    background: rgba(255,255,255,.18);
    border-color: rgba(255,255,255,.35);
    transform: translateY(-4px);
  }

  .hmc-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: rgba(255,255,255,.15);
    margin: 0 auto 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hmc-icon svg {
    width: 26px;
    height: 26px;
    color: #fff;
  }

  .hmc-name {
    font-family: var(--fh, 'Syne', sans-serif);
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  .hmc-price {
    font-size: 13px;
    font-weight: 600;
    color: var(--green-l, #05b090);
  }

  .trust-bar {
    background: #fff;
    border-bottom: 1px solid var(--g150, #e4e9f2);
    padding: 0 28px;
  }

  .trust-inner {
    max-width: 1300px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    border-right: 1px solid var(--g150, #e4e9f2);
    font-size: 13px;
    color: var(--g600, #4d5b78);
    font-weight: 500;
  }

  .trust-item:last-child {
    border-right: none;
  }

  .trust-item svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .trust-item.green svg {
    color: var(--green, #049377);
  }

  .trust-item.blue svg {
    color: var(--blue, #114798);
  }

  .trust-item.ind svg {
    color: var(--indigo, #2C18A0);
  }

  .section {
    max-width: 1300px;
    margin: 0 auto;
    padding: 48px 28px 0;
  }

  .section:last-of-type {
    padding-bottom: 60px;
  }

  .sec-hd {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .sec-hd-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .sec-accent {
    width: 4px;
    border-radius: 4px;
    align-self: stretch;
  }

  .sec-accent.ind {
    background: linear-gradient(180deg, var(--indigo, #2C18A0), var(--blue, #114798));
  }

  .sec-accent.grn {
    background: linear-gradient(180deg, var(--green-d, #037a64), var(--green-l, #05b090));
  }

  .sec-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
    margin-bottom: 4px;
  }

  .sec-label.ind {
    color: var(--indigo, #2C18A0);
  }

  .sec-label.grn {
    color: var(--green-d, #037a64);
  }

  .sec-title-txt {
    font-family: var(--fh, 'Syne', sans-serif);
    font-size: 24px;
    font-weight: 800;
    color: var(--g900, #141824);
    line-height: 1.15;
  }

  .sec-hd-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-see-all {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 20px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 600;
    border: 1.5px solid var(--g200, #d6dcea);
    background: #fff;
    color: var(--g600, #4d5b78);
  }

  .btn-see-all:hover {
    border-color: var(--blue, #114798);
    color: var(--blue, #114798);
  }

  .btn-see-all svg {
    width: 14px;
    height: 14px;
  }

  .carousel-nav {
    display: flex;
    gap: 8px;
  }

  .cnav-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid var(--g200, #d6dcea);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--g500, #6b7a9a);
  }

  .cnav-btn:hover {
    border-color: var(--blue, #114798);
    color: var(--blue, #114798);
    background: #f0f4ff;
  }

  .cnav-btn:disabled {
    opacity: .35;
    cursor: not-allowed;
  }

  .cnav-btn svg {
    width: 15px;
    height: 15px;
  }

  .carousel-outer {
    position: relative;
  }

  .carousel-track-wrap {
    overflow: hidden;
    border-radius: var(--rl, 16px);
  }

  .carousel-track {
    display: flex;
    gap: 18px;
    transition: transform .4s cubic-bezier(.25,.46,.45,.94);
    will-change: transform;
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 18px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--g200, #d6dcea);
    cursor: pointer;
    transition: all .2s;
  }

  .dot.act {
    background: var(--blue, #114798);
    width: 22px;
    border-radius: 4px;
  }

  .banner-strip {
    background: linear-gradient(130deg, var(--indigo, #2C18A0) 0%, var(--blue, #114798) 60%, #0f5ea8 100%);
    padding: 36px 28px;
    margin: 48px 0 0;
  }

  .banner-inner {
    max-width: 1300px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .banner-text {
    color: #fff;
  }

  .banner-title {
    font-family: var(--fh, 'Syne', sans-serif);
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
  }

  .banner-title em {
    color: var(--green-l, #05b090);
    font-style: normal;
  }

  .banner-sub {
    font-size: 14px;
    color: rgba(255,255,255,.75);
    max-width: 460px;
    line-height: 1.6;
  }

  .btn-banner {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    flex-shrink: 0;
    background: var(--green, #049377);
    color: #fff;
    padding: 14px 28px;
    border-radius: 50px;
    font-family: var(--fh, 'Syne', sans-serif);
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 4px 20px rgba(4,147,119,.4);
    white-space: nowrap;
  }

  .btn-banner:hover {
    background: var(--green-l, #05b090);
    transform: translateY(-2px);
  }

  .btn-banner svg {
    stroke: white;
  }
  .hmc-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}
  </style>
