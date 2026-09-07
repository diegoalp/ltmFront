import type { CRMUser } from '~/app/types/crm'

/**
 * Source of truth for the client session.
 * Cookie persistence is handled by `useApi`, not directly by this store.
 */
export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null as CRMUser | null,
    token: null as string | null,
    instanceId: null as string | null,
    hydrated: false
  }),

  getters: {
    isAuthenticated: state => Boolean(state.token && state.user)
  },

  actions: {
    hydrate(token: string | null, instanceId: string | null) {
      // Prevent later useApi calls from overwriting an active session.
      if (this.hydrated) return
      this.token = token
      this.instanceId = instanceId
      this.hydrated = true
    },

    setAuthenticated(user: CRMUser, token: string) {
      this.user = user
      this.token = token
      // Users assigned to an instance do not need to select it manually.
      this.instanceId = user.instanceId == null ? null : String(user.instanceId)
    },

    selectInstance(instanceId: string | null) {
      this.instanceId = instanceId
    },

    clear() {
      this.user = null
      this.token = null
      this.instanceId = null
    }
  }
})
