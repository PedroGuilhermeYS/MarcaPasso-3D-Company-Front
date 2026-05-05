import { ApiError } from "@/errors/ApiError"

const favoritos = [
    {
        "id": "1",
        "nome": "Abajur Cogumelo",
        "preco": 79.90,
        "imagem": "/imagem-produtos/abajurcogumelo.jpg"
    }
]

export async function getTodosFavoritosNaApi() {
    return favoritos
}

export async function getFavoritoNaApi(id) {
    const favoritoEncontrado = favoritos.find(favorito => favorito.id == id);
    if (!favoritoEncontrado) {
        return Promise.reject(new ApiError("Favorito não encontrado", 404, null));
    }
    return favoritoEncontrado;
}

export async function addFavoritoNaApi(favorito) {
    const favoritoJaExiste = favoritos.find(p => p.id == favorito.id);
    if (favoritoJaExiste) {
        return Promise.reject(new ApiError("Favorito já cadastrado", 409, null));
    }
    favoritos.push(favorito)
    return favorito
}

export async function removeFavoritoNaApi(id) {
    const favoritoEncontrado = favoritos.find(p => p.id == id);
    if (!favoritoEncontrado) {
        return Promise.reject(new ApiError("Favorito não encontrado", 404, null));
    }
    const index = favoritos.indexOf(favoritoEncontrado);
    const favoritoRemovido = favoritos.splice(index, 1)[0];
    return favoritoRemovido;
}

export async function removeTodosFavoritosNaApi() {
    favoritos.splice(0, favoritos.length)
    return favoritos
}

export async function atualizaFavoritoNaApi(id, favorito) {
    const favoritoEncontrado = favoritos.find(p => p.id == id);
    if (!favoritoEncontrado) {
        return Promise.reject(new ApiError("Favorito não encontrado", 404, null));
    }
    Object.assign(favoritoEncontrado, favorito);
    return favoritoEncontrado;
}

