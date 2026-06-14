<script setup>
import { ref, computed } from 'vue'
import { usePersonalizadoStore } from '@/stores/usePersonalizadoStore'
import { useSupabaseStorage } from '@/composables/useSupabaseStorage'

const personalizadoStore = usePersonalizadoStore()
const { uploadarImagem } = useSupabaseStorage()

// ── Estado do formulário ──────────────────────────────────────────────────────

const form = ref({
  nomePedido: '',
  descricao: '',
  finalidade: '',
  tamanho: '',
  quantidade: 1,
  cores: '',
  nomeCliente: '',
  whatsapp: '',
  prazoDesejadoDias: null,
})

const erros = ref({})
const fotos = ref([])          // [{ file, previa, publicUrl, status: 'pendente'|'enviando'|'ok'|'erro' }]
const arrastando = ref(false)
const uploadando = ref(false)
const progressoUpload = ref(0)
const enviado = ref(false)
const inputFoto = ref(null)

// ── Validação ─────────────────────────────────────────────────────────────────

const formularioValido = computed(() => {
  return (
    form.value.nomePedido.trim() &&
    form.value.descricao.trim() &&
    form.value.quantidade >= 1 &&
    form.value.nomeCliente.trim() &&
    form.value.whatsapp.trim() &&
    fotos.value.every(f => f.status !== 'enviando')
  )
})

function validar() {
  const e = {}
  if (!form.value.nomePedido.trim()) e.nomePedido = 'Nome do pedido é obrigatório'
  if (!form.value.descricao.trim()) e.descricao = 'Descrição é obrigatória'
  if (!form.value.quantidade || form.value.quantidade < 1) e.quantidade = 'Quantidade mínima é 1'
  if (!form.value.nomeCliente.trim()) e.nomeCliente = 'Nome completo é obrigatório'
  if (!form.value.whatsapp.trim()) e.whatsapp = 'WhatsApp é obrigatório'
  if (form.value.prazoDesejadoDias && form.value.prazoDesejadoDias < 10) {
    e.prazoDesejadoDias = 'Prazo mínimo é de 10 dias'
  }
  erros.value = e
  return Object.keys(e).length === 0
}

// ── Upload de fotos ───────────────────────────────────────────────────────────

function onSelecionarArquivos(e) {
  const arquivos = Array.from(e.target.files || [])
  adicionarArquivos(arquivos)
  e.target.value = ''
}

function onDrop(e) {
  arrastando.value = false
  const arquivos = Array.from(e.dataTransfer.files || []).filter(f =>
    f.type.startsWith('image/')
  )
  adicionarArquivos(arquivos)
}

function adicionarArquivos(arquivos) {
  const vagas = 5 - fotos.value.length
  if (vagas <= 0) return

  const novos = arquivos.slice(0, vagas)
  for (const arquivo of novos) {
    if (arquivo.size > 5 * 1024 * 1024) {
      erros.value.fotos = `"${arquivo.name}" excede 5 MB`
      continue
    }
    const previa = URL.createObjectURL(arquivo)
    fotos.value.push({ file: arquivo, previa, publicUrl: null, status: 'pendente' })
  }
}

function removerFoto(index) {
  URL.revokeObjectURL(fotos.value[index].previa)
  fotos.value.splice(index, 1)
}

async function uploadarTodasAsFotos() {
  const pendentes = fotos.value.filter(f => f.status === 'pendente')
  if (pendentes.length === 0) return

  uploadando.value = true
  progressoUpload.value = 0

  const total = pendentes.length
  let concluidas = 0

  for (const foto of pendentes) {
    foto.status = 'enviando'
    try {
      const { publicUrl } = await uploadarImagem(foto.file, 'personalizados')
      foto.publicUrl = publicUrl
      foto.status = 'ok'
    } catch (err) {
      foto.status = 'erro'
      erros.value.fotos = `Falha ao enviar "${foto.file.name}": ${err.message}`
      throw err
    } finally {
      concluidas++
      progressoUpload.value = Math.round((concluidas / total) * 100)
    }
  }

  uploadando.value = false
}

// ── Envio do pedido ───────────────────────────────────────────────────────────

async function enviarPedido() {
  if (!validar()) return

  // 1. Faz upload das fotos pendentes para o Supabase
  if (fotos.value.some(f => f.status === 'pendente')) {
    try {
      await uploadarTodasAsFotos()
    } catch {
      // erros.fotos já foi preenchido dentro de uploadarTodasAsFotos
      return
    }
  }

  // 2. Monta o DTO com as URLs públicas já geradas
  const fotosReferencia = fotos.value
    .filter(f => f.publicUrl)
    .map(f => f.publicUrl)

  const pedido = {
    nomePedido: form.value.nomePedido.trim(),
    descricao: form.value.descricao.trim(),
    finalidade: form.value.finalidade.trim() || null,
    tamanho: form.value.tamanho.trim() || null,
    quantidade: form.value.quantidade,
    cores: form.value.cores.trim() || null,
    fotosReferencia,
    nomeCliente: form.value.nomeCliente.trim(),
    whatsapp: form.value.whatsapp.trim(),
    prazoDesejadoDias: form.value.prazoDesejadoDias || null,
  }

  // 3. Envia para a API (que persiste no banco e dispara o Telegram)
  try {
    await personalizadoStore.criarPedido(pedido)
    enviado.value = true
  } catch {
    // erro já está em personalizadoStore.erro
  }
}

// ── Reiniciar ─────────────────────────────────────────────────────────────────

function reiniciar() {
  fotos.value.forEach(f => URL.revokeObjectURL(f.previa))
  fotos.value = []
  form.value = {
    nomePedido: '', descricao: '', finalidade: '', tamanho: '',
    quantidade: 1, cores: '', nomeCliente: '', whatsapp: '', prazoDesejadoDias: null,
  }
  erros.value = {}
  enviado.value = false
  personalizadoStore.erro = null
}
</script>

<template>
  <div class="app">

    <!-- ══ BREADCRUMB ══ -->
    <div class="breadcrumb">
      <span>Home</span>
      <span class="sep"><span class="material-symbols-outlined">chevron_right</span></span>
      <span class="atual">Personalizar Produto</span>
    </div>

    <!-- ══ SUCESSO ══ -->
    <div v-if="enviado" class="sucesso-wrap">
      <div class="sucesso-card">
        <div class="sucesso-icone">
          <span class="material-symbols-outlined icon">check_circle</span>
        </div>
        <div class="sucesso-titulo">Pedido enviado com sucesso!</div>
        <div class="sucesso-sub">
          Nossa equipe vai analisar e te enviar o orçamento pelo WhatsApp em até
          <strong>24 horas</strong>.
        </div>
        <button class="btn-novo" @click="reiniciar">Fazer outro pedido</button>
      </div>
    </div>

    <!-- ══ MAIN LAYOUT ══ -->
    <div v-else class="container">

      <!-- COLUNA ESQUERDA -->
      <div class="col-form">

        <!-- 1. Sobre o pedido -->
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <span class="material-symbols-outlined icon">inventory_2</span>
            </div>
            <div>
              <div class="card-title">Sobre o pedido</div>
              <div class="card-subtitle">Diga o que você quer que seja criado</div>
            </div>
          </div>
          <div class="card-body">

            <div class="campo">
              <label class="campo-label">Nome do pedido <span class="obrig">*</span></label>
              <input
                class="campo-input"
                :class="{ 'campo-input--erro': erros.nomePedido }"
                type="text"
                placeholder="Ex: Vaso hexagonal do João, Chaveiro da Mari…"
                v-model="form.nomePedido"
              />
              <div v-if="erros.nomePedido" class="campo-erro">{{ erros.nomePedido }}</div>
              <div v-else class="campo-hint">Um apelido ou nome para identificar facilmente seu pedido.</div>
            </div>

            <div class="campo">
              <label class="campo-label">Descrição do que você quer <span class="obrig">*</span></label>
              <textarea
                class="campo-textarea"
                :class="{ 'campo-input--erro': erros.descricao }"
                placeholder="Ex: Quero um vaso com formato hexagonal, com meu nome gravado na base. Serve para colocar plantas pequenas na janela…"
                v-model="form.descricao"
              ></textarea>
              <div v-if="erros.descricao" class="campo-erro">{{ erros.descricao }}</div>
              <div v-else class="campo-hint">Quanto mais detalhe, melhor o orçamento!</div>
            </div>

            <div class="campo">
              <label class="campo-label">Finalidade</label>
              <textarea
                class="campo-textarea campo-textarea--sm"
                placeholder="Ex: Presente de aniversário, decoração da sala, uso no escritório…"
                v-model="form.finalidade"
              ></textarea>
              <div class="campo-hint">Opcional — nos ajuda a sugerir o melhor acabamento para o uso.</div>
            </div>

            <div class="campo-row">
              <div class="campo">
                <label class="campo-label">Tamanho aproximado</label>
                <input class="campo-input" type="text" placeholder="Ex: 20cm de altura, 15x10cm…"
                  v-model="form.tamanho" />
                <div class="campo-hint">Digite as dimensões que imagina.</div>
              </div>
              <div class="campo">
                <label class="campo-label">Quantidade <span class="obrig">*</span></label>
                <input
                  class="campo-input"
                  :class="{ 'campo-input--erro': erros.quantidade }"
                  type="number"
                  min="1"
                  v-model.number="form.quantidade"
                />
                <div v-if="erros.quantidade" class="campo-erro">{{ erros.quantidade }}</div>
              </div>
            </div>

            <div class="campo">
              <label class="campo-label">Cor ou cores desejadas</label>
              <input class="campo-input" type="text"
                placeholder="Ex: Azul marinho, branco fosco, preto com detalhes dourados…"
                v-model="form.cores" />
              <div class="campo-hint">Pode informar mais de uma cor.</div>
            </div>

          </div>
        </div>

        <!-- 2. Foto de referência -->
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <span class="material-symbols-outlined icon">image</span>
            </div>
            <div>
              <div class="card-title">Foto de referência</div>
              <div class="card-subtitle">Mostre o que você tem em mente (opcional)</div>
            </div>
          </div>
          <div class="card-body">

            <!-- Área de drop -->
            <div
              class="upload-area"
              :class="{ 'upload-area--drag': arrastando, 'upload-area--cheio': fotos.length >= 5 }"
              @dragover.prevent="arrastando = true"
              @dragleave.prevent="arrastando = false"
              @drop.prevent="onDrop"
              @click="fotos.length < 5 && $refs.inputFoto.click()"
            >
              <input
                ref="inputFoto"
                type="file"
                accept="image/*"
                multiple
                class="upload-input"
                @change="onSelecionarArquivos"
              />
              <div class="upload-icone">
                <span class="material-symbols-outlined">cloud_upload</span>
              </div>
              <div class="upload-titulo">
                {{ fotos.length >= 5 ? 'Limite atingido (5 fotos)' : 'Clique ou arraste suas fotos aqui' }}
              </div>
              <div class="upload-sub">Imagens que mostrem o estilo ou design que você deseja</div>
              <div class="upload-tipos">PNG, JPG, WEBP · Até 5 MB por foto · Máx. 5 fotos</div>
            </div>

            <!-- Progresso de upload -->
            <div v-if="uploadando" class="upload-progresso">
              <div class="upload-progresso-bar" :style="{ width: progressoUpload + '%' }"></div>
              <span class="upload-progresso-txt">Enviando fotos… {{ progressoUpload }}%</span>
            </div>

            <!-- Prévia das fotos -->
            <div v-if="fotos.length > 0" class="fotos-grid">
              <div v-for="(foto, i) in fotos" :key="i" class="foto-item">
                <img :src="foto.previa" :alt="'Foto ' + (i + 1)" class="foto-img" />
                <div v-if="foto.status === 'enviando'" class="foto-overlay">
                  <span class="material-symbols-outlined spin">refresh</span>
                </div>
                <div v-else-if="foto.status === 'ok'" class="foto-check">
                  <span class="material-symbols-outlined">check_circle</span>
                </div>
                <button class="foto-remover" @click.stop="removerFoto(i)" title="Remover foto">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div v-if="erros.fotos" class="campo-erro" style="margin-top:8px">{{ erros.fotos }}</div>

          </div>
        </div>

        <!-- 3. Contato e prazo -->
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <span class="material-symbols-outlined icon">person</span>
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
                <input
                  class="campo-input"
                  :class="{ 'campo-input--erro': erros.nomeCliente }"
                  type="text"
                  placeholder="João Silva"
                  v-model="form.nomeCliente"
                />
                <div v-if="erros.nomeCliente" class="campo-erro">{{ erros.nomeCliente }}</div>
              </div>
              <div class="campo">
                <label class="campo-label">WhatsApp <span class="obrig">*</span></label>
                <input
                  class="campo-input"
                  :class="{ 'campo-input--erro': erros.whatsapp }"
                  type="tel"
                  placeholder="(81) 99999-9999"
                  v-model="form.whatsapp"
                />
                <div v-if="erros.whatsapp" class="campo-erro">{{ erros.whatsapp }}</div>
              </div>
            </div>

            <div class="campo">
              <label class="campo-label">Prazo desejado (em dias)</label>
              <input
                class="campo-input"
                :class="{ 'campo-input--erro': erros.prazoDesejadoDias }"
                type="number"
                min="10"
                placeholder="Mínimo 10 dias"
                v-model.number="form.prazoDesejadoDias"
              />
              <div v-if="erros.prazoDesejadoDias" class="campo-erro">{{ erros.prazoDesejadoDias }}</div>
              <div v-else class="campo-hint">
                O prazo mínimo de produção é de <strong>10 dias corridos</strong> após aprovação do orçamento.
              </div>
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
              <span class="resumo-val" :class="{ vazio: !form.nomePedido }">
                {{ form.nomePedido || 'Não informado' }}
              </span>
            </div>
            <div class="resumo-linha">
              <span class="resumo-lbl">Tamanho</span>
              <span class="resumo-val" :class="{ vazio: !form.tamanho }">
                {{ form.tamanho || 'Não informado' }}
              </span>
            </div>
            <div class="resumo-linha">
              <span class="resumo-lbl">Quantidade</span>
              <span class="resumo-val">{{ form.quantidade || 1 }} unidade(s)</span>
            </div>
            <div class="resumo-linha">
              <span class="resumo-lbl">Nome do cliente</span>
              <span class="resumo-val" :class="{ vazio: !form.nomeCliente }">
                {{ form.nomeCliente || 'Não informado' }}
              </span>
            </div>
            <div class="resumo-linha">
              <span class="resumo-lbl">WhatsApp</span>
              <span class="resumo-val" :class="{ vazio: !form.whatsapp }">
                {{ form.whatsapp || 'Não informado' }}
              </span>
            </div>
            <div class="resumo-linha resumo-linha--last">
              <span class="resumo-lbl">Fotos</span>
              <span class="resumo-val" :class="{ vazio: fotos.length === 0 }">
                {{ fotos.length > 0 ? fotos.length + ' foto(s)' : 'Nenhuma' }}
              </span>
            </div>

            <div class="aviso-orcamento">
              <span class="material-symbols-outlined aviso-icon">info</span>
              <span>
                O valor final será calculado após análise. Você recebe o orçamento pelo WhatsApp em até
                <strong>24 horas</strong>. Prazo mínimo de produção: <strong>10 dias</strong>.
              </span>
            </div>

            <!-- Erro geral -->
            <div v-if="personalizadoStore.erro" class="erro-envio">
              {{ personalizadoStore.erro }}
            </div>

            <button
              class="btn-enviar"
              :disabled="!formularioValido || personalizadoStore.carregando || uploadando"
              @click="enviarPedido"
            >
              <span v-if="!personalizadoStore.carregando && !uploadando" class="material-symbols-outlined"
                :style="{ color: formularioValido ? 'white' : '#8f9db8' }">
                send
              </span>
              <span v-else class="material-symbols-outlined spin" style="color: white">refresh</span>
              {{
                uploadando
                  ? 'Enviando fotos…'
                  : personalizadoStore.carregando
                    ? 'Enviando pedido…'
                    : 'Enviar pedido'
              }}
            </button>

            <button class="btn-cancelar" @click="$router.push('/')">Cancelar</button>

            <div class="seguranca">
              <span class="material-symbols-outlined">shield</span>
              Seus dados estão protegidos
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.app {
  font-family: var(--font-family-base);
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
.atual { color: #000; font-weight: 500; }

/* ── SUCESSO ── */
.sucesso-wrap {
  max-width: 480px;
  margin: 60px auto;
  padding: 0 28px;
}
.sucesso-card {
  background: #fff;
  border: 1px solid #e4e9f2;
  border-radius: 16px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(17,71,152,0.08);
}
.sucesso-icone {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #037a64, #049377);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.sucesso-titulo {
  font-family: var(--font-family-base);
  font-size: 20px;
  font-weight: 800;
  color: #141824;
  margin-bottom: 10px;
}
.sucesso-sub {
  font-size: 14px;
  color: #8f9db8;
  line-height: 1.7;
  margin-bottom: 28px;
}
.btn-novo {
  padding: 12px 28px;
  background: linear-gradient(135deg, #2C18A0, #114798);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: var(--font-family-base);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s;
}
.btn-novo:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(44,24,160,0.3); }

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
.card-title { font-family: var(--font-family-base); font-size: 14px; font-weight: 700; color: #141824; }
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
  box-sizing: border-box;
}
.campo-input:focus,
.campo-textarea:focus {
  border-color: #114798;
  box-shadow: 0 0 0 3px rgba(17, 71, 152, 0.1);
}
.campo-input--erro {
  border-color: #d63031 !important;
  box-shadow: 0 0 0 3px rgba(214,48,49,0.1) !important;
}
.campo-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }
.campo-textarea--sm { min-height: 70px; }
.campo-hint { font-size: 11.5px; color: #8f9db8; margin-top: 5px; line-height: 1.5; }
.campo-erro { font-size: 12px; color: #d63031; margin-top: 5px; }

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
.upload-area:hover:not(.upload-area--cheio) { border-color: #114798; background: #f0f4ff; }
.upload-area--drag { border-color: #114798; background: #eef3ff; }
.upload-area--cheio { cursor: not-allowed; opacity: 0.6; }

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  pointer-events: none; /* clique gerenciado via @click no div */
}
.upload-icone {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, rgba(44,24,160,0.1), rgba(17,71,152,0.12));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.upload-titulo { font-weight: 600; font-size: 14px; color: #252f4a; margin-bottom: 5px; }
.upload-sub    { font-size: 12.5px; color: #8f9db8; line-height: 1.5; }
.upload-tipos  { font-size: 11px; color: #8f9db8; margin-top: 8px; }

.upload-progresso {
  margin-top: 12px;
  background: #eef1f8;
  border-radius: 99px;
  height: 6px;
  overflow: hidden;
  position: relative;
}
.upload-progresso-bar {
  height: 100%;
  background: linear-gradient(90deg, #2C18A0, #049377);
  border-radius: 99px;
  transition: width 0.3s;
}
.upload-progresso-txt {
  display: block;
  font-size: 11px;
  color: #8f9db8;
  margin-top: 5px;
  text-align: center;
}

/* ── GRID DE FOTOS ── */
.fotos-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-top: 14px;
}
.foto-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  background: #eef1f8;
}
.foto-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.foto-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.foto-check {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 22px;
  height: 22px;
  background: #049377;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.foto-remover {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  background: rgba(214,48,49,0.85);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}
.foto-remover:hover { background: #d63031; }

/* ── PAINEL RESUMO ── */
.col-resumo { position: sticky; top: 20px; }
.painel-header {
  padding: 18px 22px;
  background: linear-gradient(135deg, #2C18A0, #114798);
  color: #fff;
}
.painel-titulo { font-family: var(--font-family-base); font-size: 15px; font-weight: 800; }
.painel-sub    { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 3px; }
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

.erro-envio {
  background: #fff0f0;
  border: 1.5px solid #f5c6c6;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #d63031;
  margin-bottom: 12px;
}

/* ── BOTÕES ── */
.btn-enviar {
  width: 100%;
  padding: 15px;
  background: #d6dcea;
  color: #8f9db8;
  border: none;
  border-radius: 10px;
  font-family: var(--font-family-base);
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
  box-shadow: 0 4px 20px rgba(4,147,119,0.35);
}
.btn-enviar:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(4,147,119,0.45);
}

.btn-cancelar {
  width: 100%;
  margin-top: 10px;
  padding: 11px;
  background: #fff;
  color: #d63031;
  border: 1.5px solid #d63031;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-cancelar:hover { background: #d63031; color: #fff; }

.seguranca {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 11.5px;
  color: #8f9db8;
}

/* ── SPIN ── */
@keyframes spin { to { transform: rotate(360deg) } }
.spin { animation: spin 0.8s linear infinite; transform-origin: center; }

.icon {
  font-size: 18px;
  color: #fff;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
