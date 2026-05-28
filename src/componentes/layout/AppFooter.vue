<script setup>
</script>

<template>
  <footer>
    <div class="ft-inner">
      <div>
        <div class="ft-brand">
          <div class="logo-cube">
            <span class="material-symbols-outlined">view_in_ar</span>
          </div>
          MarcaPasso 3D
        </div>
        <div class="ft-desc">Produtos únicos em impressão 3D premium. Decoração, acessórios e roupas personalizadas.</div>
      </div>
      <div class="ft-col">
        <div class="ft-col-title">Departamentos</div>
        <ul>
          <li>Home</li>
          <li>Contato</li>
          <li>Quem Somos</li>
          <li>Trocas e Devoluções</li>
          <li>Políticas de Privacidade</li>
        </ul>
      </div>
      <div class="ft-col">
        <div class="ft-col-title">Atendimento</div>
        <div class="ft-contact">
          <strong>WhatsApp:</strong> (81) 99707-6382<br>
          <strong>E-mail:</strong> MarcaPasso@company.com<br>
          <strong>Horário:</strong> Seg–Sex 9h30–19h · Sáb 9h30–13h
        </div>
      </div>
      <div class="ft-col">
        <div class="ft-col-title">Formas de Pagamento</div>
        <div class="ft-pays">
          <span class="ft-pay">PIX</span>
          <span class="ft-pay">VISA</span>
          <span class="ft-pay">MASTER</span>
          <span class="ft-pay">ELO</span>
          <span class="ft-pay">AMEX</span>
        </div>
      </div>
    </div>
    <div class="ft-bottom">
      MarcaPasso 3D Company · CNPJ 33.210.687/0009-89 · <a href="#" style="color:var(--green)">@MarcaPasso3D</a>
    </div>
  </footer>
</template>

<style scoped>
footer {
  margin-top: 5rem;
  background: var(--color-g900);
  color: #fff;
}

.information {
  background: rgba(255,255,255,.03);
  border-bottom: 1px solid rgba(255,255,255,.07);
  padding: 32px 28px;
}

.info-inner {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.info-text h3 {
  font-family: var(--font-family-head);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}

.info-text p {
  font-size: 13px;
  color: var(--color-g400);
  margin: 0;
}

.information form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.information input {
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.15);
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  font-family: var(--font-family-base);
  font-size: 13px;
  outline: none;
  width: 220px;
}

.information input::placeholder {
  color: rgba(255,255,255,.4);
}

.information input:focus {
  border-color: var(--color-brand-blue-l);
  background: rgba(255,255,255,.12);
}

.button-register {
  background: var(--color-brand-green);
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-family: var(--font-family-head);
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: all .2s;
}

.button-register:hover {
  background: var(--color-brand-green-l);
}

.ft-inner {
  max-width: 1300px;
  margin: 0 auto;
  padding: 44px 28px;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.5fr 1fr;
  gap: 32px;
}

.ft-brand {
  font-family: var(--fh);
  font-size: 19px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
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

.ft-desc {
  font-size: 13px;
  color: var(--color-g400);
  line-height: 1.7;
}

.ft-col-title {
  font-family: var(--fh);
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #fff;
}

.ft-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ft-col ul li {
  font-size: 13px;
  color: var(--color-g400);
  margin-bottom: 9px;
  cursor: pointer;
  transition: color .2s;
}

.ft-col ul li:hover {
  color: #fff;
}

.ft-contact {
  font-size: 13px;
  color: var(--color-g400);
  line-height: 1.9;
}

.ft-contact strong {
  color: #fff;
}

.ft-pays {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.ft-pay {
  background: rgba(255,255,255,.1);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
}

.ft-bottom {
  border-top: 1px solid rgba(255,255,255,.07);
  padding: 16px 28px;
  text-align: center;
  font-size: 12px;
  color: var(--color-g400);
  max-width: 1300px;
  margin: 0 auto;
}

.ft-bottom a {
  text-decoration: none;
  transition: opacity .2s;
}

.ft-bottom a:hover {
  opacity: .8;
}
</style>