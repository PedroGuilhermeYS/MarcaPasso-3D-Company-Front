<script setup>
import { useRouter } from 'vue-router'
import { onMounted, computed, ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCarrinhoStore } from '@/stores/useCarrinhoStore'
import { useFavoritosStore } from '@/stores/useFavoritosStore'
import { usePesquisaStore } from '@/stores/usePesquisaStore'

const pesquisa = usePesquisaStore()
const carrinho = useCarrinhoStore()
const favoritosStore = useFavoritosStore()
const router = useRouter()
const auth = useAuthStore()
const usuarioLogado = computed(() => auth.usuario)
const acessar = computed(() => {
  return auth.isAdmin()
})

onMounted(async () => {
  await carrinho.carregarCarrinho()
  await favoritosStore.carregarFavoritos()
})

function buscar() {
  if (router.currentRoute.value.name !== 'Catalogo') {
    router.push({ name: 'Catalogo' })
  }
}
const NovoCrud = () => router.push({ name: 'NovoCrud' });
</script>

<template>
  <nav>
    <div class="nav-main">
      <div class="logo" @click="router.push({ name: 'Home' })" style="cursor: pointer;">
        <div class="logo-cube">
          <svg viewBox="0 0 24 24" stroke="white">
            <polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="11.5" />
            <polyline points="22 6.5 12 11.5 2 6.5" />
          </svg>
        </div>
        MarcaPasso 3D
      </div>

      <div class="srch">
        <input type="text" placeholder="Buscar produtos 3D…" v-model="pesquisa.termo" @keyup.enter="buscar">
        <div class="srch-ic" @click="buscar">
          <span class="material-symbols-outlined">search</span>
        </div>
      </div>

      <div class="nav-acts">

        <button class="nbtn nbtn-admin" v-if="acessar" @click="router.push({ name: 'NovoCrud' })">
          <span class="material-symbols-outlined">admin_panel_settings</span>
          Admin
        </button>

        <button class="nbtn" @click="router.push({ name: 'PainelUsuario' })">
          <span class="material-symbols-outlined">person</span>
          {{ usuarioLogado?.nome }}
        </button>

        <button class="nbtn-ic" @click="router.push({ name: 'Favoritos' })">
          <span class="material-symbols-outlined">favorite</span>
          <span class="nbadge">{{ favoritosStore.quantidade }}</span>
        </button>

        <button class="nbtn-ic" @click="router.push({ name: 'Carrinho' })">
          <span class="material-symbols-outlined">shopping_cart</span>
          <span class="nbadge">{{ carrinho.itens.length }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  background: linear-gradient(135deg, var(--color-brand-indigo) 0%, var(--color-brand-blue) 100%);
  box-shadow: 0 3px 20px rgba(44, 24, 160, .28);
  position: sticky;
  top: 0;
  z-index: 200;
}

.nav-main {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 11px 28px;
}

.logo {
  font-family: var(--font-family-head);
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.logo-cube {
  width: 30px;
  height: 30px;
  background: var(--color-brand-green);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-cube svg {
  width: 16px;
  height: 16px;
  stroke: white;
}

.srch {
  flex: 1;
  max-width: 540px;
  position: relative;
}

.srch input {
  width: 100%;
  padding: 10px 42px 10px 18px;
  background: rgba(255, 255, 255, .15);
  border: 1.5px solid rgba(255, 255, 255, .22);
  border-radius: 50px;
  color: #fff;
  font-size: 13.5px;
  outline: none;
  transition: all .2s;
}

.srch input::placeholder {
  color: rgba(255, 255, 255, .5);
}

.srch input:focus {
  background: rgba(255, 255, 255, .22);
  border-color: rgba(255, 255, 255, .5);
}

.srch-ic {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, .6);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.srch-ic .material-symbols-outlined {
  font-size: 18px;
}

.nav-acts {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.nbtn {
  background: rgba(255, 255, 255, .12);
  border: 1.5px solid rgba(255, 255, 255, .18);
  color: #fff;
  padding: 8px 14px;
  border-radius: 50px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-family: var(--font-family-base);
  transition: all .18s;
}

.nbtn:hover {
  background: rgba(255, 255, 255, .22);
}

.nbtn .material-symbols-outlined {
  font-size: 16px;
}

.nbtn-admin {
  background: rgba(255, 255, 255, .2);
  border-color: rgba(255, 255, 255, .4);
  font-weight: 700;
}

.nbtn-admin:hover {
  background: rgba(255, 255, 255, .32);
}

.nbtn-ic {
  background: rgba(255, 255, 255, .12);
  border: 1.5px solid rgba(255, 255, 255, .18);
  color: #fff;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all .18s;
}

.nbtn-ic:hover {
  background: rgba(255, 255, 255, .22);
}

.nbtn-ic .material-symbols-outlined {
  font-size: 18px;
}

.nbadge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--color-brand-green);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>