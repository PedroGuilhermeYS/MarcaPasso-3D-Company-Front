<template>
  <div class="app">

    <!-- ══ BREADCRUMB ══ -->
    <div class="breadcrumb">
      <span>Home</span>
      <span class="sep"><span class="material-symbols-outlined">chevron_right</span></span>
      <span class="atual">Personalizar Produto</span>
    </div>

    <!-- ══ MAIN LAYOUT ══ -->
    <div class="container">

      <!-- COLUNA ESQUERDA -->
      <div class="col-form">

        <!-- 1. Sobre o pedido -->
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/>
              </svg>
            </div>
            <div>
              <div class="card-title">Sobre o pedido</div>
              <div class="card-subtitle">Diga o que você quer que seja criado</div>
            </div>
          </div>
          <div class="card-body">

            <div class="campo">
              <label class="campo-label">Nome do pedido <span class="obrig">*</span></label>
              <input class="campo-input" type="text" placeholder="Ex: Vaso hexagonal do João, Chaveiro da Mari…" />
              <div class="campo-hint">Um apelido ou nome para identificar facilmente seu pedido.</div>
            </div>

            <div class="campo">
              <label class="campo-label">Descrição do que você quer <span class="obrig">*</span></label>
              <textarea class="campo-textarea" placeholder="Ex: Quero um vaso com formato hexagonal, com meu nome gravado na base. Serve para colocar plantas pequenas na janela…"></textarea>
              <div class="campo-hint">Quanto mais detalhe, melhor o orçamento! Descreva forma, estilo e para que vai usar.</div>
            </div>

            <div class="campo">
              <label class="campo-label">Finalidade</label>
              <textarea class="campo-textarea campo-textarea--sm" placeholder="Ex: Presente de aniversário, decoração da sala, uso no escritório…"></textarea>
              <div class="campo-hint">Opcional — nos ajuda a sugerir o melhor acabamento para o uso.</div>
            </div>

            <div class="campo-row">
              <div class="campo">
                <label class="campo-label">Tamanho aproximado</label>
                <input class="campo-input" type="text" placeholder="Ex: 20cm de altura, 15x10cm…" />
                <div class="campo-hint">Digite as dimensões que imagina.</div>
              </div>
              <div class="campo">
                <label class="campo-label">Quantidade</label>
                <input class="campo-input" type="number" min="1" value="1" />
              </div>
            </div>

            <div class="campo">
              <label class="campo-label">Cor ou cores desejadas</label>
              <input class="campo-input" type="text" placeholder="Ex: Azul marinho, branco fosco, preto com detalhes dourados…" />
              <div class="campo-hint">Pode informar mais de uma cor ou padrões como "degradê" ou "arco-íris".</div>
            </div>

          </div>
        </div>

        <!-- 2. Foto de referência -->
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div>
              <div class="card-title">Foto de referência</div>
              <div class="card-subtitle">Mostre o que você tem em mente (opcional)</div>
            </div>
          </div>
          <div class="card-body">
            <div class="upload-area">
              <input type="file" accept="image/*" multiple class="upload-input" />
              <div class="upload-icone">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="#2C18A0" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              </div>
              <div class="upload-titulo">Clique ou arraste suas fotos aqui</div>
              <div class="upload-sub">Imagens que mostrem o estilo ou design que você deseja</div>
              <div class="upload-tipos">PNG, JPG, WEBP · Até 10 MB por foto · Máx. 5 fotos</div>
            </div>
          </div>
        </div>

        <!-- 3. Contato e prazo -->
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <div class="card-title">Contato e prazo</div>
              <div class="card-subtitle">Para enviarmos seu orçamento</div>
            </div>
          </div>
          <div class="card-body">

            <div class="campo-row">
              <div class="campo">
                <label class="campo-label">Nome completo <span class="obrig">*</span></label>
                <input class="campo-input" type="text" placeholder="João Silva" />
              </div>
              <div class="campo">
                <label class="campo-label">WhatsApp <span class="obrig">*</span></label>
                <input class="campo-input" type="tel" placeholder="(81) 99999-9999" />
              </div>
            </div>

            <div class="campo">
              <label class="campo-label">Prazo desejado (em dias)</label>
              <input class="campo-input" type="number" min="10" placeholder="Mínimo 10 dias" />
              <div class="campo-hint">O prazo mínimo de produção é de <strong>10 dias corridos</strong> após aprovação do orçamento.</div>
            </div>

          </div>
        </div>

      </div>

      <!-- COLUNA DIREITA — resumo -->
      <div class="col-resumo">
        <div class="card painel">

          <div class="painel-header">
            <div class="painel-titulo">Resumo do pedido</div>
            <div class="painel-sub">Confira antes de enviar</div>
          </div>

          <div class="painel-body">

            <div class="resumo-linha">
              <span class="resumo-lbl">Nome do produto</span>
              <span class="resumo-val vazio">Não informado</span>
            </div>
            <div class="resumo-linha">
              <span class="resumo-lbl">Tamanho</span>
              <span class="resumo-val vazio">Não informado</span>
            </div>
            <div class="resumo-linha">
              <span class="resumo-lbl">Quantidade</span>
              <span class="resumo-val">1 unidade</span>
            </div>
            <div class="resumo-linha">
              <span class="resumo-lbl">Nome do cliente</span>
              <span class="resumo-val vazio">Não informado</span>
            </div>
            <div class="resumo-linha resumo-linha--last">
              <span class="resumo-lbl">WhatsApp</span>
              <span class="resumo-val vazio">Não informado</span>
            </div>

            <div class="aviso-orcamento">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2C18A0" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="aviso-icon">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>
                O valor final será calculado pela nossa equipe após análise. Você recebe o orçamento pelo WhatsApp em até <strong>24 horas</strong>. Prazo mínimo de produção: <strong>10 dias</strong>.
              </span>
            </div>

            <button class="btn-enviar" disabled>
              <svg viewBox="0 0 24 24" width="17" height="17" stroke="#8f9db8" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Enviar pedido
            </button>

            <button class="btn-cancelar">Cancelar</button>

            <div class="seguranca">
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="#8f9db8" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Seus dados estão protegidos
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// sem lógica por enquanto
</script>

<style scoped>
.app {
  font-family: 'DM Sans', sans-serif;
  background: #f7f9fc;
  color: #252f4a;
  min-height: 100vh;
}

/* ── BREADCRUMB ── */
.breadcrumb {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 28px 0;
  font-size: 13px;
  color: #8f9db8;
  display: flex;
  gap: 6px;
}
.sep { color: #ccc; }
.atual { color: #252f4a; font-weight: 500; }

/* ── LAYOUT ── */
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 28px 60px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.col-form { display: flex; flex-direction: column; }

/* ── CARD ── */
.card {
  background: #fff;
  border: 1px solid #e4e9f2;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(17, 71, 152, 0.07);
  margin-bottom: 20px;
}
.card:last-child { margin-bottom: 0; }

.card-header {
  padding: 16px 22px;
  border-bottom: 1px solid #eef1f8;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2C18A0, #114798);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-title {
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #141824;
}
.card-subtitle { font-size: 12px; color: #8f9db8; margin-top: 2px; }

.card-body { padding: 22px; }

/* ── CAMPOS ── */
.campo { margin-bottom: 18px; }
.campo:last-child { margin-bottom: 0; }

.campo-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #8f9db8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 7px;
}
.obrig { color: #d63031; margin-left: 2px; }

.campo-input,
.campo-textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #d6dcea;
  border-radius: 10px;
  font-size: 14px;
  color: #252f4a;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
  background: #fff;
  font-family: inherit;
}
.campo-input:focus,
.campo-textarea:focus {
  border-color: #114798;
  box-shadow: 0 0 0 3px rgba(17, 71, 152, 0.1);
}

.campo-textarea {
  resize: vertical;
  min-height: 110px;
  line-height: 1.6;
}
.campo-textarea--sm { min-height: 70px; }

.campo-hint { font-size: 11.5px; color: #8f9db8; margin-top: 5px; line-height: 1.5; }

.campo-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;
}

/* ── UPLOAD ── */
.upload-area {
  border: 2px dashed #d6dcea;
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  background: #fafbfd;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}
.upload-area:hover { border-color: #114798; background: #f0f4ff; }

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.upload-icone {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, rgba(44, 24, 160, 0.1), rgba(17, 71, 152, 0.12));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.upload-titulo { font-weight: 600; font-size: 14px; color: #252f4a; margin-bottom: 5px; }
.upload-sub    { font-size: 12.5px; color: #8f9db8; line-height: 1.5; }
.upload-tipos  { font-size: 11px; color: #8f9db8; margin-top: 8px; }

/* ── PAINEL RESUMO ── */
.col-resumo { position: sticky; top: 20px; }

.painel-header {
  padding: 18px 22px;
  background: linear-gradient(135deg, #2C18A0, #114798);
  color: #fff;
}
.painel-titulo { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; }
.painel-sub    { font-size: 12px; color: rgba(255, 255, 255, 0.7); margin-top: 3px; }

.painel-body { padding: 20px; }

.resumo-linha {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 13px;
  padding: 10px 0;
  border-bottom: 1px solid #eef1f8;
  gap: 12px;
}
.resumo-linha--last { border-bottom: none; }

.resumo-lbl { color: #8f9db8; flex-shrink: 0; }
.resumo-val { color: #252f4a; font-weight: 500; text-align: right; }
.resumo-val.vazio { color: #d6dcea; font-style: italic; }

.aviso-orcamento {
  background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
  border: 1.5px solid #c8d6f5;
  border-radius: 10px;
  padding: 14px 16px;
  margin: 16px 0;
  font-size: 13px;
  color: #114798;
  line-height: 1.6;
  display: flex;
  gap: 10px;
}
.aviso-icon { flex-shrink: 0; margin-top: 1px; }

/* ── BOTÕES ── */
.btn-enviar {
  width: 100%;
  padding: 15px;
  background: #d6dcea;
  color: #8f9db8;
  border: none;
  border-radius: 10px;
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: not-allowed;
  margin-top: 16px;
  letter-spacing: 0.03em;
  transition: all 0.18s;
}
.btn-enviar:not(:disabled) {
  background: linear-gradient(135deg, #037a64, #049377);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(4, 147, 119, 0.35);
}
.btn-enviar:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(4, 147, 119, 0.45);
}

.btn-cancelar {
  width: 100%;
  margin-top: 10px;
  padding: 11px;
  background: none;
  color: #8f9db8;
  border: 1.5px solid #d6dcea;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-cancelar:hover { border-color: #d63031; color: #d63031; }

.seguranca {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 11.5px;
  color: #8f9db8;
}
</style>