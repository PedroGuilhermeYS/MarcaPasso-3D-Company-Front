<script setup>
import { computed } from 'vue'
import { formatarPreco } from '@/composables/useFormatadorPreco'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updateQuantity', 'removeItem'])

const handleIncreaseQty = () => {
  emit('updateQuantity', {
    id: props.item.id,
    quantidade: (props.item.quantidade || 1) + 1
  })
}

const handleDecreaseQty = () => {
  if ((props.item.quantidade || 1) > 1) {
    emit('updateQuantity', {
      id: props.item.id,
      quantidade: (props.item.quantidade || 1) - 1
    })
  }
}

const handleRemove = () => {
  emit('removeItem', props.item.id)
}

const priceCard = computed(() => {
  const pix = props.item.preco || 0
  return pix * 1.1
})
</script>

<template>
  <div class="ct-item">
    <div class="ct-img">
      <svg viewBox="0 0 24 24">
        <polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2" />
      </svg>
    </div>
    
    <div class="ct-info">
      <div class="ct-name">{{ item.nome }}</div>
      <div class="ct-sku" v-if="item.sku">SKU: {{ item.sku }}</div>
      <div class="ct-tags" v-if="item.tags && item.tags.length">
        <span 
          v-for="tag in item.tags" 
          :key="tag.label"
          class="ct-tag"
          :class="`ct-tag-${tag.type}`"
        >
          {{ tag.label }}
        </span>
      </div>
    </div>

    <div class="ct-right">
      <div class="ct-price-pix">{{ formatarPreco(item.preco) }}</div>
      <div class="ct-price-card">{{ formatarPreco(priceCard) }} no cartão</div>
      
      <div class="ct-qty-row">
        <button class="ct-qty-btn" @click="handleDecreaseQty">−</button>
        <span class="ct-qty-n">{{ item.quantidade || 1 }}</span>
        <button class="ct-qty-btn" @click="handleIncreaseQty">+</button>
        <button class="ct-trash" @click="handleRemove">🗑</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ct-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--color-g100);
  transition: opacity 0.3s;
}

.ct-item:last-child {
  border-bottom: none;
}

.ct-item:hover {
  opacity: 0.9;
}

.ct-img {
  width: 76px;
  height: 76px;
  border: 1.5px solid var(--color-g200);
  border-radius: var(--radius);
  background: var(--color-g50);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ct-img svg {
  width: 36px;
  height: 36px;
  opacity: 0.3;
  color: var(--color-brand-indigo);
  stroke: currentColor;
  stroke-width: 1.5;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ct-info {
  flex: 1;
  min-width: 0;
}

.ct-name {
  font-size: 13px;
  color: var(--color-g800);
  line-height: 1.4;
  margin-bottom: 4px;
  font-weight: 500;
}

.ct-sku {
  font-size: 11px;
  color: var(--color-g400);
}

.ct-tags {
  display: flex;
  gap: 6px;
  margin-top: 7px;
  flex-wrap: wrap;
}

.ct-tag {
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.ct-tag-g {
  background: #e4f5ef;
  color: var(--color-brand-green-d);
}

.ct-tag-i {
  background: #eeeffe;
  color: var(--color-brand-indigo);
}

.ct-tag-w {
  background: #fef0eb;
  color: var(--color-warning);
}

.ct-right {
  text-align: right;
  flex-shrink: 0;
}

.ct-price-pix {
  font-family: var(--font-family-head);
  font-size: 17px;
  font-weight: 700;
  color: var(--color-brand-green);
}

.ct-price-card {
  font-size: 11px;
  color: var(--color-g400);
  margin-top: 2px;
}

.ct-qty-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  justify-content: flex-end;
}

.ct-qty-btn {
  width: 29px;
  height: 29px;
  border: 1.5px solid var(--color-g200);
  background: var(--color-g50);
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-g600);
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-family-base);
  font-weight: 600;
}

.ct-qty-btn:hover {
  border-color: var(--color-brand-blue);
  color: var(--color-brand-blue);
  background: #f0f4ff;
}

.ct-qty-btn:active {
  transform: scale(0.95);
}

.ct-qty-n {
  font-size: 13px;
  font-weight: 700;
  min-width: 24px;
  text-align: center;
}

.ct-trash {
  background: none;
  border: none;
  color: var(--color-g300);
  font-size: 17px;
  margin-left: 4px;
  cursor: pointer;
  transition: color 0.2s;
}

.ct-trash:hover {
  color: var(--color-danger);
}
</style>
