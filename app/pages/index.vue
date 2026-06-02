<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
    <AppHeader />

    <main class="mx-auto flex w-full max-w-[1500px] p-4 md:p-6">
      <AppSidebar class="hidden lg:block" />

      <section class="min-w-0 flex-1 space-y-4">
        <header>
          <p class="text-sm uppercase tracking-[0.24em]">Pipeline</p>
          <h1 class="text-2xl font-semibold md:text-3xl priority-color">CRM Kanban</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Acompanhe oportunidades com dados mock enquanto a integracao de API nao foi iniciada.
          </p>
        </header>

        <KanbanBoard />
      </section>
    </main>
  </div>
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