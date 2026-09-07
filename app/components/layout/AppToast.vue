<template>
  <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="scale-95 opacity-0" leave-active-class="transition duration-150 ease-in" leave-to-class="scale-95 opacity-0">
    <aside v-if="current" :key="current.id" class="fixed z-[100] w-[calc(100%-2.5rem)] max-w-md rounded-2xl border bg-white p-4 shadow-2xl dark:bg-slate-900" :class="[borderClass, positionClass]" role="status" aria-live="polite">
      <div class="flex items-start gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" :class="iconClass"><Icon :name="iconName" size="21" /></span>
        <div class="min-w-0 flex-1"><p class="font-bold text-slate-900 dark:text-slate-100">{{ current.title }}</p><p class="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">{{ current.message }}</p></div>
        <button type="button" class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label="Fechar" @click="close(false)"><Icon name="mdi:close" size="18" /></button>
      </div>
      <div v-if="current.type === 'confirm'" class="mt-4 flex justify-end gap-2"><button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" @click="close(false)">Cancelar</button><button type="button" class="rounded-lg bg-rose-600 px-3 py-2 text-sm font-bold text-white hover:bg-rose-500" @click="close(true)">{{ current.confirmLabel }}</button></div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import type { ToastPosition } from '~/composables/useToast'

const props = withDefaults(defineProps<{ position?: ToastPosition }>(), { position: 'bottom-right' })
const { current, close } = useToast()
const iconName = computed(() => current.value?.type === 'success' ? 'mdi:check-circle-outline' : current.value?.type === 'error' ? 'mdi:alert-circle-outline' : 'mdi:help-circle-outline')
const borderClass = computed(() => current.value?.type === 'success' ? 'border-emerald-200 dark:border-emerald-900' : current.value?.type === 'error' ? 'border-rose-200 dark:border-rose-900' : 'border-amber-200 dark:border-amber-900')
const iconClass = computed(() => current.value?.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300' : current.value?.type === 'error' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300')
const positionClass = computed(() => {
  const position = current.value?.position || props.position
  if (position === 'center') return 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
  if (position === 'top-right') return 'right-5 top-5'
  return 'bottom-5 right-5'
})
let timer: ReturnType<typeof setTimeout> | undefined
watch(current, (value) => {
  if (timer) clearTimeout(timer)
  if (value && value.type !== 'confirm') timer = setTimeout(() => close(false), 4000)
})
onBeforeUnmount(() => { if (timer) clearTimeout(timer) })
</script>
