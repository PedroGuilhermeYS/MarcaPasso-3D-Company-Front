// Supabase desabilitado temporariamente para testes com backend local
export const supabase = {
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: new Error('Supabase desabilitado') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: async () => ({ error: null }),
    }),
  },
}