<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LogoTop from '@/componentes/LogoTop.vue'
import { useProdutosStore } from '@/stores/useProdutosStore'
import { getTodosUsuariosNaApi } from '@/api/usuario/usuarioApi.js'
import { getTodosEncomendasAdminNaApi } from '@/api/encomenda'

const router = useRouter()
const produtosStore = useProdutosStore()

const usuarios = ref([])
const encomendas = ref([])
const carregandoUsuarios = ref(false)
const carregandoEncomendas = ref(false)

// ── Aba ativa ────────────────────────────────────────────────
const abas = ['Produtos', 'Clientes']
const abaAtiva = ref('Produtos')

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

// ── Carregamento inicial ─────────────────────────────────────
onMounted(async () => {
  await produtosStore.carregarProdutos()

  carregandoUsuarios.value = true
  try {
    usuarios.value = await getTodosUsuariosNaApi()
  } finally {
    carregandoUsuarios.value = false
  }

  carregandoEncomendas.value = true
  try {
    encomendas.value = await getTodosEncomendasAdminNaApi()
  } finally {
    carregandoEncomendas.value = false
  }
})
</script>

<template>
  <LogoTop />

  <div class="painel">

    <!-- ── Cabeçalho ───────────────────────────────────────── -->
    <div class="cabecalho">
      <h1 class="titulo">Painel Administrativo</h1>
      <button class="btn-adicionar" @click="adicionarProduto">
        + Adicionar Produto
      </button>
    </div>

    <!-- ── Cards de estatísticas ─────────────────────────── -->
    <div class="cards-stats">
      <div class="card-stat">
        <span class="stat-icone">📦</span>
        <div>
          <p class="stat-label">Total de Produtos</p>
          <p class="stat-valor">{{ totalProdutos }}</p>
        </div>
      </div>

      <div class="card-stat">
        <span class="stat-icone">👥</span>
        <div>
          <p class="stat-label">Total de Clientes</p>
          <p class="stat-valor">{{ usuarios.length }}</p>
        </div>
      </div>

    </div>

    <!-- ── Abas ─────────────────────────────────────────────── -->
    <div class="abas">
      <button
        v-for="aba in abas"
        :key="aba"
        class="aba-btn"
        :class="{ ativa: abaAtiva === aba }"
        @click="abaAtiva = aba"
      >
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
                <img
                  :src="produto.imagemPrincipal || '/imagem-produtos/placeholder.jpg'"
                  :alt="produto.nome"
                  class="img-produto"
                />
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
  background: var(--color-primary);
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
  transform: scale(1.03);
  opacity: 0.92;
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
  border: 2px solid var(--color-primary);
  border-radius: 14px;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 2px 8px #00000010;
}
.card-stat.destaque {
  border-color: #22c55e;
}

.stat-icone {
  font-size: 2rem;
  line-height: 1;
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
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0;
}

.aba-btn {
  background: transparent;
  border: 2px solid var(--color-primary);
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  padding: 0.6rem 1.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-primary);
  transition: background 0.15s, color 0.15s;
}
.aba-btn.ativa {
  background: var(--color-primary);
  color: #fff;
}
.aba-btn:not(.ativa):hover {
  background: var(--color-primary);
  color: #fff;
  opacity: 0.7;
}

/* ── Tabela ────────────────────────────────────────────────── */
.tabela-wrapper {
  overflow-x: auto;
  border: 2px solid var(--color-primary);
  border-radius: 14px;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.tabela thead tr {
  background: var(--color-primary);
  color: #fff;
}

.tabela th,
.tabela td {
  padding: 0.85rem 1rem;
  text-align: left;
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

/* ── Badges ─────────────────────────────────────────────────── */
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}
.badge.sim   { background: #dcfce7; color: #166534; }
.badge.nao   { background: #fee2e2; color: #991b1b; }
.badge.admin { background: #ede9fe; color: #5b21b6; }
.badge.user  { background: #e0f2fe; color: #0369a1; }
.badge.categoria {
  background: var(--color-surface, #f3f4f6);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

/* ── Ações ──────────────────────────────────────────────────── */
.acoes-cel {
  display: flex;
  gap: 8px;
}

.btn-acao {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s;
}
.btn-acao:hover { transform: scale(1.05); }
.btn-acao.azul    { background: var(--color-primary); color: #fff; }
.btn-acao.vermelho { background: var(--color-error, #ef4444); color: #fff; }

/* ── Estado vazio ───────────────────────────────────────────── */
.estado-vazio {
  text-align: center;
  padding: 3rem;
  color: var(--color-muted, #888);
  font-size: 1rem;
  border: 2px dashed var(--color-primary);
  border-radius: 14px;
}
</style>