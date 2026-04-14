import { ApiError } from "@/errors/ApiError";

const encomendas = [
  {
    id: 1,
    numeroPedido: "MP-202604-00042",
    dataHora: "2026-04-05T09:15:00",
    formaPagamento: "cartao",
    status: "ENTREGUE",
    total: 489.90,
    subtotal: 459.90,
    frete: 35.00,
    desconto: 0,
    descontoCupom: 5.00,
    tipoPagamento: "crédito",
    bandeiraCartao: "Visa",
    parcelamento: "3x sem juros",
    titularCartao: "JOAO A SILVA",
    cpfTitular: "123.456.789-00",
    binCartao: "453678",
    endRua: "Rua das Flores",
    endNumero: "142",
    endComplemento: "Apto 301",
    endBairro: "Centro",
    endCidade: "Recife",
    endEstado: "PE",
    endCep: "50010-000",
    clienteNome: "João Alves Silva",
    clienteEmail: "joao@email.com",
    clienteCpf: "123.456.789-00",
    itens: [
      { idProduto: 1, nomeProduto: "Marcapasso Premium X1", imagemPrincipal: null, quantidade: 1, precoUnitario: 299.90 },
      { idProduto: 3, nomeProduto: "Kit Acessórios Cardíacos", imagemPrincipal: null, quantidade: 2, precoUnitario: 80.00 },
    ],
  },
  {
    id: 2,
    numeroPedido: "MP-202604-00078",
    dataHora: "2026-04-08T14:22:00",
    formaPagamento: "pix",
    status: "ENVIADO",
    total: 199.50,
    subtotal: 199.50,
    frete: 0,
    desconto: 0,
    descontoCupom: 0,
    tipoPagamento: "pix",
    bandeiraCartao: null,
    parcelamento: null,
    titularCartao: null,
    cpfTitular: null,
    binCartao: null,
    endRua: "Av. Boa Viagem",
    endNumero: "3200",
    endComplemento: "",
    endBairro: "Boa Viagem",
    endCidade: "Recife",
    endEstado: "PE",
    endCep: "51030-000",
    clienteNome: "João Alves Silva",
    clienteEmail: "joao@email.com",
    clienteCpf: "123.456.789-00",
    itens: [
      { idProduto: 2, nomeProduto: "Cabo Conector Cardíaco Pro", imagemPrincipal: null, quantidade: 1, precoUnitario: 199.50 },
    ],
  },
  {
    id: 3,
    numeroPedido: "MP-202604-00101",
    dataHora: "2026-04-11T10:05:00",
    formaPagamento: "cartao",
    status: "PENDENTE",
    total: 639.80,
    subtotal: 599.80,
    frete: 40.00,
    desconto: 0,
    descontoCupom: 0,
    tipoPagamento: "débito",
    bandeiraCartao: "Mastercard",
    parcelamento: "1x",
    titularCartao: "JOAO A SILVA",
    cpfTitular: "123.456.789-00",
    binCartao: "528831",
    endRua: "Rua das Flores",
    endNumero: "142",
    endComplemento: "Apto 301",
    endBairro: "Centro",
    endCidade: "Recife",
    endEstado: "PE",
    endCep: "50010-000",
    clienteNome: "João Alves Silva",
    clienteEmail: "joao@email.com",
    clienteCpf: "123.456.789-00",
    itens: [
      { idProduto: 1, nomeProduto: "Marcapasso Premium X1", imagemPrincipal: null, quantidade: 2, precoUnitario: 299.90 },
    ],
  },
];

let proximoId = encomendas.length + 1;

export async function getEncomendasDoUsuarioNaApi(_idUsuario) {
  return encomendas.map((e) => ({
    id: e.id,
    numeroPedido: e.numeroPedido,
    dataHora: e.dataHora,
    formaPagamento: e.formaPagamento,
    status: e.status,
    total: e.total,
  }));
}

export async function getEncomendaDetalheNaApi(_idUsuario, idEncomenda) {
  const found = encomendas.find((e) => e.id == idEncomenda);
  if (!found) {
    return Promise.reject(new ApiError("Encomenda não encontrada", 404, null));
  }
  return { ...found };
}

export async function criarEncomendaNaApi(_idUsuario, encomenda) {
  const nova = {
    ...encomenda,
    id: proximoId++,
    numeroPedido: `MP-202604-${String(proximoId).padStart(5, "0")}`,
    dataHora: new Date().toISOString(),
    status: "PENDENTE",
  };
  encomendas.unshift(nova);
  return nova;
}
