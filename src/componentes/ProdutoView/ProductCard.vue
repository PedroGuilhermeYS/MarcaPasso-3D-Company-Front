<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatarPreco } from '@/composables/useFormatadorPreco.js'

const props = defineProps({
  produto: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const badgeLabel = computed(() => {
  if (props.produto.badge) return props.produto.badge
  if (props.produto.id === '1') return '🔥 Top 1'
  if (props.produto.id === '2') return 'Promoção'
  if (props.produto.id === '3') return 'Frete grátis'
  return props.produto.personalizavel ? 'Novo' : props.produto.categoria
})

const badgeClass = computed(() => {
  if (badgeLabel.value.includes('Promo')) return 'promo'
  if (badgeLabel.value.includes('Frete')) return 'free'
  if (badgeLabel.value.includes('Top')) return 'hot'
  return 'new'
})
</script>

<template>
  <div class="prod-card" @click="router.push({ name: 'Produto', params: { id: produto.id } })">
    <div class="prod-img" style="background:#eef2ff;">
      <img v-if="produto.imagemPrincipal" :src="produto.imagemPrincipal" :alt="produto.nome" />
      <svg v-else class="ph" viewBox="0 0 24 24" style="color:var(--indigo)"><polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/><line x1="12" y1="22" x2="12" y2="11.5"/><polyline points="22 6.5 12 11.5 2 6.5"/></svg>

      <div class="prod-badges">
        <span class="pbadge" :class="badgeClass">{{ badgeLabel }}</span>
      </div>
      <button class="btn-wish" type="button" aria-label="Favoritar" @click.stop>
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>

      <div class="prod-img-overlay"></div>
      <div class="prod-quick"><svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Adicionar ao carrinho</div>
    </div>
    
    <div class="prod-body">
      <div class="prod-cat">Categoria</div>
      <div class="prod-name">{{ produto.nome }}</div>
      <div class="prod-stars"><span class="stars">★★★★★</span></div>

      <div class="prod-price-row">
        <div class="prod-price-block">
          <div class="prod-price">{{ formatarPreco(produto.preco) }}</div>
        </div>
        <button class="btn-buy-sm" @click.stop="router.push({ name: 'Produto', params: { id: produto.id } })">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
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
  box-shadow: var(--shadow, 0 2px 12px rgba(17,71,152,.08));
  transition: transform .22s, box-shadow .22s, border-color .22s;
  position: relative;
  cursor: pointer;
}

.prod-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md, 0 8px 32px rgba(17,71,152,.16));
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

.prod-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(17,71,152,.07), transparent);
  opacity: 0;
  transition: opacity .22s;
}

.prod-card:hover .prod-img-overlay {
  opacity: 1;
}

.prod-quick {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--color-brand-indigo, #2C18A0), var(--color-brand-blue, #114798));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  font-family: var(--font-family-head, 'Syne', sans-serif);
  padding: 10px;
  text-align: center;
  letter-spacing: .04em;
  transform: translateY(100%);
  transition: transform .22s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.prod-card:hover .prod-quick {
  transform: translateY(0);
}

.prod-quick svg { width: 13px; height: 13px; stroke: white; }

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

.btn-wish {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-g300, #b8c1d8);
  font-size: 14px;
  transition: all .18s;
}

.btn-wish:hover {
  color: var(--color-danger, #d63031);
  box-shadow: 0 3px 14px rgba(214,48,49,.25);
}

.btn-wish svg {
  width: 14px;
  height: 14px;
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
  box-shadow: 0 3px 10px rgba(44,24,160,.22);
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

</style>
