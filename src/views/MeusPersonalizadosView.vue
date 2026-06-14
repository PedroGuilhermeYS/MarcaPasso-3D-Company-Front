<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePersonalizadoStore } from '@/stores/usePersonalizadoStore'

const store = usePersonalizadoStore()
const selecionadoId = ref(null)
const fotoAtiva = ref(0)
const filtroStatus = ref('TODOS')

onMounted(async () => {
  await store.carregarPedidos()
})

async function selecionarPedido(id) {
  if (selecionadoId.value === id) return
  selecionadoId.value = id
  fotoAtiva.value = 0
  await store.carregarDetalhe(id)
}

function formatarData(dataStr) {
  if (!dataStr) return '—'
  const d = new Date(dataStr)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_LABELS = {
  AGUARDANDO_ORCAMENTO: 'Aguardando orçamento',
  ORCAMENTO_ENVIADO:    'Orçamento enviado',
  APROVADO:             'Aprovado',
  EM_PRODUCAO:          'Em produção',
  CONCLUIDO:            'Concluído',
  CANCELADO:            'Cancelado',
}

const STATUS_CLASS = {
  AGUARDANDO_ORCAMENTO: 'st-aguardando',
  ORCAMENTO_ENVIADO:    'st-orcamento',
  APROVADO:             'st-aprovado',
  EM_PRODUCAO:          'st-producao',
  CONCLUIDO:            'st-concluido',
  CANCELADO:            'st-cancelado',
}

const statusLabel = (s) => STATUS_LABELS[s] ?? s
const statusClass = (s) => STATUS_CLASS[s] ?? ''

// ── Filtros ──────────────────────────────────────────────────

const FILTROS = [
  { valor: 'TODOS',               label: 'Todos' },
  { valor: 'AGUARDANDO_ORCAMENTO', label: 'Aguardando orçamento' },
  { valor: 'ORCAMENTO_ENVIADO',   label: 'Orçamento enviado' },
  { valor: 'APROVADO',            label: 'Aprovado' },
  { valor: 'EM_PRODUCAO',         label: 'Em produção' },
  { valor: 'CONCLUIDO',           label: 'Concluído' },
  { valor: 'CANCELADO',           label: 'Cancelado' },
]

const pedidosFiltrados = computed(() => {
  if (filtroStatus.value === 'TODOS') return store.pedidos
  return store.pedidos.filter(p => p.status === filtroStatus.value)
})

const totalPedidos = computed(() => store.pedidos.length)

const pedido = computed(() => store.pedidoDetalhe)

const temFotos = computed(() =>
  pedido.value?.fotosReferencia?.length > 0
)
</script>

<template>
  <main class="users mp-main">

    <!-- Cabeçalho -->
    <div class="page-head">
      <h1 class="page-titulo">Meus Pedidos Personalizados</h1>
    </div>

    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span>Home</span>
      <span class="sep"><span class="material-symbols-outlined">chevron_right</span></span>
      <span class="atual">Pedidos Personalizados</span>
    </div>

    <!-- Layout: lista (esq) + painel (dir) -->
    <div class="layout-dois">

      <!-- ── Coluna lista ── -->
      <div class="coluna-lista">

        <!-- Stat único -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon icon-purple">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="#2C18A0" fill="none"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/>
              </svg>
            </div>
            <div>
              <div class="stat-num">{{ totalPedidos }}</div>
              <div class="stat-lbl">Total de personalizações</div>
            </div>
          </div>
        </div>

        <!-- Card da lista -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Histórico de pedidos</div>
          </div>

          <!-- ── Filtros de status ── -->
          <div class="filtros-wrap">
            <button
              v-for="f in FILTROS"
              :key="f.valor"
              class="filtro-btn"
              :class="{ ativo: filtroStatus === f.valor }"
              @click="filtroStatus = f.valor"
            >
              {{ f.label }}
            </button>
          </div>

          <div v-if="store.carregando" class="estado-info">
            <span class="spinner"></span>
            <p>Carregando pedidos...</p>
          </div>

          <div v-else-if="store.erro" class="estado-erro">
            <p>{{ store.erro }}</p>
          </div>

          <div v-else-if="!pedidosFiltrados.length" class="estado-vazio">
            <svg viewBox="0 0 24 24"><polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/></svg>
            <p>
              {{ filtroStatus === 'TODOS'
                  ? 'Você ainda não tem pedidos personalizados.'
                  : `Nenhum pedido com o status "${statusLabel(filtroStatus)}".` }}
            </p>
          </div>

          <div
            v-for="p in pedidosFiltrados"
            :key="p.id"
            class="pedido-item"
            :class="{ selecionado: selecionadoId === p.id }"
            @click="selecionarPedido(p.id)"
            role="button"
          >
            <div class="pedido-icone">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="#2C18A0" fill="none"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/>
              </svg>
            </div>
            <div class="pedido-info">
              <div class="pedido-num">{{ p.nomePedido }}</div>
              <div class="pedido-data">{{ formatarData(p.criadoEm) }}</div>
              <div class="pedido-sub" v-if="p.descricao">{{ p.descricao }}</div>
            </div>
            <div class="pedido-direita">
              <span class="status" :class="statusClass(p.status)">{{ statusLabel(p.status) }}</span>
              <div class="pedido-qtd">{{ p.quantidade }} un.</div>
            </div>
            <span class="pedido-seta">
              <span class="material-symbols-outlined">chevron_right</span>
            </span>
          </div>
        </div>

      </div>

      <!-- ── Coluna painel ── -->
      <div class="coluna-painel">
        <div class="card painel-card">

          <!-- Cabeçalho do painel -->
          <div class="detalhe-header">
            <div class="header-esq">
              <div class="detalhe-titulo">Detalhes do Pedido</div>
              <div class="detalhe-sub">{{ pedido?.nomePedido ?? 'Selecione um pedido' }}</div>
            </div>
            <span v-if="pedido" class="badge" :class="statusClass(pedido.status)">
              {{ statusLabel(pedido.status) }}
            </span>
          </div>

          <!-- Carregando -->
          <div v-if="store.carregandoDetalhe" class="loading-wrap">
            <span class="spinner"></span>
            <p>Carregando detalhes...</p>
          </div>

          <!-- Vazio -->
          <div v-else-if="!pedido" class="painel-vazio">
            <svg viewBox="0 0 24 24">
              <polyline points="12 2 22 6.5 22 17.5 12 22 2 17.5 2 6.5 12 2"/>
            </svg>
            <p>Clique em um pedido<br>para ver os detalhes</p>
          </div>

          <!-- Conteúdo -->
          <template v-else>

            <!-- Galeria de fotos (só se tiver fotos) -->
            <div v-if="temFotos" class="det-secao det-secao--fotos">
              <div class="det-secao-titulo">Fotos de referência</div>

              <!-- Foto principal -->
              <div class="foto-principal-wrap">
                <img
                  :src="pedido.fotosReferencia[fotoAtiva]"
                  :alt="'Foto ' + (fotoAtiva + 1)"
                  class="foto-principal"
                />
              </div>

              <!-- Miniaturas (se > 1 foto) -->
              <div v-if="pedido.fotosReferencia.length > 1" class="fotos-thumbs">
                <button
                  v-for="(url, i) in pedido.fotosReferencia"
                  :key="i"
                  class="thumb-btn"
                  :class="{ ativa: fotoAtiva === i }"
                  @click="fotoAtiva = i"
                >
                  <img :src="url" :alt="'Miniatura ' + (i + 1)" class="thumb-img" />
                </button>
              </div>
            </div>

            <!-- Sobre o pedido -->
            <div class="det-secao">
              <div class="det-secao-titulo">Sobre o pedido</div>
              <div class="det-linha">
                <span class="det-lbl">Nome</span>
                <span class="det-val">{{ pedido.nomePedido }}</span>
              </div>
              <div class="det-linha det-linha--desc">
                <span class="det-lbl">Descrição</span>
                <span class="det-val det-val--desc">{{ pedido.descricao }}</span>
              </div>
              <div v-if="pedido.finalidade" class="det-linha">
                <span class="det-lbl">Finalidade</span>
                <span class="det-val">{{ pedido.finalidade }}</span>
              </div>
              <div v-if="pedido.tamanho" class="det-linha">
                <span class="det-lbl">Tamanho</span>
                <span class="det-val">{{ pedido.tamanho }}</span>
              </div>
              <div class="det-linha">
                <span class="det-lbl">Quantidade</span>
                <span class="det-val">{{ pedido.quantidade }} unidade(s)</span>
              </div>
              <div v-if="pedido.cores" class="det-linha">
                <span class="det-lbl">Cores</span>
                <span class="det-val">{{ pedido.cores }}</span>
              </div>
            </div>

            <!-- Contato e prazo -->
            <div class="det-secao">
              <div class="det-secao-titulo">Contato e prazo</div>
              <div class="det-linha">
                <span class="det-lbl">Nome do cliente</span>
                <span class="det-val">{{ pedido.nomeCliente }}</span>
              </div>
              <div class="det-linha">
                <span class="det-lbl">WhatsApp</span>
                <span class="det-val">{{ pedido.whatsapp }}</span>
              </div>
              <div v-if="pedido.prazoDesejadoDias" class="det-linha">
                <span class="det-lbl">Prazo desejado</span>
                <span class="det-val">{{ pedido.prazoDesejadoDias }} dias</span>
              </div>
              <div class="det-linha">
                <span class="det-lbl">Enviado em</span>
                <span class="det-val">{{ formatarData(pedido.criadoEm) }}</span>
              </div>
            </div>

            <!-- Status -->
            <div class="det-secao det-secao--last">
              <div class="det-secao-titulo">Situação do pedido</div>
              <div class="status-bloco" :class="statusClass(pedido.status)">
                <span class="status-bloco-label">{{ statusLabel(pedido.status) }}</span>
                <span class="status-bloco-hint">{{
                  {
                    AGUARDANDO_ORCAMENTO: 'Nossa equipe está analisando seu pedido e entrará em contato pelo WhatsApp em até 24 horas.',
                    ORCAMENTO_ENVIADO:    'O orçamento foi enviado para o seu WhatsApp. Aguardando sua aprovação.',
                    APROVADO:             'Pedido aprovado! Em breve iniciamos a produção.',
                    EM_PRODUCAO:          'Seu pedido está sendo produzido com carinho.',
                    CONCLUIDO:            'Pedido concluído. Obrigado pela preferência!',
                    CANCELADO:            'Este pedido foi cancelado.',
                  }[pedido.status] ?? ''
                }}</span>
              </div>
            </div>

          </template>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200..900&display=swap');

.mp-main {
  color: #252f4a;
}

/* ── Cabeçalho ── */
.page-titulo {
  font-family: 'Source Sans 3', sans-serif;
  padding: 0 28px;
  font-size: 26px;
  font-weight: 700;
  color: #141824;
  margin: 0;
}

/* ── Breadcrumb ── */
.breadcrumb {
  padding: 14px 28px;
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: #9aa3bb;
}
.breadcrumb .sep  { color: #cbd2e0; }
.breadcrumb .atual { color: #252f4a; font-weight: 600; }

/* ── Stat ── */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-bottom: 16px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e4e9f2;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 10px rgba(17,71,152,.07);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-purple { background: #eeeffe; }

.stat-num {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #141824;
}
.stat-lbl {
  font-size: 12px;
  color: #8f9db8;
  margin-top: 2px;
}

/* ── Layout ── */
.layout-dois {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  align-items: start;
}
.coluna-lista { display: flex; flex-direction: column; }

/* ── Card ── */
.card {
  background: #fff;
  border: 1px solid #e4e9f2;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(17,71,152,.07);
}

/* ── Painel ── */
.coluna-painel { position: sticky; top: 20px; }
.painel-card {
  overflow: visible;
  max-height: 88vh;
  overflow-y: auto;
}

/* ── Header da lista ── */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  border-bottom: 1px solid #eef1f8;
}
.card-title {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #141824;
}

/* ── Filtros ── */
.filtros-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 22px;
  border-bottom: 1px solid #eef1f8;
  background: #f7f9fc;
}

.filtro-btn {
  background: #fff;
  border: 1.5px solid #e4e9f2;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7a9a;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}
.filtro-btn:hover {
  border-color: #2C18A0;
  color: #2C18A0;
}
.filtro-btn.ativo {
  background: #2C18A0;
  border-color: #2C18A0;
  color: #fff;
}

/* ── Item da lista ── */
.pedido-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 22px;
  border-bottom: 1px solid #eef1f8;
  cursor: pointer;
  transition: background .15s;
}
.pedido-item:last-child { border-bottom: none; }
.pedido-item:hover { background: #f7f9fc; }
.pedido-item.selecionado {
  background: #f0f4ff;
  border-left: 3px solid #2C18A0;
  padding-left: 19px;
}

.pedido-icone {
  width: 42px;
  height: 42px;
  background: #eef1f8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pedido-info { flex: 1; min-width: 0; }
.pedido-num {
  font-size: 13px;
  font-weight: 700;
  color: #2C18A0;
  margin-bottom: 2px;
  font-family: 'Source Sans 3', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pedido-data { font-size: 12px; color: #8f9db8; }
.pedido-sub {
  font-size: 12px;
  color: #6b7a9a;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pedido-direita { text-align: right; flex-shrink: 0; }
.pedido-qtd { font-size: 12px; color: #8f9db8; margin-top: 4px; }

.pedido-seta { color: #d6dcea; font-size: 18px; line-height: 1; flex-shrink: 0; }

/* ── Status badges ── */
.status, .badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.st-aguardando { background: #fff8ee; color: #c35a00; }
.st-orcamento  { background: #e3f2fd; color: #1565c0; }
.st-aprovado   { background: #e8f5e9; color: #2e7d32; }
.st-producao   { background: #eeeffe; color: #2C18A0; }
.st-concluido  { background: #f3e5f5; color: #6a1b9a; }
.st-cancelado  { background: #ffebee; color: #b71c1c; }

/* ── Estados ── */
.estado-info,
.estado-vazio,
.estado-erro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  color: #8f9db8;
  font-size: 14px;
}
.estado-vazio svg {
  width: 40px; height: 40px;
  fill: none; stroke: #8f9db8;
  stroke-width: 1.5; opacity: .4;
}
.estado-erro { color: #d63031; }

/* ── Spinner ── */
.spinner {
  width: 28px; height: 28px;
  border: 3px solid #e4e9f2;
  border-top-color: #2C18A0;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg) } }

/* ══════════════════════════════
   PAINEL DE DETALHE
══════════════════════════════ */

.detalhe-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: linear-gradient(135deg, #2C18A0, #114798);
  color: #fff;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 1;
}
.detalhe-titulo {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
}
.detalhe-sub {
  font-size: 12px;
  color: rgba(255,255,255,.65);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.badge { font-size: 11px !important; padding: 4px 12px !important; flex-shrink: 0; }

/* ── Seções ── */
.det-secao {
  padding: 18px 22px;
  border-bottom: 1px solid #eef1f8;
}
.det-secao--last { border-bottom: none; }

.det-secao-titulo {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #2C18A0;
  margin-bottom: 14px;
}

/* ── Linhas ── */
.det-linha {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 13px;
  margin-bottom: 10px;
  gap: 12px;
}
.det-linha:last-child { margin-bottom: 0; }
.det-linha--desc { align-items: flex-start; }
.det-lbl { color: #8f9db8; font-size: 12px; white-space: nowrap; flex-shrink: 0; }
.det-val { color: #252f4a; font-weight: 500; text-align: right; }
.det-val--desc { text-align: right; line-height: 1.55; }

/* ── Galeria de fotos ── */
.det-secao--fotos { padding-bottom: 16px; }

.foto-principal-wrap {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 10px;
  overflow: hidden;
  background: #eef1f8;
  margin-bottom: 10px;
}
.foto-principal {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity .2s;
}

.fotos-thumbs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.thumb-btn {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  background: #eef1f8;
  transition: border-color .15s;
  flex-shrink: 0;
}
.thumb-btn.ativa  { border-color: #2C18A0; }
.thumb-btn:hover:not(.ativa) { border-color: #aab4cc; }
.thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ── Bloco de status ── */
.status-bloco {
  border-radius: 10px;
  padding: 14px 16px;
}
.st-aguardando.status-bloco { background: #fff8ee; }
.st-orcamento.status-bloco  { background: #e3f2fd; }
.st-aprovado.status-bloco   { background: #e8f5e9; }
.st-producao.status-bloco   { background: #eeeffe; }
.st-concluido.status-bloco  { background: #f3e5f5; }
.st-cancelado.status-bloco  { background: #ffebee; }

.status-bloco-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}
.st-aguardando .status-bloco-label { color: #c35a00; }
.st-orcamento  .status-bloco-label { color: #1565c0; }
.st-aprovado   .status-bloco-label { color: #2e7d32; }
.st-producao   .status-bloco-label { color: #2C18A0; }
.st-concluido  .status-bloco-label { color: #6a1b9a; }
.st-cancelado  .status-bloco-label { color: #b71c1c; }

.status-bloco-hint {
  font-size: 12px;
  color: #6b7a9a;
  line-height: 1.6;
}

/* ── Vazio / loading painel ── */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: #8f9db8;
  font-size: 14px;
}
.painel-vazio {
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #8f9db8;
  font-size: 14px;
  line-height: 1.6;
}
.painel-vazio svg {
  width: 48px; height: 48px;
  opacity: .35;
  fill: none;
  stroke-width: 1.5;
  stroke: #8f9db8;
}
</style>
