// authService simplificado para testes — sem Firebase/JWT
// O usuário está sempre "logado" com id fixo 1

export function useAuthService() {
  function getCurrentUser() {
    // Retorna usuário fixo para os testes funcionarem
    return { id: 1, email: 'admin@marcapasso.com', role: 'admin' }
  }

  function isAuthenticated() {
    return true
  }

  async function login(email, senha) {
    return { ok: true }
  }

  async function register(email, senha) {
    return { ok: true }
  }

  async function logout() {
    return { ok: true }
  }

  async function verificaLogin() {
    return { ok: true }
  }

  function getAuthHeader() {
    return {}
  }

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    verificaLogin,
    getAuthHeader,
  }
}