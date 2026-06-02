<template>
  <div>
    <!-- <div 
      v-if="isOpen" 
      @click="isOpen = false"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
    ></div> -->

    <aside 
      class="fixed top-0 left-0 z-50 h-screen w-64 bg-slate-200 dark:bg-slate-900 text-slate-100 p-5 shadow-xl transition-transform duration-300 ease-in-out transform"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-lg font-bold tracking-wider">Dashboard</h2>
        <button 
          @click="isOpen = false"
          class="p-1 rounded-md hover:bg-slate-800 transition-colors focus:outline-none"
        >
          <span class="material-icons text-[22px]">close</span>
        </button>
      </div>

      <nav class="space-y-2">
        <NuxtLink to="#" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors group">
          <span class="text-slate-400 group-hover:text-white">Início</span>
        </NuxtLink>
        <NuxtLink to="#" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors group">
          <span class="text-slate-400 group-hover:text-white">Projetos</span>
        </NuxtLink>
        <NuxtLink to="#" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors group">
          <span class="text-slate-400 group-hover:text-white">Configurações</span>
        </NuxtLink>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
const { isOpen } = useSidebar()
</script>