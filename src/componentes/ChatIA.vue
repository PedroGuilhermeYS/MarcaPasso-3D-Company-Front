<script setup>
// Imports do Vue
import { ref, nextTick } from 'vue'

// Imports do Vue Router (para navegar entre páginas)
import { useRouter } from 'vue-router'

// Stores do Pinia (gerenciamento de estado global)
import { usePesquisaStore } from '@/stores/usePesquisaStore'   // filtros de busca
import { useProdutosStore } from '@/stores/useProdutosStore'   // lista de produtos
import { useFavoritosStore } from '@/stores/useFavoritosStore' // favoritos
import { useAuthStore } from '@/stores/useAuthStore'           // usuário logado

// A função que chama nosso backend (que por sua vez chama a IA)
// Toda a lógica de prompt e chave de API ficou no backend
import { enviarMensagemChatIA } from '@/api/chatiaApi'

// Link do WhatsApp para quando não houver resultados
const WHATSAPP_LINK = 'https://wa.me/5581997076382'

// Inicializa as dependências
const router = useRouter()
const pesquisaStore = usePesquisaStore()
const produtosStore = useProdutosStore()
const favoritosStore = useFavoritosStore()
const authStore = useAuthStore()

// Estados reativos do componente
const isOpen = ref(false)          // chat aberto ou fechado
const inputTexto = ref('')         // texto digitado pelo usuário
const carregando = ref(false)      // true enquanto aguarda resposta
const messagesRef = ref(null)      // referência ao elemento da lista de mensagens

// Lista de mensagens exibidas no chat
const mensagens = ref([
  {
    tipo: 'ia',
    texto: 'Olá! Sou a assistente da MarcaPasso3D 👋\nPosso te ajudar a encontrar produtos, favoritar itens ou tirar dúvidas. Como posso te ajudar?'
  }
])

// Rola a lista de mensagens para o final (para mostrar a mensagem mais recente)
const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// Envia a mensagem do usuário para o backend e processa a resposta
const enviarMensagem = async () => {
  const texto = inputTexto.value.trim()
  if (!texto || carregando.value) return

  // Adiciona a mensagem do usuário na tela
  mensagens.value.push({ tipo: 'usuario', texto })
  inputTexto.value = ''
  carregando.value = true
  await scrollToBottom()

  try {
    // Chama o backend — ele cuida de tudo (prompt, IA, parse)
    // e devolve um objeto como: { acao: "filtrar", filtros: {...}, mensagem: "..." }
    const resultado = await enviarMensagemChatIA(texto)

    // Processa a ação retornada pelo backend
    await processarAcao(resultado)

  } catch {
    // Qualquer erro de rede ou do backend
    mensagens.value.push({
      tipo: 'ia',
      texto: 'Desculpe, não consegui processar sua mensagem. Tente novamente.',
      link: { texto: '📱 Falar pelo WhatsApp', url: WHATSAPP_LINK }
    })
  } finally {
    carregando.value = false
    await scrollToBottom()
  }
}

// Processa a ação retornada pelo backend e executa a navegação/ação correspondente
const processarAcao = async (resultado) => {
  switch (resultado.acao) {

    case 'filtrar': {
      // Aplica os filtros na store de pesquisa e navega para a home de produtos
      const f = resultado.filtros || {}
      pesquisaStore.limparFiltros()
      pesquisaStore.setTerm(f.termo || '')
      pesquisaStore.setCategoria(f.categoria || '')
      pesquisaStore.setPreco(f.preco || '')
      pesquisaStore.setPersonalizavel(f.personalizavel || '')
      pesquisaStore.setOrdenacao(f.ordenacao || '')

      mensagens.value.push({
        tipo: 'ia',
        texto: resultado.mensagem,
        acao: { tipo: 'navegar', label: '🛍️ Ver produtos filtrados', rota: { name: 'Home' } }
      })
      await router.push({ name: 'Home' })
      break
    }

    case 'produto': {
      // Navega para a página do produto específico
      mensagens.value.push({
        tipo: 'ia',
        texto: resultado.mensagem,
        acao: { tipo: 'navegar', label: '📦 Abrir produto', rota: { name: 'Produto', params: { id: resultado.id } } }
      })
      await router.push({ name: 'Produto', params: { id: resultado.id } })
      break
    }

    case 'favoritar': {
      // Verifica se o usuário está logado antes de favoritar
      if (!authStore.usuario) {
        mensagens.value.push({
          tipo: 'ia',
          texto: 'Para favoritar produtos você precisa estar logado. Que tal fazer login agora?',
          acao: { tipo: 'navegar', label: '🔑 Fazer login', rota: { name: 'Login' } }
        })
        return
      }

      // Busca o produto pelo ID e favorita
      const produto = produtosStore.produtos.find(p => String(p.id) === String(resultado.id))
      if (produto) {
        await favoritosStore.adicionarFavorito(produto)
        mensagens.value.push({ tipo: 'ia', texto: resultado.mensagem + ' ❤️' })
      } else {
        // Produto não está carregado na store ainda — tenta carregar primeiro
        await produtosStore.carregarProdutos()
        const produtoRecarregado = produtosStore.produtos.find(p => String(p.id) === String(resultado.id))
        if (produtoRecarregado) {
          await favoritosStore.adicionarFavorito(produtoRecarregado)
          mensagens.value.push({ tipo: 'ia', texto: resultado.mensagem + ' ❤️' })
        } else {
          mensagens.value.push({ tipo: 'ia', texto: 'Não encontrei esse produto para favoritar.' })
        }
      }
      break
    }

    case 'sem_resultado': {
      // Exibe mensagem e botão para WhatsApp
      mensagens.value.push({
        tipo: 'ia',
        texto: resultado.mensagem,
        link: { texto: '📱 Falar pelo WhatsApp', url: WHATSAPP_LINK }
      })
      break
    }

    case 'chat':
    default: {
      // Resposta de conversa geral — só exibe o texto
      mensagens.value.push({ tipo: 'ia', texto: resultado.mensagem })
      break
    }
  }
}

// Navega para uma rota quando o usuário clica no botão de ação dentro do chat
const navegarPorAcao = async (rota) => {
  await router.push(rota)
}

// Envia mensagem ao pressionar Enter (Shift+Enter = quebra de linha)
const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    enviarMensagem()
  }
}

// Abre/fecha o chat
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) scrollToBottom()
}
</script>

<template>
  <div class="chat-ia-wrapper">
    <!-- Botão flutuante para abrir/fechar o chat -->
    <button
      class="chat-toggle-btn"
      :class="{ 'chat-toggle-btn--open': isOpen }"
      @click="toggleChat"
      :aria-label="isOpen ? 'Fechar chat' : 'Abrir chat com assistente'"
    >
      <!-- Ícone de chat quando fechado -->
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.5a1 1 0 0 0 1.278 1.278l3.332-.892A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2ZM8 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
      </svg>
      <!-- Ícone de X quando aberto -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>

    <!-- Janela do chat (visível só quando isOpen = true) -->
    <Transition name="chat-slide">
      <div v-if="isOpen" class="chat-window">

        <!-- Cabeçalho do chat -->
        <div class="chat-header">
          <div class="chat-header__avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2Zm0 12c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z"/>
            </svg>
          </div>
          <div class="chat-header__info">
            <span class="chat-header__name">Assistente MarcaPasso3D</span>
            <span class="chat-header__status">
              <span class="status-dot" :class="{ 'status-dot--typing': carregando }"></span>
              {{ carregando ? 'Processando…' : 'Online' }}
            </span>
          </div>
          <button class="chat-header__close" @click="toggleChat" aria-label="Fechar chat">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Lista de mensagens -->
        <div class="chat-messages" ref="messagesRef">
          <div
            v-for="(msg, i) in mensagens"
            :key="i"
            class="chat-msg"
            :class="`chat-msg--${msg.tipo}`"
          >
            <div class="chat-msg__bubble">
              <!-- Texto da mensagem -->
              <p class="chat-msg__text">{{ msg.texto }}</p>

              <!-- Botão de ação (ex: "Ver produtos", "Abrir produto") -->
              <button
                v-if="msg.acao"
                class="chat-msg__action-btn"
                @click="navegarPorAcao(msg.acao.rota)"
              >
                {{ msg.acao.label }}
              </button>

              <!-- Link externo (ex: WhatsApp) -->
              <a
                v-if="msg.link"
                :href="msg.link.url"
                target="_blank"
                rel="noopener"
                class="chat-msg__link-btn"
              >
                {{ msg.link.texto }}
              </a>
            </div>
          </div>

          <!-- Indicador de "digitando" (3 pontinhos animados) -->
          <div v-if="carregando" class="chat-msg chat-msg--ia">
            <div class="chat-msg__bubble chat-msg__bubble--typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Área de digitação -->
        <div class="chat-input-area">
          <textarea
            v-model="inputTexto"
            class="chat-input"
            placeholder="Digite sua mensagem…"
            rows="1"
            :disabled="carregando"
            @keydown="handleKeydown"
          ></textarea>
          <button
            class="chat-send-btn"
            :disabled="!inputTexto.trim() || carregando"
            @click="enviarMensagem"
            aria-label="Enviar mensagem"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>

      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ─── Posicionamento: canto inferior direito, acima de tudo ── */
.chat-ia-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-family: var(--font-family-base, 'Open Sans', sans-serif);
}

/* ─── Botão de abrir/fechar ───────────────────────────────── */
.chat-toggle-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary, #0185fa);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(1, 133, 250, 0.45);
  transition: transform 0.2s ease, background 0.2s ease;
  flex-shrink: 0;
}
.chat-toggle-btn svg { width: 26px; height: 26px; }
.chat-toggle-btn:hover { background: var(--color-primary-hover, #007acc); transform: scale(1.07); }
.chat-toggle-btn--open { background: var(--color-primary-hover, #007acc); }

/* ─── Janela do chat ──────────────────────────────────────── */
.chat-window {
  width: 360px;
  max-height: 520px;
  background: var(--color-surface, #fff);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border-light, #ccc);
}

/* ─── Animação de entrada/saída ───────────────────────────── */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

/* ─── Cabeçalho ───────────────────────────────────────────── */
.chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--color-primary, #0185fa);
  color: #fff;
  flex-shrink: 0;
}
.chat-header__avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.chat-header__avatar svg { width: 20px; height: 20px; fill: #fff; }
.chat-header__info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.chat-header__name { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-header__status { font-size: 0.75rem; opacity: 0.88; display: flex; align-items: center; gap: 5px; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: #4cff72; flex-shrink: 0; }
.status-dot--typing { background: #ffe074; animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.chat-header__close { background: none; border: none; cursor: pointer; color: #fff; opacity: 0.75; padding: 4px; display: flex; align-items: center; transition: opacity 0.15s; }
.chat-header__close:hover { opacity: 1; }
.chat-header__close svg { width: 18px; height: 18px; }

/* ─── Lista de mensagens ──────────────────────────────────── */
.chat-messages {
  flex: 1; overflow-y: auto;
  padding: 16px 14px;
  display: flex; flex-direction: column; gap: 10px;
  scroll-behavior: smooth;
  background: var(--color-bg-muted, #f7f7f7);
}
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

.chat-msg { display: flex; max-width: 88%; }
.chat-msg--usuario { align-self: flex-end; flex-direction: row-reverse; }
.chat-msg--ia { align-self: flex-start; }

.chat-msg__bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.875rem;
  line-height: 1.5;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07);
  display: flex; flex-direction: column; gap: 8px;
}
.chat-msg--usuario .chat-msg__bubble {
  background: var(--color-primary, #0185fa);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.chat-msg--ia .chat-msg__bubble {
  background: #fff;
  color: var(--color-text, #000);
  border-bottom-left-radius: 4px;
  border: 1px solid var(--color-border-light, #e0e0e0);
}
.chat-msg__text { margin: 0; white-space: pre-line; }

/* Botões de ação e link dentro das mensagens */
.chat-msg__action-btn,
.chat-msg__link-btn {
  display: inline-block;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.82rem; font-weight: 600;
  cursor: pointer; text-align: center; text-decoration: none;
  transition: background 0.15s;
  background: var(--color-primary, #0185fa);
  color: #fff; border: none;
}
.chat-msg__action-btn:hover,
.chat-msg__link-btn:hover { background: var(--color-primary-hover, #007acc); }

/* Pontinhos de "digitando" */
.chat-msg__bubble--typing {
  padding: 12px 16px; background: #fff;
  border: 1px solid var(--color-border-light, #e0e0e0);
  display: flex; flex-direction: row; align-items: center; gap: 5px;
}
.chat-msg__bubble--typing span {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--color-primary, #0185fa);
  animation: typing-bounce 1.2s infinite;
}
.chat-msg__bubble--typing span:nth-child(2) { animation-delay: 0.2s; }
.chat-msg__bubble--typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-5px); opacity: 1; }
}

/* ─── Área de digitação ───────────────────────────────────── */
.chat-input-area {
  display: flex; align-items: flex-end; gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--color-border-light, #e0e0e0);
  background: var(--color-surface, #fff);
  flex-shrink: 0;
}
.chat-input {
  flex: 1; resize: none;
  border: 1px solid var(--color-border-input, #ccc);
  border-radius: 12px;
  padding: 9px 12px;
  font-size: 0.875rem;
  font-family: var(--font-family-base, 'Open Sans', sans-serif);
  color: var(--color-text, #000);
  background: var(--color-bg-muted, #f7f7f7);
  outline: none; line-height: 1.4;
  max-height: 100px; overflow-y: auto;
  transition: border-color 0.15s;
}
.chat-input:focus { border-color: var(--color-primary, #0185fa); background: #fff; }
.chat-input:disabled { opacity: 0.55; cursor: not-allowed; }

.chat-send-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--color-primary, #0185fa);
  color: #fff; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, opacity 0.15s;
}
.chat-send-btn svg { width: 18px; height: 18px; }
.chat-send-btn:hover:not(:disabled) { background: var(--color-primary-hover, #007acc); }
.chat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ─── Mobile ──────────────────────────────────────────────── */
@media (max-width: 480px) {
  .chat-ia-wrapper { bottom: 16px; right: 16px; }
  .chat-window { width: calc(100vw - 32px); max-height: 75vh; }
}
</style>