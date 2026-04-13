// Importa a instância do axios já configurada com a baseURL do backend (localhost:8080)
// e com o interceptor que adiciona o token JWT automaticamente quando o usuário está logado
import axiosInstance from '@/api/config'

// Envia a mensagem do usuário para o nosso backend Spring Boot.
// O backend então chama a API da IA e devolve a ação processada.
//
// Parâmetro: mensagem (string) — o que o usuário digitou no chat
// Retorna: objeto com { acao, mensagem, id?, filtros? }
export async function enviarMensagemChatIA(mensagem) {
    const resposta = await axiosInstance.post('/chat-ia', { mensagem })
    return resposta.data
}