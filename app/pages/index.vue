<template>
        <header>
          <p class="text-sm uppercase tracking-[0.24em]">Pipeline</p>
          <h1 class="text-2xl font-semibold md:text-3xl priority-color">CRM Kanban</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Acompanhe oportunidades com dados mock enquanto a integracao de API nao foi iniciada.
          </p>
        </header>

        <KanbanBoard />
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
import KanbanBoard from '~/components/kanban/KanbanBoard.vue'
const { isAuthenticated } = useAuthMock()

if (import.meta.client && !isAuthenticated.value) {
  await navigateTo('/login')
}
</script>