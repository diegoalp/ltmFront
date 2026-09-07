<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Documentos</h3>
      <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {{ documents.length }}
      </span>
    </div>

    <form class="space-y-3" @submit.prevent="submitDocument">
      <div>
        <label for="document-title" class="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Tipo de documento</label>
        <select
          id="document-title"
          v-model.number="documentTypeId"
          class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
        ><option :value="0" disabled>Selecione o documento</option><option v-for="type in activeDocumentTypes" :key="type.id" :value="type.id">{{ type.name }}</option></select>
      </div>

      <label
        class="flex min-h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-3 py-3 text-center transition"
        :class="isDragging ? 'border-sky-400 bg-sky-50 dark:bg-sky-950/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900'"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <Icon :name="selectedFile ? 'mdi:file-check-outline' : 'mdi:cloud-upload-outline'" size="22" class="mb-1 text-slate-400" />
        <p class="max-w-full truncate text-xs font-semibold text-slate-600 dark:text-slate-300">
          {{ selectedFile?.name || 'Clique para selecionar ou arraste o arquivo' }}
        </p>
        <p class="mt-0.5 text-[10px] text-slate-400">Imagens ou PDF</p>
        <input ref="fileInput" type="file" accept="image/*,application/pdf" class="hidden" @change="onFileChange" />
      </label>

      <button
        type="submit"
        :disabled="!canSubmit || isUploading"
        class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        <Icon :name="isUploading ? 'mdi:loading' : 'mdi:upload-outline'" size="17" :class="{ 'animate-spin': isUploading }" />
        {{ isUploading ? 'Enviando...' : 'Enviar documento' }}
      </button>
    </form>

    <div class="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
      <div v-if="isLoading" class="flex items-center justify-center gap-2 py-5 text-xs text-slate-400">
        <Icon name="mdi:loading" size="18" class="animate-spin" /> Carregando documentos...
      </div>
      <p v-else-if="!documents.length" class="py-4 text-center text-xs text-slate-400">Nenhum documento enviado.</p>
      <div v-else class="space-y-2">
        <div v-for="document in documents" :key="document.id" class="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2 dark:border-slate-800/60 dark:bg-slate-950">
          <a :href="document.fileUrl" target="_blank" rel="noopener noreferrer" class="flex min-w-0 flex-1 items-center gap-2" :title="`Abrir ${document.title}`">
            <Icon :name="document.mimeType === 'application/pdf' ? 'mdi:file-pdf-box' : 'mdi:file-image-outline'" class="flex-shrink-0 text-slate-400" size="18" />
            <span class="min-w-0">
              <span class="block truncate text-xs font-semibold text-slate-700 dark:text-slate-300">{{ document.title }}</span>
              <span class="block truncate text-[10px] text-slate-400">{{ document.fileName }}</span>
            </span>
          </a>
          <button type="button" :disabled="deletingId === document.id" class="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-950/30" :aria-label="`Excluir ${document.title}`" @click="confirmRemoval(document)">
            <Icon :name="deletingId === document.id ? 'mdi:loading' : 'mdi:delete-outline'" size="17" :class="{ 'animate-spin': deletingId === document.id }" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CRMDocument } from '~/types/crm'

const props = defineProps<{ businessId: number }>()
const { listDocuments, uploadDocument, removeDocument } = useDocuments()
const toast = useToast()

const documentTypeId = ref(0)
const { documentTypes, loadDocumentTypes } = useDocumentTypes()
const activeDocumentTypes = computed(() => documentTypes.value.filter(item => item.active))
const selectedDocumentType = computed(() => activeDocumentTypes.value.find(item => item.id === documentTypeId.value))
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const documents = ref<CRMDocument[]>([])
const isLoading = ref(true)
const isUploading = ref(false)
const isDragging = ref(false)
const deletingId = ref<number | null>(null)
const canSubmit = computed(() => Boolean(selectedDocumentType.value && selectedFile.value))

const loadDocuments = async () => {
  isLoading.value = true
  try {
    documents.value = await listDocuments('business', props.businessId)
  } finally {
    isLoading.value = false
  }
}

const selectFile = (file?: File) => {
  if (!file) return
  if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
    toast.error('Selecione um arquivo de imagem ou PDF.')
    return
  }
  selectedFile.value = file
}

const onFileChange = (event: Event) => selectFile((event.target as HTMLInputElement).files?.[0])
const onDrop = (event: DragEvent) => {
  isDragging.value = false
  selectFile(event.dataTransfer?.files[0])
}

const submitDocument = async () => {
  if (!selectedFile.value || !selectedDocumentType.value || isUploading.value) return
  isUploading.value = true
  try {
    const document = await uploadDocument({ title: selectedDocumentType.value.name, documentTypeId: selectedDocumentType.value.id, file: selectedFile.value, type: 'business', objectId: props.businessId })
    documents.value.unshift(document)
    documentTypeId.value = 0
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
    toast.success('Documento enviado com sucesso.')
  } finally {
    isUploading.value = false
  }
}

const confirmRemoval = async (document: CRMDocument) => {
  const confirmed = await toast.confirm(`O documento “${document.title}” será excluído.`, { title: 'Excluir documento?', confirmLabel: 'Excluir' })
  if (!confirmed) return
  deletingId.value = document.id
  try {
    await removeDocument(document.id)
    documents.value = documents.value.filter(item => item.id !== document.id)
    toast.success('Documento excluído com sucesso.')
  } finally {
    deletingId.value = null
  }
}

onMounted(() => Promise.all([loadDocuments(), loadDocumentTypes()]))
watch(() => props.businessId, loadDocuments)
</script>
