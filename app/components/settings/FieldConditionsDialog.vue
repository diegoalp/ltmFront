<template>
  <Teleport to="body">
    <dialog ref="dialog" aria-labelledby="field-conditions-title" class="m-auto max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" @close="emit('close')" @click="closeOnBackdrop">
      <div v-if="field">
        <header class="flex items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
          <div class="min-w-0">
            <h2 id="field-conditions-title" class="text-base font-semibold">Condições de exibição</h2>
            <p class="mt-1 break-words text-sm text-slate-500 dark:text-slate-400">{{ field.label }}</p>
          </div>
          <button type="button" autofocus class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Fechar condições de exibição" @click="dialog?.close()">
            <Icon name="mdi:close" size="20" />
          </button>
        </header>
        <div class="space-y-4 p-5">
          <template v-if="conditions.length">
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">Este campo aparece quando todas as condições abaixo são atendidas.</p>
            <ul class="divide-y divide-slate-100 dark:divide-slate-800">
              <li v-for="(condition, index) in conditions" :key="index" class="py-3 first:pt-0 last:pb-0">
                <p class="text-sm font-medium">{{ condition.label }} <span class="font-normal text-slate-500 dark:text-slate-400">{{ condition.operator }}</span></p>
                <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <li v-for="value in condition.values" :key="value" class="break-words">{{ value }}</li>
                </ul>
              </li>
            </ul>
            <p class="text-xs leading-5 text-slate-500 dark:text-slate-400">Para “é igual a”, basta uma das opções listadas. Para “é diferente de”, nenhuma delas pode estar selecionada.</p>
          </template>
          <p v-else class="text-sm text-slate-600 dark:text-slate-300">Este campo é sempre exibido, sem condições adicionais.</p>
        </div>
        <footer class="flex justify-end border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <button type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="dialog?.close()">Fechar</button>
        </footer>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import type { CRMCustomField } from '~/types/crm'

const props = defineProps<{
  field: CRMCustomField | null
  conditions: Array<{ label: string, operator: string, values: string[] }>
}>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)

watch(() => props.field, field => {
  if (field && !dialog.value?.open) dialog.value?.showModal()
  if (!field && dialog.value?.open) dialog.value.close()
}, { flush: 'post' })

const closeOnBackdrop = (event: MouseEvent) => {
  if (event.target === dialog.value) dialog.value?.close()
}
</script>
