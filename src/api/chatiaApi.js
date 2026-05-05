import axiosInstance from '@/api/config'

export async function enviarMensagemChatIA(mensagem) {
    const resposta = await axiosInstance.post('/chat-ia', { mensagem })
    return resposta.data
}