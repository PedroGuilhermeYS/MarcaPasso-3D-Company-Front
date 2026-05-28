<script setup>
import { onMounted } from 'vue'
import { useFavoritosStore } from '@/stores/useFavoritosStore'

const favoritosStore = useFavoritosStore()

onMounted(async () => {
    await favoritosStore.carregarFavoritos()
})

function limparTudo() {
    favoritosStore.limparFavoritos()
}
</script>

<template>
    <main class="users favoritos-page">
        <div class="breadcrumb">
            <span>Home</span>
            <span>›</span>
            <span>Minha Conta</span>
            <span>›</span>
            <span class="atual">Favoritos</span>
        </div>

        <!-- BLOCO DO TOPO -->
        <div class="container header-container">
            <div class="page-header">
                <div class="header-left">
                    <div class="header-icon">
                        <span class="material-symbols-outlined">favorite</span>
                    </div>

                    <div>
                        <h2 class="titulo">Meus Favoritos</h2>
                        <p class="subtitulo">
                            <span>{{ favoritosStore.quantidade }}</span>produtos salvos
                        </p>
                    </div>
                </div>

                <button v-if="favoritosStore.quantidade > 0" class="btn-apagar" @click="limparTudo">
                    Apagar todos
                </button>
            </div>
        </div>

        <!-- BLOCO DOS PRODUTOS -->
        <div class="container produtos-container">
            <div v-if="favoritosStore.quantidade > 0" class="grid">
                <div v-for="item in favoritosStore.favoritos" :key="item.id" class="produto">
                    <div class="produto-img">
                        <img :src="item.imagem" :alt="item.nome" />
                    </div>

                    <div class="produto-body">
                        <h3 class="nome">{{ item.nome }}</h3>

                        <div class="preco-row">
                            <p class="preco">R$ {{ item.preco.toFixed(2) }}</p>

                            <button class="btn-comprar"
                                @click="$router.push({ name: 'Produto', params: { id: item.id } })">
                                Comprar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="estado-vazio">
                <div class="vazio-icone">♡</div>
                <h3>Nenhum favorito ainda</h3>
                <p>Você ainda não adicionou nenhum produto aos favoritos.</p>
            </div>
        </div>
    </main>
</template>

<style scoped>
.breadcrumb {
    display: flex;
    gap: 6px;
    font-size: 13px;
    color: #8f9db8;
    margin-bottom: 16px;
}

.breadcrumb .atual {
    color: #252f4a;
    font-weight: 500;
}

.container {
    background: #fff;
    border: 1px solid #e4e9f2;
    border-radius: 14px;
    padding: 22px;
}

.header-container {
    margin-bottom: 16px;
}

.produtos-container {
    margin-top: 0;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    gap: 14px;
}

.header-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: rgba(214, 48, 49, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-icon svg {
    height: 24px;
    fill: var(--color-brand-green);
}

.titulo {
    font-size: 22px;
    font-weight: 800;
    margin: 0;
}

.subtitulo {
    margin: 2px 0 0;
    font-size: 13px;
    color: #252f4a;
    font-weight: 700;
}

.subtitulo span {
    color: #252f4a;
    font-weight: 700;
}

.btn-apagar {
    border: 1.5px solid #d63031;
    background: #fff;
    color: #d63031;
    border-radius: 50px;
    padding: 10px 18px;
    font-weight: 700;
    cursor: pointer;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.produto {
    border: 1px solid #e4e9f2;
    border-radius: 14px;
    overflow: hidden;
}

.produto-img {
    height: 180px;
    background: #f4f6fb;
    display: flex;
    align-items: center;
    justify-content: center;
}

.produto-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.produto-body {
    padding: 14px;
}

.nome {
    font-size: 15px;
    margin: 0 0 8px;
    color: #252f4a;
}

.preco-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.preco {
    font-size: 18px;
    font-weight: 800;
    color: #049377;
    margin: 0;
}

.btn-comprar {
    border: none;
    background: linear-gradient(135deg, #2c18a0, #114798);
    color: #fff;
    border-radius: 10px;
    padding: 9px 14px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
}

.estado-vazio {
    text-align: center;
    padding: 60px 20px;
}

.vazio-icone {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: rgba(214, 48, 49, 0.08);
    color: #d63031;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 16px;
}

.estado-vazio h3 {
    margin: 0 0 8px;
    color: #141824;
}

.estado-vazio p {
    margin: 0;
}
</style>