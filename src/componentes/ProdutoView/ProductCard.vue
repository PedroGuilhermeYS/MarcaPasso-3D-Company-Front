<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'
import { useFavoritosStore } from '@/stores/useFavoritosStore'

const props = defineProps({
  produto: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const favoritos = useFavoritosStore()

const produtoFavoritavel = computed(() => {
  if (!props.produto) return null
  return {
    id: props.produto.id,
    nome: props.produto.nome,
    preco: props.produto.preco,
    imagem: props.produto.imagemPrincipal
  }
})

onMounted(async () => {
  await favoritos.carregarFavoritos()
})

async function onToggleFavorito() {
  if (!produtoFavoritavel.value) return

  if (favoritos.isFavoritado(props.produto.id)) {
    await favoritos.removerFavorito(props.produto.id)
  } else {
    await favoritos.adicionarFavorito(produtoFavoritavel.value)
  }
}
</script>

<template>
  <div class="prod-card" @click="router.push({ name: 'Produto', params: { id: produto.id } })">
    <div class="prod-img" style="background:#eef2ff;">
      <img :src="produto.imagemPrincipal" :alt="produto.nome">

      <button
        class="material-symbols-outlined btn-fav"
        type="button"
        aria-label="Favoritar"
        :style="{ color: favoritos.isFavoritado(produto.id) ? 'red' : 'var(--color-primary)' }"
        @click.stop="onToggleFavorito"
      >
        favorite
      </button>
    </div>

    <div class="prod-body">
      <div class="prod-cat">Nome</div>
      <div class="prod-name">{{ produto.nome }}</div>
      <div class="prod-stars"><span class="stars">★★★★★</span></div>

      <div class="prod-price-row">
        <div class="prod-price-block">
          <div class="prod-price">{{ formatarPreco(produto.preco) }}</div>
        </div>
        <button class="btn-buy-sm" @click.stop="router.push({ name: 'Produto', params: { id: produto.id } })">
          <svg viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Comprar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prod-card {
  background: #fff;
  border: 1.5px solid var(--color-g150, #e4e9f2);
  border-radius: var(--radius, 16px);
  overflow: hidden;
  flex-shrink: 0;
  width: calc((100% - 18px * 4) / 4.4);
  min-width: 230px;
  max-width: 270px;
  box-shadow: var(--shadow, 0 2px 12px rgba(17, 71, 152, .08));
  transition: transform .22s, box-shadow .22s, border-color .22s;
  position: relative;
  cursor: pointer;
}

.prod-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md, 0 8px 32px rgba(17, 71, 152, .16));
  border-color: var(--color-g200, #d6dcea);
}

.prod-img {
  height: 185px;
  background: var(--color-g50, #f7f9fc);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.prod-img svg.ph {
  width: 80px;
  height: 80px;
  opacity: .11;
}

.prod-img img {
  width: 80%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.btn-fav {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, .12);
  cursor: pointer;
  z-index: 2;
}

.btn-fav:hover {
  transform: scale(1.06);
}

.prod-card:hover {
  opacity: 1;
}

.prod-card:hover .prod-quick {
  transform: translateY(0);
}

.prod-quick svg {
  width: 13px;
  height: 13px;
  stroke: white;
}

.prod-badges {
  position: absolute;
  top: 9px;
  left: 9px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pbadge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
  display: inline-block;
}

.pbadge.new {
  background: var(--color-brand-indigo, #2C18A0);
  color: #fff;
}

.pbadge.promo {
  background: var(--color-warning, #e17055);
  color: #fff;
}

.pbadge.free {
  background: var(--color-brand-green, #049377);
  color: #fff;
}

.pbadge.hot {
  background: var(--color-danger, #d63031);
  color: #fff;
}

.prod-body {
  padding: 13px 15px 16px;
}

.prod-cat {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--color-brand-indigo, #2C18A0);
  text-transform: uppercase;
  letter-spacing: .07em;
  margin-bottom: 5px;
}

.prod-name {
  font-size: 13px;
  color: var(--color-g800, #252f4a);
  font-weight: 500;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  margin-bottom: 8px;
}

.prod-stars {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
}

.stars {
  color: var(--star, #f6b900);
  font-size: 12px;
}

.prod-price-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.prod-old {
  font-size: 11px;
  color: var(--color-g300, #b8c1d8);
  text-decoration: line-through;
  line-height: 1;
}

.prod-price {
  font-family: var(--font-family-head, 'Syne', sans-serif);
  font-size: 18px;
  font-weight: 800;
  color: var(--color-brand-green, #049377);
}

.prod-inst {
  font-size: 11px;
  color: var(--color-g400, #8f9db8);
  margin-top: 1px;
}

.btn-buy-sm {
  padding: 8px 13px;
  border-radius: var(--radius, 12px);
  background: linear-gradient(135deg, var(--color-brand-indigo, #2C18A0), var(--color-brand-blue, #114798));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(44, 24, 160, .22);
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-buy-sm:hover {
  opacity: .9;
  transform: scale(1.05);
}

.btn-buy-sm svg {
  width: 12px;
  height: 12px;
  stroke: white;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 300,
    'GRAD' 0,
    'opsz' 24;
  font-size: 20px;
}
</style>