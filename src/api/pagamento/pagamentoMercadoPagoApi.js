import axiosInstance from "../config";

/**
 * Chama o backend para criar uma Preference no Mercado Pago.
 * Retorna { preferenceId, initPoint, sandboxInitPoint }
 *
 * @param {Object} dados - Itens, frete, desconto, forma de pagamento e dados do cliente
 */
export async function criarPreferenceMercadoPago(dados) {
    const { data } = await axiosInstance.post('/api/pagamentos/mercadopago/preference', dados);
    return data;
}
