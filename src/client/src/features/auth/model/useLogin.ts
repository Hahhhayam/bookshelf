import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionToken, viewerApi, viewerKey } from '@/entities/viewer'

export function useLogin() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ login, password }: { login: string; password: string }) => viewerApi.login(login, password),
    onSuccess: async ({ token }) => {
      sessionToken.set(token)
      await client.invalidateQueries({ queryKey: viewerKey })
    },
  })
}

/** Revokes the session on the server too, so a copied token stops working; the local session ends either way. */
export function useLogout() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: () => viewerApi.logout(),
    onSettled: () => {
      sessionToken.clear()
      client.clear()
    },
  })
}
