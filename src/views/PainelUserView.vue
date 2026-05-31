<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';
import { formatarPreco } from '@/composables/useFormatadorPreco.js'
import { useFavoritosStore } from '@/stores/useFavoritosStore'
import { useEncomendasStore } from '@/stores/useEncomendasStore'
import ModalAlterarSenha from '@/componentes/AlteraçõesView/ModalAlterarSenha.vue'

const authStore = useAuthStore();
const router = useRouter();
const favoritosStore = useFavoritosStore()
const encomendasStore = useEncomendasStore()

const modalSenhaRef = ref(null)

onMounted(async () => {
  await favoritosStore.carregarFavoritos()
})

onMounted(async () => {
  await encomendasStore.carregarEncomendas()
})

const stats = computed(() => {
  const lista = encomendasStore.encomendas
  return {
    total: lista.length,
    totalGasto: lista.reduce((acc, p) => acc + (p.total ?? 0), 0)
  }
})

const sair = async () => {
  await authStore.logout();
  router.push({ name: 'Login' });
};

const Home = () => router.push({ name: 'Home' });
const Encomendas = () => router.push({ name: 'Encomendas' });
const Favoritos = () => router.push({ name: 'Favoritos' });
const Cadastro = () => router.push({ name: 'Cadastro' });
const Enderecos = () => router.push({ name: 'Endereco' });
const NovoCrud = () => router.push({ name: 'NovoCrud' });
</script>

<template>
  <div class="page-wrap">
    <div class="bc">
      <span>Home</span>
      <span class="bc-sep"><span class="material-symbols-outlined">chevron_right</span></span>
      <span class="cur">Minha Conta</span>
    </div>

    <div class="welcome-card">
      <div class="avatar-wrap">
        <div class="avatar">{{ authStore.usuario.nome[0] }}</div>
        <div class="avatar-online"></div>
      </div>

      <div class="welcome-info">
        <div class="welcome-sub">Central Minha Conta</div>
        <div class="welcome-name">{{ authStore.usuario.nome }}</div>
        <div class="welcome-email">{{ authStore.usuario.email }}</div>
      </div>

      <div class="welcome-right">
        <button class="btn-edit" @click="Cadastro" type="button">✏️ EDITAR DADOS</button>

        <div class="welcome-meta">
          <div class="meta-item">
            <div class="meta-num">{{ stats.total }}</div>
            <div class="meta-lbl">Pedidos</div>
          </div>

          <div class="meta-item">
            <div class="meta-num">{{ favoritosStore.quantidade }}</div>
            <div class="meta-lbl">Favoritos</div>
          </div>

          <div class="meta-item">
            <div class="meta-num meta-green">R$ {{ formatarPreco(stats.totalGasto) }}</div>
            <div class="meta-lbl">Gasto total</div>
          </div>
        </div>
      </div>
    </div>

    <div class="sec-title-row">
      <div class="sec-title">ATALHOS</div>
    </div>

    <div class="shortcut-grid">
      <div class="sc-card" @click="Cadastro">
        <div class="sc-icon-wrap ind"><span class="material-symbols-outlined">person</span></div>
        <div class="sc-name">Meus Dados</div>
        <div class="sc-desc">Dados pessoais e senha</div>
      </div>

      <!-- Abre o modal de alterar senha -->
      <div class="sc-card" @click="modalSenhaRef.abrir()">
        <div class="sc-icon-wrap grn"><span class="material-symbols-outlined">lock</span></div>
        <div class="sc-name">Trocar Senha</div>
        <div class="sc-desc">Atualize sua senha de acesso</div>
      </div>

      <div class="sc-card" @click="Encomendas">
        <div class="sc-icon-wrap ind"><span class="material-symbols-outlined">inventory_2</span></div>
        <span class="sc-notif">{{ stats.total }}</span>
        <div class="sc-name">Meus Pedidos</div>
        <div class="sc-desc">Acompanhe suas encomendas</div>
      </div>

      <div class="sc-card" @click="Favoritos">
        <div class="sc-icon-wrap warn"><span class="material-symbols-outlined">favorite</span></div>
        <span class="sc-notif warn-bg">{{ favoritosStore.quantidade }}</span>
        <div class="sc-name">Favoritos</div>
        <div class="sc-desc">Produtos salvos para depois</div>
      </div>

      <div class="sc-card" @click="Enderecos">
        <div class="sc-icon-wrap grn"><span class="material-symbols-outlined">location_on</span></div>
        <div class="sc-name">Meus Endereços</div>
        <div class="sc-desc">Gerencie seus endereços de entrega</div>
      </div>

      <div class="sc-card danger" @click="sair">
        <div class="sc-icon-wrap red"><span class="material-symbols-outlined">logout</span></div>
        <div class="sc-name">Sair</div>
        <div class="sc-desc">Encerrar sessão da conta</div>
      </div>
    </div>
  </div>

  <!-- Modal montado fora do grid, controlado via ref -->
  <ModalAlterarSenha ref="modalSenhaRef" />
</template>

<style scoped>
.page-wrap {
  padding: 20px;
  font-family: "DM Sans", sans-serif;
}

.bc {
  padding: 14px 28px;
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: #9aa3bb;
}

.bc .cur {
  color: #141824;
  font-weight: 600;
}

.welcome-card {
  background: #ffffff;
  border-radius: 30px;
  padding: 28px 32px;
  box-shadow: 0 10px 30px rgba(17, 71, 152, 0.08);
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #2c18a0, #114798, #049377);
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c18a0, #114798);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #ffffff;
  box-shadow: 0 8px 20px rgba(44, 24, 160, 0.22);
  font-family: "Syne", sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  user-select: none;
}

.avatar-online {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 15px;
  height: 15px;
  background: #049377;
  border-radius: 50%;
  border: 3px solid #ffffff;
}

.welcome-info {
  flex: 1;
  min-width: 240px;
}

.welcome-sub {
  font-size: 12px;
  font-weight: 700;
  color: #8f9db8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.welcome-name {
  font-family: "Syne", sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #141824;
  margin-bottom: 8px;
  line-height: 1.2;
}

.welcome-email {
  font-size: 14px;
  color: #6b7a9a;
  font-weight: 500;
}

.welcome-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  flex-shrink: 0;
  margin-left: auto;
}

.btn-edit {
  background: linear-gradient(135deg, #2c18a0, #114798);
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 800;
  font-family: "Syne", sans-serif;
  cursor: pointer;
  border: 0;
}

.btn-edit:hover {
  transform: translateY(-2px);
}

.welcome-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  text-align: center;
}

.meta-num {
  font-family: "Syne", sans-serif;
  font-size: 20px;
  font-weight: 800;
}

.meta-green {
  color: #049377;
}

.meta-lbl {
  font-size: 11px;
  color: #8f9db8;
}

.sec-title-row {
  margin-bottom: 20px;
}

.sec-title {
  font-family: "Syne", sans-serif;
  font-size: 14px;
  font-weight: 800;
}

.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.sc-card {
  background: #ffffff;
  border: 1.5px solid #e4e9f2;
  border-radius: 30px;
  padding: 28px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 26px rgba(17, 71, 152, 0.08);
  min-height: 10rem;
  cursor: pointer;
  transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
}

.sc-card:hover {
  border-color: #114798;
  transform: translateY(-5px);
  box-shadow: 0 16px 34px rgba(17, 71, 152, 0.14);
}

.sc-card.danger:hover {
  border-color: #d63031;
}

.sc-icon-wrap {
  width: 5rem;
  height: 4rem;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.sc-icon-wrap.ind {
  background: linear-gradient(rgba(44, 24, 160, .12), rgba(0, 102, 255, .14));
}

.sc-icon-wrap.grn {
  background: linear-gradient(135deg, rgba(4, 147, 119, .12), rgba(5, 176, 144, .16));
}

.sc-icon-wrap.warn {
  background: linear-gradient(135deg, rgba(255, 186, 8, .14), rgba(255, 152, 0, .16));
}

.sc-icon-wrap.red {
  background: linear-gradient(135deg, rgba(214, 48, 49, .12), rgba(214, 48, 49, .16));
}

.sc-notif {
  background: #049377;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  height: 20px;
  padding: 0 6px;
  border-radius: 30px;
  display: flex;
  align-items: center;
}

.sc-notif.warn-bg {
  background: #ff0b0b;
}

.sc-name {
  font-family: "Syne", sans-serif;
  font-weight: 800;
  color: #252f4a;
  transition: color 0.22s;
}

.sc-card:hover .sc-name {
  color: #114798;
}

.sc-card.danger:hover .sc-name {
  color: #d63031;
}

.sc-desc {
  font-size: 12px;
  color: #8f9db8;
  text-align: center;
}
</style>