import { ApiError } from "@/errors/ApiError";

const pedidosMock = [
  {
    id: 1,
    idUsuario: 1,
    nomePedido: "Vaso hexagonal da Mari",
    descricao: "Quero um vaso com formato hexagonal, com meu nome gravado na base.",
    finalidade: "Decoração da sala",
    tamanho: "20cm de altura",
    quantidade: 2,
    cores: "Azul marinho e branco fosco",
    fotosReferencia: [],
    nomeCliente: "Mariana Silva",
    whatsapp: "(81) 99999-1111",
    prazoDesejadoDias: 15,
    status: "AGUARDANDO_ORCAMENTO",
    criadoEm: "2026-06-10T14:30:00",
    atualizadoEm: "2026-06-10T14:30:00",
  },
];

let proximoId = 2;

// ── Usuário ──────────────────────────────────────────────────

export async function criarPedidoPersonalizadoNaApi(idUsuario, pedido) {
  await new Promise((r) => setTimeout(r, 500));
  const novo = {
    ...pedido,
    id: proximoId++,
    idUsuario,
    status: "AGUARDANDO_ORCAMENTO",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  pedidosMock.unshift(novo);
  return novo;
}

export async function getPedidosPersonalizadosDoUsuarioNaApi(idUsuario) {
  await new Promise((r) => setTimeout(r, 300));
  return pedidosMock.filter((p) => p.idUsuario === idUsuario);
}

export async function getPedidoPersonalizadoDetalheNaApi(idUsuario, idPedido) {
  await new Promise((r) => setTimeout(r, 200));
  const pedido = pedidosMock.find(
    (p) => p.id === Number(idPedido) && p.idUsuario === Number(idUsuario)
  );
  if (!pedido) throw new ApiError("Pedido personalizado não encontrado", 404);
  return pedido;
}

// ── Admin ────────────────────────────────────────────────────

export async function getTodosPersonalizadosAdminNaApi() {
  await new Promise((r) => setTimeout(r, 300));
  return [...pedidosMock].sort(
    (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
  );
}

export async function atualizarStatusPersonalizadoNaApi(idPedido, status) {
  await new Promise((r) => setTimeout(r, 200));
  const pedido = pedidosMock.find((p) => p.id === Number(idPedido));
  if (!pedido) throw new ApiError("Pedido personalizado não encontrado", 404);
  pedido.status = status;
  pedido.atualizadoEm = new Date().toISOString();
  return { ...pedido };
}
