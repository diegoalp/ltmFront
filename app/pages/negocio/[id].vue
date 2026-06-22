<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
    <AppHeader />

    <main class="mx-auto flex min-h-screen w-full max-w-[1600px] items-start p-4 md:p-6">
      <AppSidebar class="hidden lg:block" />

      <section v-if="deal" class="min-w-0 flex-1 space-y-6">
        
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              v-for="col in columns"
              :key="col.id"
              @click="changeStage(col.id)"
              :aria-pressed="col.id === deal.stage"
              class="relative rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all"
              :class="col.id === deal.stage 
                ? 'bg-slate-900 text-white shadow dark:bg-slate-100 dark:text-slate-900' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'"
            >
              {{ col.title }}
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <div class="grid grid-cols- gap-2">
              <h1 class="text-3xl font-medium tracking-tight text-slate-900 dark:text-slate-100">{{ deal.title }}</h1>
              <div class="flex gap-3">
                  <span class="text-xs bg-sky-100 text-sky-800 dark:bg-sky-600/40 dark:text-sky-300 px-2.5 py-1 rounded-md">{{ deal.company }}</span>
                  <span class="text-xs rounded-md px-2.5 py-1" :class="deal.operation.color">{{ deal.operation.name }}</span>
              </div>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Responsável: {{ deal.ownerName }} • Criado em {{ formatDate(deal.createdAt) }}</p>
          </div>

          <NuxtLink
            to="/"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Icon name="mdi:arrow-left" size="16" />
            Voltar ao Kanban
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          <div class="lg:col-span-1 xl:col-span-1 space-y-6">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Dados do Cliente</h3>
              
              <div class="space-y-4">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">CPF</label>
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ deal.document }}</p>
                  </div>
                  <div>
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">Profissão</label>
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ deal.profession || 'Não informada' }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">Nascimento (Idade)</label>
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {{ deal.birthDate ? formatDateResume(deal.birthDate) : '00/00/0000' }} 
                      <span class="text-xs text-slate-500 font-normal">({{ customerAge }} anos)</span>
                    </p>
                  </div>
                  <div>
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">Sexo</label>
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ deal.gender || 'Não informado' }}</p>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                  <div>
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">Endereço</label>
                    <p class="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
                      {{ deal.address || 'Rua não informada' }}
                    </p>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span class="text-slate-400 block">Cidade</span>
                      <span class="font-semibold text-slate-800 dark:text-slate-200 truncate block">{{ deal.city || '-' }}</span>
                    </div>
                    <div>
                      <span class="text-slate-400 block">Estado</span>
                      <span class="font-semibold text-slate-800 dark:text-slate-200 block">{{ deal.state || '-' }}</span>
                    </div>
                    <div>
                      <span class="text-slate-400 block">CEP</span>
                      <span class="font-semibold text-slate-800 dark:text-slate-200 block truncate">{{ deal.zipCode || '-' }}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-slate-400 dark:text-slate-500">Valor Negócio</label>
                    <p class="text-base font-bold text-slate-900 dark:text-slate-100">{{ formatCurrency(deal.value) }}</p>
                  </div>
                  <div>
                    <label class="text-xs text-slate-400 dark:text-slate-500">Banco Origem</label>
                    <p class="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">{{ deal.bank }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 xl:col-span-2 space-y-6">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Matrículas</h3>
                <span class="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">1 ativa</span>
              </div>
              
              <div class="grid gap-3 sm:grid-cols-1">
                <div v-for="mat in [ { numero: '8472910-X', orgao: 'SIAPE', convenio: 'Federal', situacao: 'Ativo Permanente' } ]" :key="mat.numero" class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">Nº {{ mat.numero }}</span>
                    <span class="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">{{ mat.situacao }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/50">
                    <div>
                      <p class="text-slate-400">Órgão</p>
                      <p class="font-semibold text-slate-800 dark:text-slate-200">{{ mat.orgao }}</p>
                    </div>
                    <div>
                      <p class="text-slate-400">Convênio</p>
                      <p class="font-semibold text-slate-800 dark:text-slate-200">{{ mat.convenio }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contratos</h3>
              </div>

              <div class="grid gap-4 sm:grid-cols-1 xl:grid-cols-1">
                <div v-for="contrato in [ { banco: deal.bank, saldo: deal.value * 0.8, parcela: 450.00, totalParc: 84, restParc: 42 } ]" :key="contrato.banco" class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow transition">
                  <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                      <Icon name="mdi:bank-outline" class="text-slate-400" size="18" />
                      <span class="font-bold text-sm text-slate-900 dark:text-slate-100">{{ contrato.banco }}</span>
                    </div>
                    <span class="text-[11px] bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-semibold px-2 py-0.5 rounded-full">
                      {{ contrato.restParc }} de {{ contrato.totalParc }} rest.
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl">
                      <p class="text-[10px] uppercase text-slate-400 font-medium">Saldo Devedor</p>
                      <p class="text-base font-bold text-slate-900 dark:text-slate-100">{{ formatCurrency(contrato.saldo) }}</p>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl">
                      <p class="text-[10px] uppercase text-slate-400 font-medium">Valor Parcela</p>
                      <p class="text-base font-bold text-slate-900 dark:text-slate-100">{{ formatCurrency(contrato.parcela) }}</p>
                    </div>
                  </div>

                  <div class="mt-3">
                    <div class="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Progresso do contrato</span>
                      <span>{{ Math.round(((contrato.totalParc - contrato.restParc) / contrato.totalParc) * 100) }}% pago</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-emerald-500 h-1.5 rounded-full" :style="{ width: `${((contrato.totalParc - contrato.restParc) / contrato.totalParc) * 100}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div class="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Linha do Tempo</h2>
                <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {{ timeline.length }}
                </span>
              </div>

              <div class="max-h-[280px] overflow-y-auto p-4 custom-scrollbar">
                <div class="relative border-l-2 border-slate-100 dark:border-slate-800 ml-2 space-y-4 pl-4">
                  <div v-for="event in timeline" :key="event.id" class="relative">
                    <span class="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900"></span>
                    <div class="text-xs">
                      <span class="font-semibold text-slate-900 dark:text-slate-100 block">{{ event.title }}</span>
                      <span class="text-[10px] text-slate-400 block mt-0.5">{{ formatDate(event.date) }} por {{ event.userName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-3 xl:col-span-1 space-y-6">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Contatos</h3>
              
              <div class="space-y-2">
                <div v-for="(phone, index) in [ { number: deal.phone, isValidated: true, isWhatsapp: true } ]" :key="index" class="flex items-center justify-between bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl text-sm">
                  <div class="flex items-center gap-2">
                    <span :class="phone.isValidated ? 'bg-emerald-500' : 'bg-amber-500'" class="h-2 w-2 rounded-full inline-block"></span>
                    <span class="font-medium text-slate-700 dark:text-slate-300">{{ phone.number }}</span>
                  </div>
                  
                  <a v-if="phone.isWhatsapp" :href="`https://wa.me/${phone.number.replace(/\D/g, '')}`" target="_blank" class="text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 transition" title="Chamar no WhatsApp">
                    <Icon name="mdi:whatsapp" size="18" />
                  </a>
                </div>
              </div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Documentos</h3>
              
              <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition mb-4">
                <div class="flex flex-col items-center justify-center pt-3 pb-3">
                  <Icon name="mdi:cloud-upload-outline" size="22" class="text-slate-400 mb-1" />
                  <p class="text-xs text-slate-500 dark:text-slate-400"><span class="font-semibold">Clique para subir</span> ou arraste</p>
                  <p class="text-[10px] text-slate-400">RG, CNH, Comprovantes...</p>
                </div>
                <input type="file" class="hidden" multiple />
              </label>

              <div class="space-y-1.5">
                <div v-for="doc in ['RG_Frente.pdf', 'Comprovante_Residencia.jpeg']" :key="doc" class="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 text-xs">
                  <div class="flex items-center gap-2 truncate">
                    <Icon name="mdi:file-document-outline" class="text-slate-400 flex-shrink-0" size="16" />
                    <span class="truncate font-medium text-slate-700 dark:text-slate-300">{{ doc }}</span>
                  </div>
                  <button class="text-rose-500 hover:text-rose-600 p-1">
                    <Icon name="mdi:delete-outline" size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section v-else class="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="max-w-sm mx-auto space-y-4">
          <Icon name="mdi:alert-circle-outline" size="48" class="text-slate-300 dark:text-slate-700 mx-auto" />
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Ops, esta negociação não existe.</h2>
          <p class="text-sm text-slate-500">O registro pode ter sido removido ou o ID está incorreto.</p>
          <NuxtLink
            to="/"
            class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Voltar ao Kanban
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { inlineConfig } from '#build/types/app.config'
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
import { useAuthMock } from '~/composables/useAuthMock'
import { useKanbanData } from '~/composables/useKanbanData'
import type { DealCard } from '~/types/crm'
import { formatCurrency, formatDate } from '~/utils/formatters'

const route = useRoute()
const { user, isAuthenticated } = useAuthMock()
const { columns, findDealById, moveDeal } = useKanbanData()

const dealId = computed(() => {
  const rawId = route.params.id
  return Number(Array.isArray(rawId) ? rawId[0] : rawId)
})

const deal = computed(() => findDealById(dealId.value))

if (import.meta.client && !isAuthenticated.value) {
  await navigateTo('/login')
}

if (process.client && !deal.value) {
  await navigateTo('/')
}

const stageLabel = computed(() => {
  return columns.value.find((column) => column.id === deal.value?.stage)?.title ?? 'Desconhecido'
})

const timeline = computed(() => {
  return [...(deal.value?.timeline ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const changeStage = (stage: number) => {
  if (!deal.value) return
  if (deal.value.stage === stage) return

  moveDeal(deal.value.id, stage as any)

  deal.value.timeline = deal.value.timeline ?? []
  const nextId = (deal.value.timeline.reduce((max, it) => Math.max(max, it.id), 0) || 0) + 1
  const stageName = columns.value.find((c) => c.id === stage)?.title ?? `Fase ${stage}`
  deal.value.timeline.push({ id: nextId, date: new Date().toISOString(), title: `Movido para ${stageName}`, userName: user.value?.name ?? 'Sistema' })
}
// Cálculo dinâmico da idade baseado na data de nascimento do cliente
const customerAge = computed(() => {
  if (!deal.value?.birthDate) return 0
  
  const birth = new Date(deal.value.birthDate)
  const today = new Date()
  
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  // Ajusta se o aniversário ainda não aconteceu no ano corrente
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>