<script setup>
import { ref } from 'vue'
import pixIcon from '@/img/pix.png'

const emit = defineEmits(['selecionarPagamento'])

const selecionado = ref(null)   // "pix" | "cartao" | null

const opcoes = [
  {
    tipo: 'pix',
    titulo: 'PIX',
    subtitulo: 'Pagamento instantâneo com desconto à vista',
    icone: pixIcon,
    tag: '10% OFF',
  },
  {
    tipo: 'cartao',
    titulo: 'CARTÃO DE CRÉDITO',
    subtitulo: 'Parcele em até 12x',
    icone: null,
    tag: null,
  },
]

function selecionar(tipo) {
  selecionado.value = tipo
  emit('selecionarPagamento', tipo)
}
</script>

<template>
  <div class="pagamentos-wrap">
    <h2 class="titulo-secao"># Forma de Pagamento</h2>
    <p class="subtitulo">Selecione como deseja pagar</p>

    <div class="lista">
      <div
        v-for="op in opcoes"
        :key="op.tipo"
        class="card-pagamento"
        :class="{ ativo: selecionado === op.tipo }"
        @click="selecionar(op.tipo)"
        role="radio"
        :aria-checked="selecionado === op.tipo"
      >
        <!-- Radio visual -->
        <div class="radio-circulo" :class="{ marcado: selecionado === op.tipo }">
          <div v-if="selecionado === op.tipo" class="radio-ponto"></div>
        </div>

        <!-- Ícone PIX -->
        <div class="icone-wrap">
          <img v-if="op.icone" :src="op.icone" :alt="op.titulo" class="icone-pix" />
          <div v-else class="icone-cartao">
            <span class="chip">▬</span>
            💳
          </div>
        </div>

        <!-- Texto -->
        <div class="texto">
          <div class="titulo">{{ op.titulo }}</div>
          <div class="sub">{{ op.subtitulo }}</div>
        </div>

        <!-- Tag de destaque -->
        <span v-if="op.tag" class="tag-destaque">{{ op.tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagamentos-wrap {
  font-family: var(--font-family-base);
}

.titulo-secao {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 .3rem;
  color: var(--color-text);
}

.subtitulo {
  font-size: .85rem;
  color: var(--color-muted);
  margin: 0 0 1.5rem;
}

.lista {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-pagamento {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border: 2px solid var(--color-border-input);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color .18s, background .18s, transform .15s;
  position: relative;
  user-select: none;
}

.card-pagamento:hover {
  border-color: var(--color-primary);
  background: #f0f8ff;
}

.card-pagamento.ativo {
  border-color: var(--color-primary);
  background: #eaf4ff;
  transform: scale(1.01);
}

/* Radio */
.radio-circulo {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border-strong);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color .15s;
}
.radio-circulo.marcado {
  border-color: var(--color-primary);
}
.radio-ponto {
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border-radius: 50%;
}

/* Ícones */
.icone-wrap {
  width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icone-pix {
  width: 36px;
  height: 36px;
  object-fit: contain;
}
.icone-cartao {
  font-size: 1.6rem;
  line-height: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chip {
  font-size: .55rem;
  color: var(--color-muted);
  letter-spacing: 1px;
}

/* Texto */
.texto {
  flex: 1;
}
.titulo {
  font-size: .95rem;
  font-weight: 700;
  color: var(--color-text);
}
.sub {
  font-size: .78rem;
  color: var(--color-muted);
  margin-top: 2px;
}

/* Tag */
.tag-destaque {
  background: #d4edda;
  color: #1a6b2a;
  font-size: .68rem;
  font-weight: 700;
  padding: .2rem .55rem;
  border-radius: 999px;
  letter-spacing: .4px;
  flex-shrink: 0;
}
</style>
