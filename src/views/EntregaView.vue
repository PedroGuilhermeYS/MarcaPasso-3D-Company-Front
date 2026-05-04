<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Endereços from '@/componentes/EntregaView/Endereços.vue'
import MarketEndereço from '@/componentes/EntregaView/MarketEndereço.vue'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore';
import Contato from '@/componentes/EntregaView/Contato.vue';
import Pagamento from '@/componentes/EntregaView/Pagamento.vue';
import StepsCarrinho from '@/componentes/StepsCarrinho.vue'

const carrinho = useCarrinhoStore()
const router = useRouter()

onMounted(() => {
  if (carrinho.itens.length === 0) {
    router.push({ name: 'Carrinho' })
  }
})

</script>

<template>
  <main main class="users">
    <div class="bc">
      <router-link to="/conta/carrinho">Carrinho</router-link>
      <span class="bc-sep">›</span>
      <span class="bc-cur">Finalização</span>
    </div>
    <StepsCarrinho :currentStep="2" />
    <div class="layout">
      <div class="coluna-esquerda">
        <Contato />
        <Endereços />
        <Pagamento />
      </div>
      <MarketEndereço />
    </div>
  </main>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: flex-start;
}

.bc {
  padding: 14px 28px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #9aa3bb;
}

.bc-sep {
  color: #c8cedc;
}

.bc-cur {
  color: #2a3050;
  font-weight: 500;
}

.coluna-esquerda {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.contato {
  grid-column: 1;
  grid-row: 1;
}

.enderecos {
  grid-column: 1;
  grid-row: 2;
}

.marketi {
  grid-column: 2;
  grid-row: 1 / span 2;
}
</style>