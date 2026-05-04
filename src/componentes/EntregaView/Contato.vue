<script setup>
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
</script>

<template>
  <div class="sec">
    <div class="sec-hd">
      <div class="sec-hd-left">
        <div class="sec-icon">
          <span class="material-symbols-outlined icon">person</span>
        </div>
        <span class="sec-title">Informações de Contato</span>
      </div>
    </div>

    <div class="sec-body">
      <div class="contact-row">

        <div class="contact-item">
          <span class="material-symbols-outlined contact-icon user">person</span>
          <div class="contact-info">
            <span class="contact-label">Nome</span>
            <span class="contact-value">{{ authStore.usuario?.nome ?? '—' }}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="contact-item">
          <span class="material-symbols-outlined contact-icon email">mail</span>
          <div class="contact-info">
            <span class="contact-label">E-mail</span>
            <span class="contact-value">{{ authStore.usuario?.email ?? '—' }}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="contact-item">
          <span class="material-symbols-outlined contact-icon cpf">badge</span>
          <div class="contact-info">
            <span class="contact-label">Telefone</span>
            <span class="contact-value">{{ authStore.usuario?.telefone ?? '—' }}</span>
          </div>
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

.sec-icon .icon {
  font-size: 18px;
  color: #fff;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.sec-title {
  font-family: 'Source Sans 3', var(--font-family-base), sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #141824;
}

.sec-body {
  padding: 20px 22px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 14px 18px;
  border: 1.5px solid #d6dcea;
  border-radius: 10px;
  background: #fff;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.divider {
  width: 1px;
  height: 36px;
  background: #e4e9f2;
  margin: 0 20px;
  flex-shrink: 0;
}

.contact-icon {
  font-size: 20px;
  flex-shrink: 0;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.user  { color: #3f51b5; }
.email { color: #009688; }
.cpf   { color: #ff9800; }

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7a9a;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.contact-value {
  font-size: 14px;
  font-weight: 700;
  color: #141824;
}
</style>