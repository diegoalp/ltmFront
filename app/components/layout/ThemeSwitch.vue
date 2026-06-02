<template>
  <button
    type="button"
    role="switch"
    class="relative h-6 w-[60px] rounded-full border border-slate-300/70 p-0.5 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 dark:border-slate-700/70"
    :class="trackClass"
    :aria-checked="mode === 'dark'"
    :aria-label="mode === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'"
    @click="toggleTheme"
  >
    <span class="absolute inset-1 overflow-hidden rounded-full">
      <template v-if="mode === 'light'">
        <span class="absolute left-3 top-2 h-1 w-1 rounded-full bg-white/90" />
        <span class="absolute left-8 top-5 h-1 w-1 rounded-full bg-white/80" />
        <span class="absolute right-5 top-3 h-1 w-1 rounded-full bg-white/70" />
      </template>
      <template v-else>
        <span class="absolute left-5 top-2 h-1.5 w-1.5 rounded-full bg-sky-100/90" />
        <span class="absolute right-6 top-6 h-1.5 w-1.5 rounded-full bg-sky-100/70" />
      </template>
    </span>

    <span
      class="relative flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shadow-md transition-transform duration-300"
      :class="thumbClass"
    >
      <span v-if="mode === 'light'" class="absolute h-3 w-3 rounded-full bg-slate-200" />
      <span v-if="mode === 'light'" class="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-slate-800/80" />

      <template v-else>
        <span class="absolute h-3 w-3 rounded-full bg-amber-300" />
        <span class="absolute h-4 w-4 rounded-full border border-amber-200/70" />
      </template>
    </span>
  </button>
</template>

<script setup lang="ts">
const { mode, toggleTheme } = useTheme()

const trackClass = computed(() => {
  if (mode.value === 'light') {
    return 'bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800'
  }

  return 'bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-300'
})

const thumbClass = computed(() => {
  if (mode.value === 'light') {
    return 'translate-x-0 bg-slate-700'
  }

  return 'translate-x-9 bg-amber-100'
})
</script>
