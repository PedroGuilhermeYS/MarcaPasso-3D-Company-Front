<script setup>
import { ref, onMounted } from 'vue'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
import { useFretesStore } from '@/stores/useFretesStore'
import { useAuthStore } from '@/stores/useAuthStore'
import axiosInstance from '@/api/config'
import ModalAdicionarEndereco from '@/componentes/AlteraçõesView/ModalAdicionarEndereco.vue'

const carrinho = useCarrinhoStore()
const fretes = useFretesStore()
const authStore = useAuthStore()

const enderecos = ref([])
const ValorFrete = ref(null)
const enderecoSelecionado = ref(null)
const modoEscolha = ref(false)

const modalAdicionar = ref(null)

onMounted(async () => {
  await fretes.carregarFretes()
  await carregarEnderecos()

  if (carrinho.freteSelecionado) {
    ValorFrete.value = carrinho.freteSelecionado
  }
  if (carrinho.enderecoSelecionado) {
    enderecoSelecionado.value = carrinho.enderecoSelecionado
  }
})

async function carregarEnderecos() {
  const idUsuario = authStore.usuario?.id
  if (!idUsuario) return
  const { data } = await axiosInstance.get(`/api/enderecos/${idUsuario}`)
  enderecos.value = data

  // Se só tem um endereço e nenhum foi selecionado ainda, seleciona automaticamente
  if (data.length === 1 && !enderecoSelecionado.value) {
    aplicarEndereco(data[0])
  }
}

function aplicarEndereco(endereco) {
  enderecoSelecionado.value = endereco
  carrinho.definirEndereco(endereco)

  const freteEncontrado = fretes.fretes.find(f => f.cep_entrega === endereco.cep)
  if (freteEncontrado) {
    ValorFrete.value = freteEncontrado.valor_frete
    carrinho.definirFrete(freteEncontrado.valor_frete)
  } else {
    ValorFrete.value = null
    carrinho.definirFrete(null)
  }

  modoEscolha.value = false
}

function abrirEscolha() {
  modoEscolha.value = true
}

function fecharEscolha() {
  modoEscolha.value = false
}

function abrirModalAdicionar() {
  modalAdicionar.value?.abrir()
}

async function onEnderecoSalvo() {
  await carregarEnderecos()
}
</script>

<template>
  <div class="sec">
    <div class="sec-hd">
      <div class="sec-hd-left">
        <div class="sec-icon">
          <span class="material-symbols-outlined">location_on</span>
        </div>
        <span class="sec-title">Endereço de Entrega</span>
      </div>

      <button
        v-if="enderecoSelecionado && !modoEscolha"
        class="btn-alterar"
        type="button"
        @click="abrirEscolha"
      >
        ALTERAR
      </button>
    </div>

    <div class="sec-body">

      <div v-if="enderecoSelecionado && !modoEscolha" class="addr-selecionado">
        <div class="addr-sel-icon">
          <span class="material-symbols-outlined">location_on</span>
        </div>
        <div class="addr-sel-info">
          <span class="addr-sel-nome">{{ enderecoSelecionado.nome }}</span>
          <span class="addr-sel-linha">
            {{ enderecoSelecionado.rua }}, {{ enderecoSelecionado.numero }}
            <template v-if="enderecoSelecionado.complemento"> — {{ enderecoSelecionado.complemento }}</template>
          </span>
          <span class="addr-sel-linha">
            {{ enderecoSelecionado.bairro }} · {{ enderecoSelecionado.cidade }} · {{ enderecoSelecionado.estado }} · {{ enderecoSelecionado.cep }}
          </span>
        </div>
        <div class="addr-sel-badge">✓</div>
      </div>

      <div v-else-if="modoEscolha || (!enderecoSelecionado && enderecos.length)" class="addr-list">
        <div
          v-for="endereco in enderecos"
          :key="endereco.id"
          class="addr-opt"
          :class="{ sel: enderecoSelecionado?.id === endereco.id }"
          @click="aplicarEndereco(endereco)"
        >
          <div class="radio">
            <div class="radio-dot"></div>
          </div>
          <div class="addr-info">
            <div class="addr-nome">{{ endereco.nome }}</div>
            <div class="addr-linha">
              {{ endereco.rua }}, {{ endereco.numero }}
              <span v-if="endereco.complemento"> — {{ endereco.complemento }}</span>
            </div>
            <div class="addr-linha">{{ endereco.bairro }} · {{ endereco.cidade }} · {{ endereco.estado }} · {{ endereco.cep }}</div>
          </div>
        </div>

        <button class="btn-novo-inline" type="button" @click="abrirModalAdicionar">
          <span class="btn-novo-plus">+</span> Adicionar novo endereço
        </button>

        <button
          v-if="enderecoSelecionado && modoEscolha"
          class="btn-cancelar-escolha"
          type="button"
          @click="fecharEscolha"
        >
          Cancelar
        </button>
      </div>

      <div v-else class="sem-endereco">
        <span class="material-symbols-outlined">location_on</span>
        <p>Nenhum endereço cadastrado.</p>
        <button class="btn-novo-vazio" type="button" @click="abrirModalAdicionar">
          + CADASTRAR ENDEREÇO
        </button>
      </div>

    </div>
  </div>

  <ModalAdicionarEndereco ref="modalAdicionar" @salvo="onEnderecoSalvo" />
</template>

<style scoped>
.sec {
  background: #fff;
  border: 1px solid #e4e9f2;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 8px rgba(17, 71, 152, .08);
}

.sec-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  border-bottom: 1px solid #eef1f8;
}

.sec-hd-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sec-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2C18A0, #114798);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sec-icon svg {
  width: 16px;
  height: 16px;
  stroke: none;
  fill: #fff;
}

.sec-title {
  font-family: 'Syne', var(--font-family-base), sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #141824;
}

/* ── Botão alterar no header ────────────────────────── */
.btn-alterar {
  border: 0;
  background: transparent;
  font-family: 'Syne', sans-serif;
  font-size: 11px;
  font-weight: 800;
  color: #114798;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  transition: color 0.2s;
}

.btn-alterar:hover {
  color: #2c18a0;
}

.sec-body {
  padding: 20px 22px;
}

/* ── Endereço selecionado compacto ──────────────────── */
.addr-selecionado {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  border: 1.5px solid #114798;
  border-radius: 10px;
  background: #f0f4ff;
  box-shadow: 0 0 0 3px rgba(17, 71, 152, .08);
}

.addr-sel-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c18a0, #114798);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.addr-sel-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.addr-sel-nome {
  font-size: 14px;
  font-weight: 700;
  color: #141824;
}

.addr-sel-linha {
  font-size: 13px;
  color: #6b7a9a;
  line-height: 1.6;
}

.addr-sel-badge {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #049377;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

/* ── Lista de endereços ─────────────────────────────── */
.addr-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.addr-opt {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border: 1.5px solid #d6dcea;
  border-radius: 10px;
  cursor: pointer;
  transition: all .18s;
  background: #fff;
}

.addr-opt:hover {
  border-color: #114798;
  background: #f4f7ff;
}

.addr-opt.sel {
  border-color: #114798;
  background: #f0f4ff;
  box-shadow: 0 0 0 3px rgba(17, 71, 152, .08);
}

.radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #b8c1d8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color .18s;
}

.addr-opt.sel .radio {
  border-color: #114798;
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #114798;
  opacity: 0;
  transition: opacity .18s;
}

.addr-opt.sel .radio-dot {
  opacity: 1;
}

.addr-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 2px;
}

.addr-nome {
  font-size: 14px;
  font-weight: 700;
  color: #141824;
}

.addr-linha {
  font-size: 13px;
  color: #6b7a9a;
  line-height: 1.6;
}

/* ── Botão adicionar inline (dentro da lista) ───────── */
.btn-novo-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 1.5px dashed #ff7a00;
  border-radius: 10px;
  background: transparent;
  color: #ff7a00;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  justify-content: center;
}

.btn-novo-inline:hover {
  background: #fff5ee;
}

.btn-novo-plus {
  font-size: 18px;
  line-height: 1;
}

/* ── Botão cancelar escolha ─────────────────────────── */
.btn-cancelar-escolha {
  border: 0;
  background: transparent;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #8f9db8;
  cursor: pointer;
  text-align: center;
  text-decoration: underline;
  padding: 4px 0;
  transition: color 0.2s;
}

.btn-cancelar-escolha:hover {
  color: #51607f;
}

/* ── Estado vazio ───────────────────────────────────── */
.sem-endereco {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 2rem 0;
  color: #8f9db8;
  font-size: 14px;
}

.sem-endereco svg {
  stroke: none;
  fill: #d6dcea;
}

.btn-novo-vazio {
  height: 36px;
  padding: 0 20px;
  border: 1.4px solid #ff7a00;
  border-radius: 4px;
  background: transparent;
  color: #ff7a00;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}

.btn-novo-vazio:hover {
  background: #fff5ee;
}
</style>