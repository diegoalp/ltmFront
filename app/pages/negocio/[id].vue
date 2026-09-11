<template>
  <div class="w-full min-w-0 text-left text-slate-900 dark:text-slate-100">
    <ClientOnly>
    <div class="w-full min-w-0">
      <section v-if="!deal && (initialLoading || dealsLoading)" key="loading" role="status" class="w-full rounded-2xl border border-slate-200 bg-white p-6 text-left dark:border-slate-800 dark:bg-slate-900">
        Carregando negócio...
      </section>

      <section v-else-if="deal && isDealDisabled(deal)" key="blocked" class="w-full rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        <p>Este negócio está bloqueado. Regularize seus negócios expirados para continuar.</p>
        <NuxtLink to="/" class="mt-3 inline-block font-semibold underline">Voltar ao quadro</NuxtLink>
      </section>
      <section v-else-if="deal" key="detail" class="w-full min-w-0 space-y-6 text-left">
        
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
            <div class="grid grid-cols-1 gap-2">
              <button type="button" class="copy-value text-3xl font-medium tracking-tight" title="Copiar cliente" @click="copyValue('Cliente', deal.title)">{{ deal.title }}</button>
              <div class="flex gap-3">
                  <button type="button" class="rounded-md bg-sky-100 px-2.5 py-1 text-xs text-sky-800 transition hover:ring-2 hover:ring-sky-300 dark:bg-sky-600/40 dark:text-sky-300" title="Copiar categoria" @click="copyValue('Categoria', categoryName)">{{ categoryName }}</button>
                  <button type="button" class="rounded-md px-2.5 py-1 text-xs transition hover:ring-2 hover:ring-slate-300" :style="productStyle" title="Copiar produto" @click="copyValue('Produto', productName)">{{ productName }}</button>
              </div>
            </div>
            <div class="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <label class="flex items-center gap-2">
                <span>Responsável</span>
                <select
                  v-model.number="selectedOwnerId"
                  :disabled="assigningOwner || !availableOwners.length"
                  class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  @change="assignOwner"
                >
                  <option v-if="!availableOwners.length" :value="deal.ownerId">{{ deal.ownerName }}</option>
                  <option v-for="owner in availableOwners" :key="owner.id" :value="owner.id">
                    {{ owner.name }}{{ owner.role === 'admin' || owner.role === 'master' ? ' - Admin' : '' }}
                  </option>
                </select>
              </label>
              <span class="flex items-center gap-1">Criado em <button type="button" class="copy-value inline text-sm text-slate-500 dark:text-slate-400" title="Copiar data de criação" @click="copyValue('Data de criação', formatDate(deal.createdAt))">{{ formatDate(deal.createdAt) }}</button></span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span v-if="isDealLost" class="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              Negócio perdido
            </span>
            <span v-if="isDealWon" class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Negócio ganho
            </span>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="showEditModal = true"
            >
              <Icon name="mdi:pencil-outline" size="16" />
              Editar
            </button>
            <button
              v-if="isCurrentStageFinal && !isDealLost && !isDealWon"
              type="button"
              @click="confirmWinDeal"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Icon name="mdi:trophy-outline" size="16" />
              Ganhar negócio
            </button>
            <button
              type="button"
              @click="openLossModal"
              :disabled="isDealLost || isDealWon"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-slate-800"
            >
              <Icon name="mdi:close-circle-outline" size="16" />
              {{ isDealLost ? 'Negócio perdido' : 'Perder negócio' }}
            </button>
            <NuxtLink
              to="/"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Icon name="mdi:arrow-left" size="16" />
              Voltar ao Kanban
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          <div class="lg:col-span-1 xl:col-span-1 space-y-6">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Dados do Cliente</h3>
              
              <div class="space-y-4">
                <div v-if="hasClientValue(deal.document) || hasClientValue(deal.profession)" class="grid grid-cols-1 gap-4">
                  <div v-if="hasClientValue(deal.document)">
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">CPF</label>
                    <button type="button" class="copy-value text-sm font-semibold" title="Copiar CPF" @click="copyClientValue('CPF', deal.document)">{{ deal.document }}</button>
                  </div>
                  <div v-if="hasClientValue(deal.profession)">
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">Profissão</label>
                    <button type="button" class="copy-value text-sm font-semibold" title="Copiar profissão" @click="copyClientValue('Profissão', deal.profession)">{{ deal.profession }}</button>
                  </div>
                </div>

                <div v-if="hasClientValue(deal.birthDate) || hasClientValue(deal.gender)" class="grid grid-cols-1 gap-4">
                  <div v-if="hasClientValue(deal.birthDate)">
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">Nascimento (Idade)</label>
                    <button type="button" class="copy-value text-sm font-semibold" title="Copiar nascimento" @click="copyClientValue('Nascimento', formatDate(deal.birthDate))">
                      {{ formatDate(deal.birthDate) }} 
                      <span class="text-xs text-slate-500 font-normal">({{ customerAge }} anos)</span>
                    </button>
                  </div>
                  <div v-if="hasClientValue(deal.gender)">
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">Sexo</label>
                    <button type="button" class="copy-value text-sm font-semibold" title="Copiar sexo" @click="copyClientValue('Sexo', deal.gender)">{{ deal.gender }}</button>
                  </div>
                </div>

                <div v-if="[deal.address, deal.city, deal.state, deal.zipCode].some(hasClientValue)" class="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                  <div v-if="hasClientValue(deal.address)">
                    <label class="text-xs text-slate-400 dark:text-slate-500 font-medium">Endereço</label>
                    <button type="button" class="copy-value text-sm font-medium leading-tight text-slate-700 dark:text-slate-300" title="Copiar endereço" @click="copyClientValue('Endereço', deal.address)">
                      {{ deal.address }}
                    </button>
                  </div>
                  
                  <div v-if="[deal.city, deal.state, deal.zipCode].some(hasClientValue)" class="grid grid-cols-3 gap-2 text-xs">
                    <div v-if="hasClientValue(deal.city)">
                      <span class="text-slate-400 block">Cidade</span>
                      <button type="button" class="copy-value block truncate text-xs font-semibold text-slate-800 dark:text-slate-200" title="Copiar cidade" @click="copyClientValue('Cidade', deal.city)">{{ deal.city }}</button>
                    </div>
                    <div v-if="hasClientValue(deal.state)">
                      <span class="text-slate-400 block">Estado</span>
                      <button type="button" class="copy-value block text-xs font-semibold text-slate-800 dark:text-slate-200" title="Copiar estado" @click="copyClientValue('Estado', deal.state)">{{ deal.state }}</button>
                    </div>
                    <div v-if="hasClientValue(deal.zipCode)">
                      <span class="text-slate-400 block">CEP</span>
                      <button type="button" class="copy-value block truncate text-xs font-semibold text-slate-800 dark:text-slate-200" title="Copiar CEP" @click="copyClientValue('CEP', deal.zipCode)">{{ deal.zipCode }}</button>
                    </div>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-slate-400 dark:text-slate-500">Valor Negócio</label>
                    <button type="button" class="copy-value text-base font-bold" title="Copiar valor do negócio" @click="copyClientValue('Valor do negócio', formatCurrency(deal.value))">{{ formatCurrency(deal.value) }}</button>
                  </div>
                  <div v-if="hasClientValue(deal.bank)">
                    <label class="text-xs text-slate-400 dark:text-slate-500">Banco Origem</label>
                    <button type="button" class="copy-value truncate text-sm font-semibold" title="Copiar banco origem" @click="copyClientValue('Banco origem', deal.bank)">{{ deal.bank }}</button>
                  </div>
                </div>

                <div v-if="clientDetailFields.length" class="space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800/60">
                  <div v-for="field in clientDetailFields" :key="field.id">
                    <label class="text-xs font-medium text-slate-400 dark:text-slate-500">{{ field.label }}</label>
                    <button type="button" class="copy-value break-words text-sm font-semibold" :title="`Copiar ${field.label}`" @click="copyClientValue(field.label, displayFieldValue(field, deal.clientCustomFields[field.id]))">{{ displayFieldValue(field, deal.clientCustomFields[field.id]) }}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 xl:col-span-2 space-y-6">
            <div v-if="businessDetailFields.length" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Dados do negócio</h3>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div v-for="field in businessDetailFields" :key="field.id" class="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <p class="text-[10px] font-medium uppercase text-slate-400">{{ field.label }}</p>
                  <button type="button" class="copy-value mt-1 break-words text-sm font-bold" :title="`Copiar ${field.label}`" @click="copyValue(field.label, displaySubFieldValue(field.type, field.value))">{{ displaySubFieldValue(field.type, field.value) }}</button>
                </div>
              </div>
            </div>

            <div v-for="field in repeatableBusinessFields" :key="field.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ field.label }}</h3>
                <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">{{ groupFieldRows(field).length }} {{ groupFieldRows(field).length === 1 ? 'item' : 'itens' }}</span>
              </div>

              <div v-if="groupFieldRows(field).length" class="grid gap-3">
                <div v-for="(row, rowIndex) in groupFieldRows(field)" :key="rowIndex" class="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <div class="grid gap-3 sm:grid-cols-2">
                    <div v-for="subField in field.subFields.filter(sub => hasCustomFieldValue(row[sub.key]))" :key="subField.key">
                      <p class="text-[10px] font-medium uppercase text-slate-400">{{ subField.label }}</p>
                      <button type="button" class="copy-value mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-200" :title="`Copiar ${subField.label}`" @click="copyValue(subField.label, displaySubFieldValue(subField.type, row[subField.key]))">{{ displaySubFieldValue(subField.type, row[subField.key]) }}</button>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-500 dark:border-slate-800">Nenhum item informado.</p>
            </div>

            <BusinessNotes :business-id="deal.id" />
            <BusinessActivities :business-id="deal.id" :funnel-id="deal.funnelId" />

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
                      <button type="button" class="copy-value font-semibold" title="Copiar evento" @click="copyValue('Evento', event.title)">{{ event.title }}</button>
                      <span class="mt-0.5 flex flex-wrap items-center gap-1 text-[10px] text-slate-400">
                        <button type="button" class="copy-value inline text-[10px] text-slate-400 dark:text-slate-400" title="Copiar data do evento" @click="copyValue('Data do evento', formatDate(event.date))">{{ formatDate(event.date) }}</button>
                        <span>por</span>
                        <button type="button" class="copy-value inline text-[10px] text-slate-400 dark:text-slate-400" title="Copiar usuário do evento" @click="copyValue('Usuário do evento', event.userName)">{{ event.userName }}</button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-3 xl:col-span-1 space-y-6">
            <div v-if="hasClientValue(deal.phone)" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Contatos</h3>
              
              <div class="space-y-2">
                <div v-for="(phone, index) in [ { number: deal.phone, isValidated: true, isWhatsapp: true } ]" :key="index" class="flex items-center justify-between bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl text-sm">
                  <div class="flex items-center gap-2">
                    <span :class="phone.isValidated ? 'bg-emerald-500' : 'bg-amber-500'" class="h-2 w-2 rounded-full inline-block"></span>
                    <button type="button" class="copy-value text-sm font-medium text-slate-700 dark:text-slate-300" title="Copiar telefone" @click="copyValue('Telefone', phone.number)">{{ phone.number }}</button>
                  </div>
                  
                  <a v-if="phone.isWhatsapp" :href="`https://wa.me/${phone.number.replace(/\D/g, '')}`" target="_blank" class="text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 transition" title="Chamar no WhatsApp">
                    <Icon name="mdi:whatsapp" size="18" />
                  </a>
                </div>
              </div>
            </div>
            <BusinessDocuments :business-id="deal.id" />
          </div>

        </div>
      </section>

      <section v-else key="not-found" class="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
    </div>
    <template #fallback>
      <section role="status" class="w-full rounded-2xl border border-slate-200 bg-white p-6 text-left dark:border-slate-800 dark:bg-slate-900">Carregando negócio...</section>
    </template>
    </ClientOnly>

    <BusinessEditBusinessModal
      :open="showEditModal"
      :deal="deal || null"
      @close="showEditModal = false"
      @saved="showEditModal = false"
    />

    <div v-if="showLossModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Encerrar negócio sem sucesso</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecione um motivo para registrar a perda.</p>
          </div>
          <button type="button" @click="showLossModal = false" class="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <Icon name="mdi:close" size="18" />
          </button>
        </div>

        <div class="mt-5 space-y-3">
          <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300" for="loss-reason">
            Motivo da perda
          </label>
          <select id="loss-reason" v-model="selectedLossReason" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <option value="" disabled>Selecione um motivo</option>
            <option v-for="reason in lossReasons" :key="reason" :value="reason">{{ reason }}</option>
          </select>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button type="button" @click="showLossModal = false" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
            Cancelar
          </button>
          <button type="button" @click="confirmLoseDeal" :disabled="!selectedLossReason" class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60">
            Salvar perda
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
import BusinessActivities from '~/components/business/BusinessActivities.vue'
import BusinessNotes from '~/components/business/BusinessNotes.vue'
import { useAuth } from '~/composables/useAuth'
import { useKanbanData } from '~/composables/useKanbanData'
import type { CRMCustomField, CRMCustomFieldType, CRMCustomSubFieldType, DealCard, DealStage } from '~/types/crm'
import { formatCurrency, formatDate } from '~/utils/formatters'
import { hasCustomFieldValue, formatCustomFieldValue, savedCustomFieldEntries } from '~/utils/customFieldDisplay'

const { isDealDisabled } = useBusinessExpiration()
const route = useRoute()
const { user, isAuthenticated } = useAuth()
const { request } = useApi()
const toast = useToast()
const { columns, findDealById, moveDeal, assignDealOwner, refreshDeals, dealsLoading } = useKanbanData()
const { categoryById } = useCategories()
const { productById } = useProducts()
const { customFields } = useCustomFields()
const { users, loadUsers } = useUsers()

const dealId = computed(() => {
  const rawId = route.params.id
  return Number(Array.isArray(rawId) ? rawId[0] : rawId)
})

const deal = computed(() => findDealById(dealId.value))
const category = computed(() => deal.value ? categoryById(deal.value.categoryId) : undefined)
const product = computed(() => deal.value ? productById(deal.value.productId) : undefined)
const categoryName = computed(() => category.value?.name ?? 'Sem categoria')
const productName = computed(() => product.value?.name ?? 'Sem produto')
const productStyle = computed(() => ({
  backgroundColor: product.value?.color ?? '#E2E8F0',
  color: product.value?.color ? productTextColor(product.value.color) : '#334155'
}))
const selectedOwnerId = ref<number | null>(null)
const assigningOwner = ref(false)
const availableOwners = computed(() => {
  if (!deal.value) return []

  return users.value.filter(item => ['admin', 'master'].includes(item.role) || String(item.funnelId) === deal.value?.funnelId)
})

const fieldConditionMatches = (field: CRMCustomField) => field.conditions.every(condition => {
  if (!deal.value) return false
  const selected = condition.field === 'funnel_id'
    ? String(deal.value.funnelId || '')
    : condition.field === 'category_id'
      ? String(deal.value.categoryId)
      : String(deal.value.productId || '')
  const included = condition.value.includes(selected)
  return condition.operator === 'equals' ? included : !included
})
const applicableFields = computed(() => customFields.value.filter(field => fieldConditionMatches(field)))
const hasClientValue = hasCustomFieldValue
// Saved values drive the detail view; creation conditions must not hide existing data.
const clientDetailFields = computed(() => savedCustomFieldEntries(deal.value?.clientCustomFields || {}, customFields.value).filter(field => field.type !== 'group'))
// Saved values drive the detail view; creation conditions must not hide existing data.
const businessDetailFields = computed(() => savedCustomFieldEntries(deal.value?.customFields || {}, customFields.value).filter(field => field.type !== 'group'))
const repeatableBusinessFields = computed(() => customFields.value.filter(field => field.type === 'group' && groupFieldRows(field).length > 0))

const displaySubFieldValue = formatCustomFieldValue
const displayFieldValue = (field: { type: string }, value: unknown) => displaySubFieldValue(field.type, value)
const groupFieldRows = (field: CRMCustomField) => {
  const rows = deal.value?.customFields[field.id]
  return Array.isArray(rows) ? rows.filter(row => row && typeof row === 'object' && field.subFields.some(subField => hasCustomFieldValue(row[subField.key]))) as Array<Record<string, unknown>> : []
}

const copyValue = async (label: string, value: unknown) => {
  if (!import.meta.client) return

  const text = String(value ?? '').trim()
  if (!text) return

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    toast.success(`${label} copiado.`)
  } catch {
    toast.error('Não foi possível copiar o conteúdo.')
  }
}
const copyClientValue = copyValue

const productTextColor = (hex: string) => {
  const normalized = hex.replace('#', '')
  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? '#0F172A' : '#FFFFFF'
}
const lossReasons = ['Preço acima do esperado', 'Cliente desistiu', 'Não houve retorno', 'Produto não atende', 'Concorrência venceu', 'Outros']
const showLossModal = ref(false)
const showEditModal = ref(false)
const selectedLossReason = ref('')

if (import.meta.client && !isAuthenticated.value) {
  await navigateTo('/login')
}

const initialLoading = ref(true)
onMounted(async () => {
  try {
    if (!deal.value) await refreshDeals()
    if (!users.value.length) await loadUsers()
  } finally {
    initialLoading.value = false
  }
})

watch(deal, currentDeal => {
  selectedOwnerId.value = currentDeal?.ownerId ?? null
}, { immediate: true })

const stageLabel = computed(() => {
  return columns.value.find((column) => String(column.id) === deal.value?.funnelStageId)?.title ?? 'Desconhecido'
})

const isDealLost = computed(() => (deal.value?.status ?? 'active') === 'lost')
const isDealWon = computed(() => (deal.value?.status ?? 'active') === 'won')
const isCurrentStageFinal = computed(() => columns.value.some(column => column.isFinal && String(column.id) === String(deal.value?.funnelStageId)))

const timeline = computed(() => {
  return [...(deal.value?.timeline ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const changeStage = async (stage: DealStage | string) => {
  if (!deal.value) return
  if (String(deal.value.funnelStageId || deal.value.stage) === String(stage)) return

  await moveDeal(deal.value.id, stage)
  await refreshDeals()
}

const assignOwner = async () => {
  if (!deal.value || !selectedOwnerId.value || selectedOwnerId.value === deal.value.ownerId) return

  const previousOwnerId = deal.value.ownerId
  assigningOwner.value = true
  try {
    await assignDealOwner(deal.value.id, selectedOwnerId.value)
    toast.success('Responsável atualizado.')
  } catch {
    selectedOwnerId.value = previousOwnerId
    toast.error('Não foi possível atribuir este negócio.')
  } finally {
    assigningOwner.value = false
  }
}

const openLossModal = () => {
  selectedLossReason.value = ''
  showLossModal.value = true
}

const confirmWinDeal = async () => {
  if (!deal.value || !isCurrentStageFinal.value) return
  if (!await toast.confirm('O negócio será marcado como ganho.', { title: 'Ganhar negócio?', confirmLabel: 'Confirmar ganho' })) return
  await request(`/businesses/${deal.value.id}`, { method: 'PATCH', body: { status: 2, loss_reason: null } })
  await refreshDeals()
}

const confirmLoseDeal = async () => {
  if (!deal.value || !selectedLossReason.value) return

  await request(`/businesses/${deal.value.id}`, { method: 'PATCH', body: { loss_reason: selectedLossReason.value, status: 0 } })
  await refreshDeals()
  showLossModal.value = false
}
// Calculate age dynamically from the customer's birth date.
const customerAge = computed(() => {
  if (!deal.value?.birthDate) return 0
  
  const birth = new Date(deal.value.birthDate)
  const today = new Date()
  
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  // Subtract one year when the birthday has not occurred yet this year.
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
})
</script>

<style scoped>
.copy-value {
  @apply inline-block max-w-full cursor-copy rounded-md text-left text-slate-900 outline-none transition hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:text-slate-100 dark:hover:text-indigo-300;
}
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
