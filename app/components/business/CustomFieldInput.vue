<template>
  <div class="space-y-2">
    <label class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ field.label }} <span v-if="field.required">*</span></label>
    <textarea v-if="field.type === 'textarea'" v-model="model" :required="field.required" rows="3" class="field-input" />
    <select v-else-if="field.type === 'select'" v-model="model" :required="field.required" class="field-input"><option value="" disabled>Selecione</option><option v-for="option in field.options" :key="option" :value="option">{{ option }}</option></select>
    <label v-else-if="field.type === 'checkbox'" class="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-800"><input v-model="model" type="checkbox" class="rounded border-slate-300"> {{ model ? 'Sim' : 'Não' }}</label>
    <div v-else-if="field.type === 'group'" class="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="space-y-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
        <div class="flex justify-end"><button type="button" class="text-xs font-bold text-rose-600" @click="removeRow(rowIndex)">Remover item</button></div>
        <div class="grid gap-3 sm:grid-cols-2">
          <label v-for="subField in field.subFields" :key="subField.key" class="block space-y-1.5" :class="['textarea', 'file'].includes(subField.type) ? 'sm:col-span-2' : ''"><span class="text-xs font-semibold text-slate-600 dark:text-slate-300">{{ subField.label }} <span v-if="subField.required">*</span></span>
            <select v-if="subField.type === 'select'" v-model="row[subField.key]" :required="subField.required" class="field-input"><option value="" disabled>Selecione</option><option v-for="option in subField.options" :key="option" :value="option">{{ option }}</option></select>
            <input v-else-if="subField.type === 'checkbox'" v-model="row[subField.key]" type="checkbox" class="rounded border-slate-300">
            <textarea v-else-if="subField.type === 'textarea'" v-model="row[subField.key]" :required="subField.required" rows="2" class="field-input" />
            <input v-else-if="subField.type === 'currency'" :value="row[subField.key]" :required="subField.required" inputmode="numeric" class="field-input" @input="row[subField.key] = currencyMask(inputValue($event))">
            <input v-else v-model="row[subField.key]" :required="subField.required" :type="inputType(subField.type)" class="field-input">
          </label>
        </div>
      </div>
      <button type="button" class="text-xs font-bold text-indigo-600" @click="addRow">+ Adicionar item</button>
    </div>
    <input v-else-if="field.type === 'file'" type="file" :required="field.required" class="field-input" @change="setFileName">
    <input v-else-if="field.type === 'currency'" :value="model" :required="field.required" inputmode="numeric" class="field-input" @input="model = currencyMask(inputValue($event))">
    <input v-else v-model="model" :required="field.required" :type="inputType(field.type)" class="field-input">
  </div>
</template>

<script setup lang="ts">
import type { CRMCustomField, CRMCustomFieldType } from '~/types/crm'

const props = defineProps<{ field: CRMCustomField }>()
const model = defineModel<unknown>()
const rows = computed(() => Array.isArray(model.value) ? model.value as Array<Record<string, unknown>> : [])
const inputValue = (event: Event) => (event.target as HTMLInputElement).value
const currencyMask = (value: string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value.replace(/\D/g, '')) / 100)
const inputType = (type: CRMCustomFieldType) => type === 'number' ? 'number' : type === 'date' ? 'date' : type === 'phone' ? 'tel' : 'text'
const addRow = () => {
  if (!Array.isArray(model.value)) model.value = []
  ;(model.value as Array<Record<string, unknown>>).push(Object.fromEntries(props.field.subFields.map(sub => [sub.key, sub.type === 'checkbox' ? false : ''])))
}
const removeRow = (index: number) => rows.value.splice(index, 1)
const setFileName = (event: Event) => { model.value = (event.target as HTMLInputElement).files?.[0]?.name || '' }
</script>

<style scoped>
.field-input { @apply block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-950; }
</style>
