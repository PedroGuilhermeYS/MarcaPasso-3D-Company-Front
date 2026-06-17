<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LogoTop from '@/componentes/layout/AppNavbar.vue'
import { useProdutosStore } from '@/stores/useProdutosStore'
import { getTodosUsuariosNaApi } from '@/api/usuario/usuarioApi.js'
import { getTodosEncomendasAdminNaApi } from '@/api/encomenda'
import { useCupomStore } from '@/stores/useCupomStore'
import { useFretesStore } from '@/stores/useFretesStore'
import {
  getTodosPersonalizadosAdminNaApi,
  atualizarStatusPersonalizadoNaApi,
} from '@/api/personalizado'

const router = useRouter()
const produtosStore = useProdutosStore()
const cupomStore = useCupomStore()
const fretesStore = useFretesStore()

const usuarios = ref([])
const encomendas = ref([])
const personalizados = ref([])
const carregandoUsuarios = ref(false)
const carregandoEncomendas = ref(false)
const carregandoPersonalizados = ref(false)
const erroUsuarios = ref(null)
const erroEncomendas = ref(null)
const erroPersonalizados = ref(null)

// ── Aba ativa ────────────────────────────────────────────────
const abas = ['Produtos', 'Clientes', 'Cupons', 'Fretes', 'Personalizações']
const abaAtiva = ref('Produtos')

// ── Mapa de status: valor interno → label exibido ────────────
const STATUS_OPTIONS = [
  { valor: 'AGUARDANDO_ORCAMENTO', label: 'Aguardando orçamento' },
  { valor: 'ORCAMENTO_ENVIADO', label: 'Orçamento enviado' },
  { valor: 'APROVADO', label: 'Aprovado' },
  { valor: 'EM_PRODUCAO', label: 'Em produção' },
  { valor: 'CONCLUIDO', label: 'Concluído' },
  { valor: 'CANCELADO', label: 'Cancelado' },
]

const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map(o => [o.valor, o.label]))
const STATUS_CLASS = {
  AGUARDANDO_ORCAMENTO: 'st-aguardando',
  ORCAMENTO_ENVIADO: 'st-orcamento',
  APROVADO: 'st-aprovado',
  EM_PRODUCAO: 'st-producao',
  CONCLUIDO: 'st-concluido',
  CANCELADO: 'st-cancelado',
}

const statusLabel = (s) => STATUS_LABEL[s] ?? s
const statusClass = (s) => STATUS_CLASS[s] ?? ''

// ── Estado de edição de status (por pedido) ──────────────────
// Guarda o valor selecionado no <select> antes de salvar
const statusEditando = ref({})

function initStatusEditando(lista) {
  lista.forEach(p => {
    statusEditando.value[p.id] = p.status
  })
}

async function salvarStatus(pedido) {
  const novoStatus = statusEditando.value[pedido.id]
  if (!novoStatus || novoStatus === pedido.status) return
  try {
    const atualizado = await atualizarStatusPersonalizadoNaApi(pedido.id, novoStatus)
    const idx = personalizados.value.findIndex(p => p.id === pedido.id)
    if (idx !== -1) personalizados.value[idx] = atualizado
  } catch {
    alert('Erro ao atualizar status. Tente novamente.')
    statusEditando.value[pedido.id] = pedido.status // reverte
  }
}

// ── Estatísticas ─────────────────────────────────────────────
const totalProdutos = computed(() => produtosStore.produtos.length)

const faturamentoTotal = computed(() =>
  encomendas.value.reduce((soma, e) => soma + (e.total ?? 0), 0)
)

const formatarPreco = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatarData = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

// ── Ações produtos ───────────────────────────────────────────
const adicionarProduto = () => router.push({ name: 'AdicionarProdutos' })
const adicionarCupom = () => router.push({ name: 'AdicionarCupom' })
const adicionarFrete = () => router.push({ name: 'AdicionarFrete' })

const atualizarProduto = (id) =>
  router.push({ name: 'AtualizarProduto', params: { id } })

const removerProduto = async (id) => {
  if (!confirm('Deseja remover este produto?')) return
  try {
    await produtosStore.removerProduto(id)
  } catch {
    alert('Erro ao remover produto.')
  }
}

const atualizarCupom = (id) =>
  router.push({ name: 'AtualizarCupom', params: { id } })

const excluirCupom = async (id) => {
  if (!confirm('Deseja excluir este cupom?')) return
  try {
    await cupomStore.excluirCupom(id)
  } catch {
    alert('Erro ao excluir cupom.')
  }
}
 
const editarFrete = (id) =>
  router.push({ name: 'AtualizarFrete', params: { id } })
 
const excluirFrete = async (id) => {
  if (!confirm('Deseja excluir este frete?')) return
  try {
    await fretesStore.removerFrete(id)
  } catch {
    alert('Erro ao excluir frete.')
  }
}

// ── Carregamento inicial ─────────────────────────────────────
onMounted(async () => {
  await produtosStore.carregarProdutos()
  await cupomStore.carregarCupons()
  await fretesStore.carregarFretes()

  carregandoUsuarios.value = true
  try {
    usuarios.value = await getTodosUsuariosNaApi()
  } catch (e) {
    erroUsuarios.value = e?.message || 'Erro ao carregar clientes'
    console.error('Erro ao carregar usuários:', e)
  } finally {
    carregandoUsuarios.value = false
  }

  carregandoEncomendas.value = true
  try {
    encomendas.value = await getTodosEncomendasAdminNaApi()
  } catch (e) {
    erroEncomendas.value = e?.message || 'Erro ao carregar encomendas'
    console.error('Erro ao carregar encomendas:', e)
  } finally {
    carregandoEncomendas.value = false
  }

  carregandoPersonalizados.value = true
  try {
    personalizados.value = await getTodosPersonalizadosAdminNaApi()
    initStatusEditando(personalizados.value)
  } catch (e) {
    erroPersonalizados.value = e?.message || 'Erro ao carregar pedidos personalizados'
    console.error('Erro ao carregar personalizados:', e)
  } finally {
    carregandoPersonalizados.value = false
  }
})
</script>

<template>
  <LogoTop />

  <div class="painel">

    <!-- ── Cabeçalho ───────────────────────────────────────── -->
    <div class="cabecalho">
      <h1 class="titulo">Painel Administrativo</h1>
      <div class="cabecalho-acoes">
        <button class="btn-adicionar" @click="adicionarProduto">
          + Adicionar Produto
        </button>
        <button class="btn-adicionar" @click="adicionarCupom">
          + Adicionar Cupom
        </button>
        <button class="btn-adicionar" @click="adicionarFrete">
          + Adicionar Frete
        </button>
      </div>
    </div>

    <!-- ── Cards de estatísticas ─────────────────────────── -->
    <div class="cards-stats">

      <div class="card-stat">
        <span class="material-symbols-outlined stat-icone">
          inventory_2
        </span>
        <div>
          <p class="stat-label">Total de Produtos</p>
          <p class="stat-valor">{{ totalProdutos }}</p>
        </div>
      </div>

      <div class="card-stat">
        <span class="material-symbols-outlined stat-icone">
          group
        </span>
        <div>
          <p class="stat-label">Total de Clientes</p>
          <p class="stat-valor">{{ usuarios.length }}</p>
        </div>
      </div>

      <div class="card-stat">
        <span class="material-symbols-outlined stat-icone">
          local_offer
        </span>
        <div>
          <p class="stat-label">Total de Cupons</p>
          <p class="stat-valor">{{ cupomStore.cupons.length }}</p>
        </div>
      </div>

      <div class="card-stat">
        <span class="material-symbols-outlined stat-icone">
          local_shipping
        </span>
        <div>
          <p class="stat-label">Fretes Cadastrados</p>
          <p class="stat-valor">{{ fretesStore.fretes.length }}</p>
        </div>
      </div>

      <div class="card-stat">
        <span class="material-symbols-outlined stat-icone">
          print
        </span>
        <div>
          <p class="stat-label">Pedidos Personalizados</p>
          <p class="stat-valor">{{ personalizados.length }}</p>
        </div>
      </div>

    </div>

    <!-- ── Abas ─────────────────────────────────────────────── -->
    <div class="abas">
      <button v-for="aba in abas" :key="aba" class="aba-btn" :class="{ ativa: abaAtiva === aba }"
        @click="abaAtiva = aba">
        {{ aba }}
      </button>
    </div>

    <!-- ══════════════════ ABA: PRODUTOS ════════════════════ -->
    <div v-if="abaAtiva === 'Produtos'">
      <div v-if="produtosStore.carregando" class="estado-vazio">
        Carregando produtos…
      </div>

      <div v-else-if="produtosStore.produtos.length === 0" class="estado-vazio">
        Nenhum produto cadastrado.
      </div>

      <div v-else class="tabela-wrapper">
        <table class="tabela">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Categoria</th>
              <th>Personalizável</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="produto in produtosStore.produtos" :key="produto.id">
              <td>
                <img :src="produto.imagemPrincipal || '/imagem-produtos/placeholder.jpg'" :alt="produto.nome"
                  class="img-produto" />
              </td>
              <td class="nome-cel">{{ produto.nome }}</td>
              <td>{{ formatarPreco(produto.preco ?? 0) }}</td>
              <td>
                <span class="badge categoria">{{ produto.categoria || '—' }}</span>
              </td>
              <td>
                <span class="badge" :class="produto.personalizavel ? 'sim' : 'nao'">
                  {{ produto.personalizavel ? 'Sim' : 'Não' }}
                </span>
              </td>
              <td>
                <div class="acoes-cel">
                  <button class="btn-acao azul" @click="atualizarProduto(produto.id)">
                    Editar
                  </button>
                  <button class="btn-acao vermelho" @click="removerProduto(produto.id)">
                    Remover
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════════════ ABA: CLIENTES ════════════════════ -->
    <div v-if="abaAtiva === 'Clientes'">
      <div v-if="carregandoUsuarios" class="estado-vazio">
        Carregando clientes…
      </div>

      <div v-else-if="usuarios.length === 0" class="estado-vazio">
        Nenhum cliente encontrado.
      </div>
 
      <div v-else class="tabela-wrapper">
        <table class="tabela">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>CPF</th>
              <th>Perfil</th>
              <th>Situação</th>
              <th>Cadastro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td class="id-cel">{{ usuario.id }}</td>
              <td class="nome-cel">{{ usuario.nome || '—' }}</td>
              <td>{{ usuario.email }}</td>
              <td>{{ usuario.telefone || '—' }}</td>
              <td>{{ usuario.cpf || '—' }}</td>
              <td>
                <span class="badge" :class="usuario.role === 'ADMIN' ? 'admin' : 'user'">
                  {{ usuario.role }}
                </span>
              </td>
              <td>
                <span class="badge" :class="usuario.ativo ? 'sim' : 'nao'">
                  {{ usuario.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td>{{ formatarData(usuario.criadoEm) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════════════ ABA: CUPONS ════════════════════ -->
    <div v-if="abaAtiva === 'Cupons'">
      <div v-if="cupomStore.carregando" class="estado-vazio">
        Carregando cupons…
      </div>

      <div v-else-if="cupomStore.cupons.length === 0" class="estado-vazio">
        Nenhum cupom cadastrado.
      </div>

      <div v-else class="tabela-wrapper">
        <table class="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Desconto</th>
              <th>Validade</th>
              <th>Expiração</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cupom in cupomStore.cupons" :key="cupom.id">
              <td class="nome-cel">{{ cupom.nomeCupom }}</td>
              <td>
                <span class="badge categoria">{{ cupom.valorDesconto }}%</span>
              </td>
              <td>
                <span class="badge" :class="cupom.tipoValidade === 'TEMPORARIO' ? 'nao' : 'sim'">
                  {{ cupom.tipoValidade === 'TEMPORARIO' ? 'Temporário' : 'Indefinido' }}
                </span>
              </td>
              <td>{{ cupom.dataExpiracao ? formatarData(cupom.dataExpiracao) : 'Indefinido' }}</td>
              <td>
                <div class="acoes-cel">
                  <button class="btn-acao azul" @click="atualizarCupom(cupom.id)">
                    Editar
                  </button>
                  <button class="btn-acao vermelho" @click="excluirCupom(cupom.id)">
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
 
    <!-- ══════════════════ ABA: FRETES ════════════════════ -->
    <div v-if="abaAtiva === 'Fretes'">
      <div v-if="fretesStore.carregando" class="estado-vazio">
        Carregando fretes…
      </div>
 
      <div v-else-if="fretesStore.fretes.length === 0" class="estado-vazio">
        Nenhum frete cadastrado.
      </div>
 
      <div v-else class="tabela-wrapper">
        <table class="tabela">
          <thead>
            <tr>
              <th>#</th>
              <th>CEP</th>
              <th>Cidade</th>
              <th>Valor</th>
              <th>Prazo (dias)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="frete in fretesStore.fretes" :key="frete.id">
              <td class="id-cel">{{ frete.id }}</td>
              <td><span class="badge categoria">{{ frete.cep_entrega ?? frete.cepEntrega }}</span></td>
              <td class="nome-cel">{{ frete.cidade }}</td>
              <td>{{ formatarPreco(Number(frete.valor_frete ?? frete.valorFrete ?? 0)) }}</td>
              <td>{{ frete.prazo_entrega_dias ?? frete.prazoEntregaDias }} dias</td>
              <td>
                <div class="acoes-cel">
                  <button class="btn-acao azul" @click="editarFrete(frete.id)">
                    Editar
                  </button>
                  <button class="btn-acao vermelho" @click="excluirFrete(frete.id)">
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
 
    <!-- ══════════════ ABA: PERSONALIZAÇÕES ══════════════════ -->
    <div v-if="abaAtiva === 'Personalizações'">
      <div v-if="carregandoPersonalizados" class="estado-vazio">
        Carregando pedidos personalizados…
      </div>

      <div v-else-if="erroPersonalizados" class="estado-vazio" style="color:#d63031; border-color:#d63031">
        {{ erroPersonalizados }}
      </div>

      <div v-else-if="personalizados.length === 0" class="estado-vazio">
        Nenhum pedido personalizado encontrado.
      </div>

      <div v-else class="tabela-wrapper">
        <table class="tabela">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>WhatsApp</th>
              <th>Produto solicitado</th>
              <th>Qtd</th>
              <th>Recebido em</th>
              <th>Situação</th>
              <th>Alterar situação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in personalizados" :key="p.id">
              <td class="id-cel">{{ p.id }}</td>
              <td class="nome-cel">{{ p.nomeCliente }}</td>
              <td>{{ p.whatsapp }}</td>
              <td class="nome-cel">{{ p.nomePedido }}</td>
              <td>{{ p.quantidade }}</td>
              <td>{{ formatarData(p.criadoEm) }}</td>
              <td>
                <span class="badge" :class="statusClass(p.status)">
                  {{ statusLabel(p.status) }}
                </span>
              </td>
              <td>
                <div class="acoes-cel">
                  <select v-model="statusEditando[p.id]" class="select-status">
                    <option v-for="opt in STATUS_OPTIONS" :key="opt.valor" :value="opt.valor">
                      {{ opt.label }}
                    </option>
                  </select>
                  <button class="btn-acao azul" :disabled="statusEditando[p.id] === p.status" @click="salvarStatus(p)">
                    Salvar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<style scoped>
.painel {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  font-family: var(--font-family-base);
}

/* ── Cabeçalho ─────────────────────────────────────────────── */
.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
}

.btn-adicionar {
  background: var(--color-brand-blue);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}

.btn-adicionar:hover {
  background: #0A377A;
  transform: scale(1.03);
}

.cabecalho-acoes {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* ── Cards de estatísticas ─────────────────────────────────── */
.cards-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2.5rem;
}

.card-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-surface);
  border: 2px solid var(--color-brand-blue);
  border-radius: 14px;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 2px 8px #00000010;
}

.card-stat.destaque {
  border-color: #22c55e;
}

.stat-icone {
  font-size: 40px;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-muted, #888);
  margin: 0 0 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-valor {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.stat-valor.carregando {
  font-size: 1rem;
  color: var(--color-muted, #aaa);
}

/* ── Abas ──────────────────────────────────────────────────── */
.abas {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-brand-blue);
  padding-bottom: 0;
}

.aba-btn {
  background: transparent;
  border: 2px solid var(--color-brand-blue);
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  padding: 0.6rem 1.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-brand-blue);
  transition: background 0.15s, color 0.15s;
}

.aba-btn.ativa {
  background: var(--color-brand-blue);
  color: #fff;
}

.aba-btn:not(.ativa):hover {
  background: var(--color-brand-blue);
  color: #fff;
  opacity: 0.7;
}

/* ── Tabela ────────────────────────────────────────────────── */
.tabela-wrapper {
  overflow-x: auto;
  border: 2px solid var(--color-brand-blue);
  border-radius: 14px;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.tabela thead tr {
  background: var(--color-brand-blue);
  color: #fff;
}

.tabela th,
.tabela td {
  padding: 0.85rem 1rem;
  text-align: center;
  border-bottom: 1px solid var(--color-border-input, #e5e7eb);
}

.tabela tbody tr:last-child td {
  border-bottom: none;
}

.tabela tbody tr:hover {
  background: var(--color-surface, #f9f9f9);
}

.img-produto {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--color-border-input, #ddd);
}

.nome-cel {
  font-weight: 600;
  min-width: 140px;
}

.id-cel {
  font-weight: 600;
  color: var(--color-muted, #888);
  min-width: 40px;
}

/* ── Badges de status ───────────────────────────────────────── */
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.badge.sim {
  background: #dcfce7;
  color: #166534;
}

.badge.nao {
  background: #fee2e2;
  color: #991b1b;
}

.badge.admin {
  background: #ede9fe;
  color: #5b21b6;
}

.badge.user {
  background: #e0f2fe;
  color: #0369a1;
}

.badge.categoria {
  background: var(--color-surface, #f3f4f6);
  color: var(--color-brand-blue);
  border: 1px solid var(--color-brand-blue);
}

/* Status personalizado */
.st-aguardando {
  background: #fff8ee;
  color: #c35a00;
}

.st-orcamento {
  background: #e3f2fd;
  color: #1565c0;
}

.st-aprovado {
  background: #e8f5e9;
  color: #2e7d32;
}

.st-producao {
  background: #eeeffe;
  color: #2C18A0;
}

.st-concluido {
  background: #f3e5f5;
  color: #6a1b9a;
}

.st-cancelado {
  background: #ffebee;
  color: #b71c1c;
}

/* ── Select de status ───────────────────────────────────────── */
.select-status {
  padding: 5px 10px;
  border-radius: 8px;
  border: 1.5px solid var(--color-brand-blue);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-brand-blue);
  background: #fff;
  cursor: pointer;
  outline: none;
  min-width: 170px;
}

.select-status:focus {
  box-shadow: 0 0 0 2px rgba(44, 24, 160, 0.2);
}

/* ── Ações ──────────────────────────────────────────────────── */
.acoes-cel {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.btn-acao {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s, opacity 0.12s;
}

.btn-acao.azul:hover:not(:disabled) {
  background: #0A377A;
  transform: scale(1.05);
}

.btn-acao:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-acao.azul {
  background: var(--color-brand-blue);
  color: #fff;
}

.btn-acao.vermelho {
  background: var(--color-error, #ef4444);
  color: #fff;
}

.btn-acao.vermelho:hover:not(:disabled) {
  background: #a10e0e;
  transform: scale(1.05);
} 

/* ── Estado vazio ───────────────────────────────────────────── */
.estado-vazio {
  text-align: center;
  padding: 3rem;
  color: var(--color-muted, #888);
  font-size: 1rem;
  border: 2px dashed var(--color-brand-blue);
  border-radius: 14px;
}
</style>
