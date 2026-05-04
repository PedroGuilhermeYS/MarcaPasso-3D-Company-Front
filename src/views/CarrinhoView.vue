<script setup>
import { ref, onMounted } from 'vue'
import { useFretesStore } from '@/stores/useFretesStore'
import StepsCarrinho from '@/componentes/StepsCarrinho.vue'
import Carrinho from '@/componentes/CarrinhoView/Carrinho.vue'
import Market from '@/componentes/CarrinhoView/Market.vue'

const fretes = useFretesStore()
const ValorFrete = ref(null)
const DiaEntrega = ref('')
const cidade = ref('')

onMounted(async () => {
    await fretes.carregarFretes()
})

function calculardata(cepatual) {
    const frete = fretes.fretes.find(f => f.cep_destino === cepatual)
    if (frete) {
        DiaEntrega.value = `${frete.prazo_entrega_dias} dias`
        ValorFrete.value = frete.valor_frete
        cidade.value = ` em ${frete.cidade}`
    } else {
        DiaEntrega.value = 'Cidade fora de rotas'
        ValorFrete.value = null
        cidade.value = ''
    }
}
</script>

<template>
    <main main class="users">
        <div class="bc">
            <router-link to="/">Home</router-link>
            <span class="bc-sep">›</span>
            <span class="bc-cur">Carrinho</span>
        </div>

        <div class="ct-wrap">
            <StepsCarrinho :currentStep="1" />
            <Carrinho :ValorFrete="ValorFrete" :DiaEntrega="DiaEntrega" :cidade="cidade"
                @calcular-frete="calculardata" />
            <Market :ValorFrete="ValorFrete" />
        </div>
    </main>
</template>

<style scoped>
main {
    font-family: var(--font-family-base);
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

.ct-wrap {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
}

.ct-wrap> :first-child {
    grid-column: 1 / -1;
}
</style>