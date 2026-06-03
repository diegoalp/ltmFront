<template>
  <div>
    <aside
      class="fixed left-0 top-0 z-50 h-screen w-20 overflow-visible border-r border-slate-200 bg-white/95 px-3 py-5 text-slate-700 shadow-xl backdrop-blur transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-200"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-full flex-col items-center">
        <div class="mb-8 flex w-full items-center justify-between">
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Fechar menu"
            @click="isOpen = false"
          >
            <span class="material-icons text-[18px]">close</span>
          </button>
        </div>

        <nav class="flex w-full flex-1 flex-col items-center gap-2 overflow-visible">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.label"
            :to="item.to"
            class="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-transparent transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            :class="item.isActive ? 'bg-slate-900 text-white shadow-lg dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500 dark:text-slate-400'"
            :aria-label="item.label"
          >
            <span class="material-icons text-[22px]">{{ item.icon }}</span>

            <span class="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-2xl transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 dark:border-slate-700">
              {{ item.label }}
            </span>
          </NuxtLink>
        </nav>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
type MenuItem = {
  label: string
  icon: string
  to: string
  isActive: boolean
}

const route = useRoute()
const { isOpen } = useSidebar()

const menuItems = computed<MenuItem[]>(() => [
  {
    label: 'Início',
    icon: 'home',
    to: '/',
    isActive: route.path === '/'
  },
  {
    label: 'Pipeline',
    icon: 'view_kanban',
    to: '/#pipeline',
    isActive: route.path === '/' && route.hash === '#pipeline'
  },
  {
    label: 'Configurações',
    icon: 'settings',
    to: '/#configuracoes',
    isActive: route.path === '/' && route.hash === '#configuracoes'
  }
])
</script>