<script setup>
  import { ref, onMounted } from 'vue'
  import { useCarrinhoStore } from '@/stores/useCarrinhoStore';
  import { useFretesStore } from '@/stores/useFretesStore';
  import { useAuthStore } from '@/stores/useAuthStore';
  import axiosInstance from '@/api/config';

  const carrinho = useCarrinhoStore()
  const fretes = useFretesStore()
  const authStore = useAuthStore()
  const enderecos = ref([])
  const ValorFrete = ref(null)
  const enderecoSelecionado = ref(null);

  onMounted(async () => {
    await fretes.carregarFretes()

    const idUsuario = authStore.usuario?.id
    if (idUsuario) {
      const { data } = await axiosInstance.get(`/api/enderecos/${idUsuario}`)
      enderecos.value = data
    }

    if (carrinho.freteSelecionado) {
      ValorFrete.value = carrinho.freteSelecionado
    }
    if (carrinho.enderecoSelecionado) {
      enderecoSelecionado.value = carrinho.enderecoSelecionado.cep
    }
  })

  function selecionarEndereco(endereco) {
    enderecoSelecionado.value = endereco.cep;
    carrinho.definirEndereco(endereco);

    const freteEncontrado = fretes.fretes.find(f => f.cep_entrega === enderecoSelecionado.value);

    if (freteEncontrado) {
      ValorFrete.value = freteEncontrado.valor_frete;
      carrinho.definirFrete(freteEncontrado.valor_frete);
    } else {
      ValorFrete.value = null;
      carrinho.definirFrete(null);
    }
  }
</script>

<template>
  <div class="sec">
    <div class="sec-hd">
      <div class="sec-hd-left">
        <div class="sec-icon">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <span class="sec-title">Endereço de Entrega</span>
      </div>
    </div>

    <div class="sec-body">
      <div class="addr-list">
        <div
          v-for="endereco in enderecos"
          :key="endereco.id"
          class="addr-opt"
          :class="{ sel: enderecoSelecionado === endereco.cep }"
          @click="selecionarEndereco(endereco)"
        >
          <div class="radio">
            <div class="radio-dot"></div>
          </div>
          <div class="addr-info">
            <div class="addr-nome">{{ endereco.nome }}</div>
            <div class="addr-linha">{{ endereco.rua }}, {{ endereco.numero }}<span v-if="endereco.complemento"> — {{ endereco.complemento }}</span></div>
            <div class="addr-linha">{{ endereco.bairro }} · {{ endereco.cidade }} · {{ endereco.estado }} · {{ endereco.cep }}</div>
          </div>
        </div>

        <div v-if="!enderecos.length" class="sem-endereco">
          <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <p>Nenhum endereço cadastrado.</p>
        </div>
      </div>
    </div>
  </div>
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

  .sec-body {
    padding: 20px 22px;
  }

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

  .sem-endereco {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 2rem 0;
    color: #8f9db8;
    font-size: 14px;
  }

  .sem-endereco svg {
    stroke: none;
    fill: #d6dcea;
  }
</style>