<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <nav>
    <div class="nav-main">
      <div class="logo" @click="router.push({ name: 'Home' })" style="cursor: pointer;">
        <div class="logo-cube">
          <svg viewBox="0 0 24 24" stroke="white">
            <polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/>
            <line x1="12" y1="22" x2="12" y2="11.5"/>
            <polyline points="22 6.5 12 11.5 2 6.5"/>
          </svg>
        </div>
        MarcaPasso 3D
      </div>
      <div class="srch">
        <input type="text" placeholder="Buscar produtos 3D…">
        <div class="srch-ic">
          <svg width="15" height="15" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
      </div>
      <div class="nav-acts">
        <button class="nbtn">
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          João Silva
        </button>
        <button class="nbtn-ic">
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="nbadge">4</span>
        </button>
        <button class="nbtn-ic">
          <svg width="14" height="14" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="nbadge">2</span>
        </button>
      </div>
    </div>
    <div class="nav-sec">
      <button class="ntab">☰ Departamentos</button>
      <button class="ntab hl-w">🔥 Promoções</button>
      <button class="ntab hl-g">✦ Frete Grátis</button>
      <button class="ntab">Decoração</button>
      <button class="ntab">Roupas</button>
      <button class="ntab">Acessórios</button>
      <button class="ntab">Personalizar</button>
      <button class="ntab">Minha Conta</button>
    </div>
  </nav>
</template>

<style scoped>
nav {
  background: linear-gradient(135deg, var(--indigo) 0%, var(--blue) 100%);
  box-shadow: 0 3px 20px rgba(44,24,160,.28);
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
  font-family: var(--fh);
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
  background: var(--green);
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
  background: rgba(255,255,255,.15);
  border: 1.5px solid rgba(255,255,255,.22);
  border-radius: 50px;
  color: #fff;
  font-size: 13.5px;
  outline: none;
  transition: all .2s;
}

.srch input::placeholder {
  color: rgba(255,255,255,.5);
}

.srch input:focus {
  background: rgba(255,255,255,.22);
  border-color: rgba(255,255,255,.5);
}

.srch-ic {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,.6);
}

.nav-acts {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.nbtn {
  background: rgba(255,255,255,.12);
  border: 1.5px solid rgba(255,255,255,.18);
  color: #fff;
  padding: 8px 14px;
  border-radius: 50px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-family: var(--fb);
  transition: all .18s;
}

.nbtn:hover {
  background: rgba(255,255,255,.22);
}

.nbtn-ic {
  background: rgba(255,255,255,.12);
  border: 1.5px solid rgba(255,255,255,.18);
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
  background: rgba(255,255,255,.22);
}

.nbadge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--green);
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

.nav-sec {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  align-items: center;
  gap: 2px;
  border-top: 1px solid rgba(255,255,255,.1);
}

.ntab {
  color: rgba(255,255,255,.75);
  padding: 9px 15px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  background: none;
  border-radius: 8px 8px 0 0;
  white-space: nowrap;
  cursor: pointer;
  font-family: var(--fb);
  transition: all .18s;
}

.ntab:hover {
  color: #fff;
  background: rgba(255,255,255,.1);
}

.ntab.hl-g {
  background: var(--green);
  color: #fff;
  font-weight: 600;
}

.ntab.hl-w {
  background: var(--warn);
  color: #fff;
  font-weight: 600;
}
</style>