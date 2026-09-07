<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-150"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-[2px] dark:bg-slate-950/60"
      role="status"
      aria-live="polite"
      aria-label="Carregando dados da página"
    >
      <div class="flex min-w-52 flex-col items-center gap-4 rounded-2xl border border-white/70 bg-white/95 px-8 py-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900/95">
        <span class="relative flex h-12 w-12 items-center justify-center">
          <span class="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
          <span class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600" />
          <Icon name="mdi:database-outline" size="19" class="text-indigo-600 dark:text-indigo-400" />
        </span>
        <div class="text-center">
          <p class="text-sm font-bold text-slate-800 dark:text-slate-100">Carregando dados</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Aguarde um instante...</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{ active: boolean }>()
const visible = computed(() => props.active)
</script>
