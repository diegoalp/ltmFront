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
        
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-400">Negociação #{{ deal.id }}</p>
            <!-- <h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">{{ deal.title }}</h1> -->
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Visão completa do negócio e do cliente</p>
          </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="relative">
            <button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" :aria-expanded="showActionsMenu" @click="showActionsMenu = !showActionsMenu">
              <Icon name="mdi:chevron-down" size="16" />
              Ações
            </button>
            <div v-if="showActionsMenu" class="absolute right-0 top-full z-30 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <button v-if="isDealOpen" type="button" class="action-menu-item" @click="showActionsMenu = false; openEdit({ type: 'deal-core', title: 'produto e negócio' })"><Icon name="mdi:pencil-outline" size="16" />Editar</button>
              <button v-if="isCurrentStageFinal && isDealOpen" type="button" class="action-menu-item text-emerald-600 dark:text-emerald-300" @click="showActionsMenu = false; confirmWinDeal()"><Icon name="mdi:trophy-outline" size="16" />Ganhar</button>
              <button v-if="isDealOpen" type="button" class="action-menu-item text-rose-600 dark:text-rose-300" @click="showActionsMenu = false; openLossModal()"><Icon name="mdi:close-circle-outline" size="16" />Perder</button>
              <button v-if="!isDealOpen" type="button" class="action-menu-item text-indigo-600 dark:text-indigo-300" @click="showActionsMenu = false; confirmReopenDeal()"><Icon name="mdi:lock-open-outline" size="16" />Reabrir</button>
              <button v-if="canDeleteDeal" type="button" :disabled="deletingDeal" class="action-menu-item text-rose-700 disabled:cursor-wait disabled:opacity-60 dark:text-rose-300" @click="showActionsMenu = false; confirmDeleteDeal()"><Icon :name="deletingDeal ? 'mdi:loading' : 'mdi:trash-can-outline'" size="16" :class="{ 'animate-spin': deletingDeal }" />{{ deletingDeal ? 'Excluindo...' : 'Remover' }}</button>
            </div>
          </div>
            <NuxtLink
              to="/"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Icon name="mdi:arrow-left" size="16" />
              Voltar
            </NuxtLink>
          </div>
        </div>

        <div class="px-1 py-1">
          <div class="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
            <template v-for="(col, index) in dealStageColumns" :key="col.id">
              <button
                type="button"
                @click="changeStage(col.id)"
                :aria-pressed="String(col.id) === String(deal.funnelStageId || deal.stage)"
                class="rounded-xl border px-4 py-2.5 text-xs font-semibold tracking-wide transition-all"
                :class="String(col.id) === String(deal.funnelStageId || deal.stage)
                  ? 'shadow-md ring-4 ring-black/5 dark:shadow-none dark:ring-white/10'
                  : 'border-transparent bg-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'"
                :style="String(col.id) === String(deal.funnelStageId || deal.stage) ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor, color: accentTextColor } : undefined"
              >
                {{ col.title }}
                <span v-if="String(col.id) === String(deal.funnelStageId || deal.stage)" class="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-white align-middle" aria-hidden="true" />
              </button>
              <Icon v-if="index < dealStageColumns.length - 1" name="mdi:chevron-double-right" size="16" class="mx-1 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true" />
            </template>
          </div>
        </div>

        <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <div class="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div class="flex items-center gap-4 lg:pt-1">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xl font-bold text-indigo-700 ring-8 ring-indigo-50/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:ring-indigo-950/20">
                    {{ dealInitials }}
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <button type="button" class="copy-value block max-w-full truncate text-xl font-semibold tracking-tight" title="Copiar cliente" @click="copyValue('Cliente', deal.title)">{{ deal.title }}</button>
                    <!-- <p class="text-xs text-slate-500 dark:text-slate-400">Criado em {{ formatDate(deal.createdAt) }}</p> -->
                  </div>

                  <div class="mt-1 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
                  <div class="summary-field">
                    <span class="summary-field__label">{{ deal.clientType === 'company' ? 'CNPJ' : 'CPF' }}</span>
                    <button type="button" class="summary-field__value copy-value" title="Copiar documento" @click="copyValue(deal.clientType === 'company' ? 'CNPJ' : 'CPF', deal.document)">{{ deal.document || '—' }}</button>
                  </div>
                  <div class="summary-field">
                    <span class="summary-field__label">Categoria</span>
                    <button type="button" class="summary-field__value copy-value inline-flex w-fit rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300" title="Copiar categoria" @click="copyValue('Categoria', categoryName)">{{ categoryName }}</button>
                  </div>
                  <div class="summary-field">
                    <span class="summary-field__label">Produto</span>
                    <button type="button" class="summary-field__value copy-value inline-flex w-fit rounded-md px-2 py-0.5 text-[10px] font-semibold" :style="productStyle" title="Copiar produto" @click="copyValue('Produto', productName)">{{ productName }}</button>
                  </div>
                  <div class="summary-field">
                    <span class="summary-field__label">Telefone</span>
                    <button type="button" class="summary-field__value copy-value" title="Copiar telefone" @click="copyValue('Telefone', deal.phone)">{{ deal.phone || '—' }}</button>
                  </div>
                  <div class="summary-field">
                    <span class="summary-field__label">Responsável</span>
                    <div class="flex min-w-0 items-center gap-1">
                      <span class="summary-field__value truncate">{{ deal.ownerName }}</span>
                      <button
                        v-if="isDealOpen"
                        type="button"
                        class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
                        title="Alterar responsável"
                        aria-label="Alterar responsável"
                        @click="openOwnerModal"
                      >
                        <Icon name="mdi:pencil-outline" size="15" />
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Dados do negócio -->
            <div class="min-w-0 space-y-6">
              <nav class="overflow-x-auto border-b border-slate-200 dark:border-slate-800" aria-label="Seções do negócio">
                <div class="flex min-w-max items-center gap-1">
                  <button
                    v-for="tab in businessTabs"
                    :key="tab.id"
                    type="button"
                    class="inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition"
                    :class="activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'"
                    :aria-selected="activeTab === tab.id"
                    role="tab"
                    @click="activeTab = tab.id"
                  >
                    <Icon :name="tab.icon" size="17" />
                    {{ tab.label }}
                  </button>
                </div>
              </nav>

              <div v-if="activeTab === 'registration'" class="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-3">
                
                <div class="grid grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2 xl:col-span-2">
                  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div class="mb-4 flex items-center justify-between gap-3">
                      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Dados do Cliente</h3>
                      <button v-if="isDealOpen" type="button" class="edit-card-button" title="Editar dados do cliente" @click="openEdit({ type: 'client-core', title: 'dados do cliente' })">
                        <Icon name="mdi:pencil-outline" size="16" />
                      </button>
                    </div>
                    
                    <div class="space-y-4">
                      <div v-if="hasClientValue(deal.document) || hasClientValue(deal.profession)" class="grid grid-cols-1 gap-4">
                        <div v-if="hasClientValue(deal.document)" class="field-pair">
                          <span class="field-name">CPF</span>
                          <button type="button" class="copy-value field-value" title="Copiar CPF" @click="copyClientValue('CPF', deal.document)">{{ deal.document }}</button>
                        </div>
                        <div v-if="hasClientValue(deal.profession)" class="field-pair">
                          <span class="field-name">Profissão</span>
                          <button type="button" class="copy-value field-value" title="Copiar profissão" @click="copyClientValue('Profissão', deal.profession)">{{ deal.profession }}</button>
                        </div>
                      </div>

                      <div v-if="hasClientValue(deal.birthDate) || hasClientValue(deal.gender)" class="grid grid-cols-1 gap-4">
                        <div v-if="hasClientValue(deal.birthDate)" class="field-pair">
                          <span class="field-name">Nascimento (Idade)</span>
                          <button type="button" class="copy-value field-value" title="Copiar nascimento" @click="copyClientValue('Nascimento', formatDate(deal.birthDate))">
                            {{ formatDate(deal.birthDate) }} 
                            <span class="text-xs text-slate-500 font-normal">({{ customerAge }} anos)</span>
                          </button>
                        </div>
                        <div v-if="hasClientValue(deal.gender)" class="field-pair">
                          <span class="field-name">Sexo</span>
                          <button type="button" class="copy-value field-value" title="Copiar sexo" @click="copyClientValue('Sexo', deal.gender)">{{ deal.gender }}</button>
                        </div>
                      </div>

                      <div v-if="[deal.address, deal.city, deal.state, deal.zipCode].some(hasClientValue)" class="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                        <div v-if="hasClientValue(deal.address)" class="field-pair">
                          <span class="field-name">Endereço</span>
                          <button type="button" class="copy-value field-value font-medium leading-tight text-slate-700 dark:text-slate-300" title="Copiar endereço" @click="copyClientValue('Endereço', deal.address)">
                            {{ deal.address }}
                          </button>
                        </div>
                        
                        <div v-if="[deal.city, deal.state, deal.zipCode].some(hasClientValue)" class="grid grid-cols-3 gap-2 text-xs">
                          <div v-if="hasClientValue(deal.city)" class="field-pair">
                            <span class="field-name">Cidade</span>
                            <button type="button" class="copy-value field-value truncate text-xs text-slate-800 dark:text-slate-200" title="Copiar cidade" @click="copyClientValue('Cidade', deal.city)">{{ deal.city }}</button>
                          </div>
                          <div v-if="hasClientValue(deal.state)" class="field-pair">
                            <span class="field-name">Estado</span>
                            <button type="button" class="copy-value field-value text-xs text-slate-800 dark:text-slate-200" title="Copiar estado" @click="copyClientValue('Estado', deal.state)">{{ deal.state }}</button>
                          </div>
                          <div v-if="hasClientValue(deal.zipCode)" class="field-pair">
                            <span class="field-name">CEP</span>
                            <button type="button" class="copy-value field-value truncate text-xs text-slate-800 dark:text-slate-200" title="Copiar CEP" @click="copyClientValue('CEP', deal.zipCode)">{{ deal.zipCode }}</button>
                          </div>
                        </div>
                      </div>

                      <div class="pt-3 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-2">
                        <div class="field-pair">
                          <span class="field-name">Valor Negócio</span>
                          <button type="button" class="copy-value text-base font-bold" title="Copiar valor do negócio" @click="copyClientValue('Valor do negócio', formatCurrency(deal.value))">{{ formatCurrency(deal.value) }}</button>
                        </div>
                        <div v-if="hasClientValue(deal.bank)" class="field-pair">
                          <span class="field-name">Banco Origem</span>
                          <button type="button" class="copy-value field-value truncate" title="Copiar banco origem" @click="copyClientValue('Banco origem', deal.bank)">{{ deal.bank }}</button>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div v-for="section in clientDetailSections" :key="section.title" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div class="mb-4 flex items-center justify-between gap-3">
                      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ section.title }}</h3>
                      <button v-if="isDealOpen" type="button" class="edit-card-button" :title="`Editar ${section.title}`" @click="openEdit({ type: 'client-custom-section', title: section.title, fieldIds: section.fields.map(field => field.id) })">
                        <Icon name="mdi:pencil-outline" size="16" />
                      </button>
                    </div>
                    <div class="grid gap-4">
                      <div v-for="field in section.fields" :key="field.id" class="field-pair">
                        <span class="field-name">{{ field.label }}</span>
                        <button type="button" class="copy-value field-value" :title="`Copiar ${field.label}`" @click="copyClientValue(field.label, displayFieldValue(field, field.value))">{{ displayFieldValue(field, field.value) || '—' }}</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="lg:col-span-3 xl:col-span-1 space-y-6">
                  <div v-if="hasClientValue(deal.phone)" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div class="mb-3 flex items-center justify-between gap-3">
                      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contatos</h3>
                      <button v-if="isDealOpen" type="button" class="edit-card-button" title="Editar contatos" @click="openEdit({ type: 'client-core', title: 'contatos' })">
                        <Icon name="mdi:pencil-outline" size="16" />
                      </button>
                    </div>
                    
                    <div class="space-y-2">
                      <div v-for="(phone, index) in [ { number: deal.phone, isValidated: true, isWhatsapp: true } ]" :key="index" class="flex items-center justify-between bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl text-sm">
                        <div class="field-pair min-w-0">
                          <span class="field-name">Telefone</span>
                          <div class="flex min-w-0 items-center gap-2">
                          <span :class="phone.isValidated ? 'bg-emerald-500' : 'bg-amber-500'" class="h-2 w-2 rounded-full inline-block"></span>
                            <button type="button" class="copy-value field-value truncate text-slate-700 dark:text-slate-300" title="Copiar telefone" @click="copyValue('Telefone', phone.number)">{{ phone.number }}</button>
                          </div>
                        </div>
                        
                        <a v-if="phone.isWhatsapp" :href="`https://wa.me/${phone.number.replace(/\D/g, '')}`" target="_blank" class="text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 transition" title="Chamar no WhatsApp">
                          <Icon name="mdi:whatsapp" size="18" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div v-else-if="activeTab === 'business'" class="grid gap-6 lg:grid-cols-2">
                <section v-for="section in businessDisplaySections.filter(item => item.fields.length)" :key="section.title" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div class="mb-4 flex items-center justify-between gap-3">
                    <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ section.title }}</h2>
                    <button v-if="isDealOpen" type="button" class="edit-card-button" :title="`Editar ${section.title}`" @click="openEdit({ type: 'business-custom-section', title: section.title, fieldIds: section.fields.map(field => field.id) })">
                      <Icon name="mdi:pencil-outline" size="16" />
                    </button>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div v-for="field in section.fields" :key="field.id" class="field-pair rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                      <span class="field-name">{{ field.label }}</span>
                      <button type="button" class="copy-value field-value" :title="`Copiar ${field.label}`" @click="copyValue(field.label, displaySubFieldValue(field.type, field.value))">{{ displaySubFieldValue(field.type, field.value) || '—' }}</button>
                    </div>
                  </div>
                </section>
                <div v-if="!businessDisplaySections.some(item => item.fields.length)" class="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
                  Nenhum campo adicional do negócio foi informado.
                </div>
              </div>

              <div v-else-if="activeTab.startsWith('repeatable:')" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <template v-if="activeRepeatableField">
                  <div class="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-400">Seção do cadastro</p>
                      <h2 class="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{{ activeRepeatableField.label }}</h2>
                    </div>
                    <button v-if="isDealOpen" type="button" class="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-950/40" @click="openEdit({ type: 'group-new', title: activeRepeatableField.label, groupFieldId: activeRepeatableField.id })">
                      <Icon name="mdi:plus" size="15" />
                      Adicionar
                    </button>
                  </div>
                  <div v-if="groupFieldRows(activeRepeatableField).length" class="grid gap-3 lg:grid-cols-2">
                    <div v-for="(row, rowIndex) in groupFieldRows(activeRepeatableField)" :key="rowIndex" class="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                      <div class="mb-3 flex items-center justify-between gap-2">
                        <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Item {{ rowIndex + 1 }}</span>
                        <div class="flex gap-2">
                          <button v-if="isDealOpen" type="button" class="edit-card-button" :title="`Editar ${activeRepeatableField.label}`" @click="openEdit({ type: 'group-row', title: `${activeRepeatableField.label} #${rowIndex + 1}`, groupFieldId: activeRepeatableField.id, rowIndex })"><Icon name="mdi:pencil-outline" size="16" /></button>
                          <button v-if="isDealOpen" type="button" class="edit-card-button text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-300" :disabled="removingRepeatableRow === activeRepeatableField.id" :title="`Remover ${activeRepeatableField.label}`" @click="removeGroupRow(activeRepeatableField, row)"><Icon :name="removingRepeatableRow === activeRepeatableField.id ? 'mdi:loading' : 'mdi:trash-can-outline'" size="16" :class="{ 'animate-spin': removingRepeatableRow === activeRepeatableField.id }" /></button>
                        </div>
                      </div>
                      <div class="grid gap-3 sm:grid-cols-2">
                        <div v-for="subField in activeRepeatableField.subFields.filter(sub => hasCustomFieldValue(row[sub.key]))" :key="subField.key" class="field-pair">
                          <span class="field-name">{{ subField.label }}</span>
                          <button type="button" class="copy-value field-value text-slate-800 dark:text-slate-200" :title="`Copiar ${subField.label}`" @click="copyValue(subField.label, displaySubFieldValue(subField.type, row[subField.key]))">{{ displaySubFieldValue(subField.type, row[subField.key]) }}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p v-else class="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800">Nenhum item informado em {{ activeRepeatableField.label }}.</p>
                </template>
              </div>

              <div v-else-if="activeTab === 'notes'" class="space-y-4">
                <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div class="mb-3 flex items-center gap-2">
                    <Icon name="mdi:message-text-outline" class="text-indigo-500" />
                    <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Observação do negócio</h2>
                  </div>
                  <p v-if="deal.notes" class="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">{{ deal.notes }}</p>
                  <p v-else class="text-sm text-slate-400">Nenhuma observação cadastrada.</p>
                </section>
                <BusinessNotes :business-id="deal.id" />
              </div>

              <div v-else-if="activeTab === 'activities'">
                <BusinessActivities :business-id="deal.id" :funnel-id="deal.funnelId" @updated="loadDealActivities" />
              </div>

              <div v-else-if="activeTab === 'documents'" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <BusinessDocuments :business-id="deal.id" />
              </div>

              <div v-else class="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div class="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                  <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Linha do Tempo</h2>
                  <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">{{ timeline.length }}</span>
                </div>
                <div class="max-h-[420px] overflow-y-auto p-5 custom-scrollbar">
                  <div v-if="timeline.length" class="relative ml-2 space-y-4 border-l-2 border-slate-100 pl-4 dark:border-slate-800">
                    <div v-for="event in timeline" :key="event.id" class="relative">
                      <span class="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300 ring-4 ring-white dark:bg-slate-700 dark:ring-slate-900"></span>
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
                  <p v-else class="py-8 text-center text-sm text-slate-500">Nenhum evento registrado.</p>
                </div>
              </div>

            </div>
            
          </div>
          <aside class="space-y-4 xl:sticky xl:top-6">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold" :class="statusBadgeClass">
                <span class="h-2.5 w-2.5 rounded-full" :class="isDealWon ? 'bg-emerald-500' : isDealLost ? 'bg-rose-500' : 'bg-blue-500'" />
                <span>{{ statusLabel }}</span>
              </div>
              <div v-if="isDealLost" class="mt-4 rounded-xl bg-rose-50 p-3 dark:bg-rose-950/30">
                <span class="field-name text-rose-600 dark:text-rose-300">Motivo da perda</span>
                <span class="mt-1 block text-sm font-semibold text-rose-800 dark:text-rose-200">{{ deal.lossReason || 'Não informado' }}</span>
              </div>
              <div class="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <span class="field-name">Data de criação</span>
                <span class="mt-1 block text-sm font-semibold text-slate-800 dark:text-slate-100">{{ formatDate(deal.createdAt) }}</span>
              </div>
            </div>
            <div v-if="nextActivity" class="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <div class="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Icon name="mdi:clock-outline" size="18" />
                <span class="text-sm font-bold">Próxima ação</span>
              </div>
              <p class="mt-3 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">{{ nextActivity.activityTypeName }}</p>
              <p class="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ nextActivity.title }}</p>
              <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Prazo: {{ formatActivityDate(nextActivity.scheduledAt) }}</p>
              <button type="button" class="mt-4 w-full rounded-xl bg-amber-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-amber-500" @click="activeTab = 'activities'">Ver atividades</button>
            </div>
            <div class="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
              Checklist do negócio
            </div>
          </aside>
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
      :target="editTarget"
      @close="closeEdit"
      @saved="closeEdit"
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

    <div v-if="showOwnerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Alterar responsável</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecione o usuário responsável por este negócio.</p>
          </div>
          <button type="button" :disabled="assigningOwner" @click="closeOwnerModal" class="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <Icon name="mdi:close" size="18" />
          </button>
        </div>

        <div class="mt-5 space-y-2">
          <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300" for="owner-selection">Usuário responsável</label>
          <select id="owner-selection" v-model.number="ownerSelectionId" :disabled="assigningOwner || !availableOwners.length" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <option v-if="!availableOwners.length" :value="deal?.ownerId">{{ deal?.ownerName }}</option>
            <option v-for="owner in availableOwners" :key="owner.id" :value="owner.id">
              {{ owner.name }}{{ owner.role === 'admin' || owner.role === 'master' ? ' - Admin' : '' }}
            </option>
          </select>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button type="button" :disabled="assigningOwner" @click="closeOwnerModal" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
          <button type="button" :disabled="assigningOwner || !ownerSelectionId || !availableOwners.length" @click="confirmOwnerChange" class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
            <Icon v-if="assigningOwner" name="mdi:loading" size="16" class="animate-spin" />
            {{ assigningOwner ? 'Salvando...' : 'Salvar alteração' }}
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
import { BUSINESS_STATUS } from '~/types/api'
import type { CRMActivity, CRMCustomField, DealStage } from '~/types/crm'
import { formatCurrency, formatDate } from '~/utils/formatters'
import { hasCustomFieldValue, formatCustomFieldValue } from '~/utils/customFieldDisplay'

const { isDealDisabled } = useBusinessExpiration()
const route = useRoute()
const { user, isAuthenticated } = useAuth()
const { request } = useApi()
const toast = useToast()
const { settings } = useBranding()
const { columns, funnelColumns, findDealById, moveDeal, assignDealOwner, loadDealById, removeDeal, dealsLoading } = useKanbanData()
const { categoryById } = useCategories()
const { productById } = useProducts()
const { customFields } = useCustomFields()
const { customFieldSections } = useCrmSettings()
const { users, loadUsers } = useUsers()

type BusinessTab = 'registration' | 'business' | `repeatable:${string}` | 'notes' | 'activities' | 'documents' | 'history'
const activeTab = ref<BusinessTab>('registration')
const accentTextColor = computed(() => {
  const hex = settings.value.accentColor.replace('#', '')
  if (hex.length !== 6) return '#ffffff'
  const channels = [0, 2, 4].map(index => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
  const luminance = channels.map(channel => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0)
  return luminance > 0.55 ? '#111827' : '#ffffff'
})

const dealId = computed(() => {
  const rawId = route.params.id
  return Number(Array.isArray(rawId) ? rawId[0] : rawId)
})

const deal = computed(() => findDealById(dealId.value))
const dealStageColumns = computed(() => deal.value?.funnelId ? funnelColumns(deal.value.funnelId) : columns.value)
const { activities: dealActivities, loadActivities: loadDealActivities } = useBusinessActivities(dealId)
const category = computed(() => deal.value ? categoryById(deal.value.categoryId) : undefined)
const product = computed(() => deal.value ? productById(deal.value.productId) : undefined)
const categoryName = computed(() => category.value?.name ?? 'Sem categoria')
const productName = computed(() => product.value?.name ?? 'Sem produto')
const productStyle = computed(() => ({
  backgroundColor: product.value?.color ?? '#E2E8F0',
  color: product.value?.color ? productTextColor(product.value.color) : '#334155'
}))
const selectedOwnerId = ref<number | null>(null)
const ownerSelectionId = ref<number | null>(null)
const assigningOwner = ref(false)
const showOwnerModal = ref(false)
const availableOwners = computed(() => {
  if (!deal.value) return []

  return users.value.filter(item => ['admin', 'master'].includes(item.role) || String(item.funnelId) === deal.value?.funnelId)
})

const hasClientValue = hasCustomFieldValue
type DetailField = Pick<CRMCustomField, 'id' | 'label' | 'section' | 'type' | 'customFieldSectionId' | 'formSection' | 'formSectionOrder' | 'position'> & { value: unknown }

const detailFieldsFromValues = (values: Record<string, unknown>, fallbackSection: CRMCustomField['section']) => {
  const byId = new Map(customFields.value.map(field => [String(field.id), field]))
  return Object.entries(values)
    .filter(([, value]) => hasCustomFieldValue(value))
    .map(([id, value]) => {
      const definition = byId.get(String(id))
      return {
        id,
        label: definition?.label || `Campo #${id}`,
        section: definition?.section || fallbackSection,
        type: definition?.type || 'text',
        customFieldSectionId: definition?.customFieldSectionId || null,
        formSection: definition?.formSection || null,
        formSectionOrder: definition?.formSectionOrder ?? 0,
        position: definition?.position ?? 0,
        value
      } as DetailField
    })
}
const defaultDetailSection = (section: CRMCustomField['section']) => section === 'client' ? 'Dados complementares do cliente' : section === 'product' ? 'Dados complementares do produto' : 'Dados complementares do negócio'
const groupDetailFields = (fields: DetailField[]) => {
  const sections = new Map<string, { title: string, order: number, fields: DetailField[] }>()
  fields.forEach(field => {
    const configuredSection = customFieldSections.value.find(section => section.id === field.customFieldSectionId)
    const title = configuredSection?.name || field.formSection || defaultDetailSection(field.section)
    const order = configuredSection?.position ?? field.formSectionOrder
    const section = sections.get(title) || { title, order, fields: [] }
    section.order = Math.min(section.order, order)
    section.fields.push(field)
    sections.set(title, section)
  })
  return [...sections.values()]
    .map(section => ({
      ...section,
      fields: [...section.fields].sort((a, b) => a.position - b.position || a.label.localeCompare(b.label))
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}
const groupCustomFields = (fields: CRMCustomField[]) => {
  const sections = new Map<string, { title: string, order: number, fields: CRMCustomField[] }>()
  fields.forEach(field => {
    const configuredSection = customFieldSections.value.find(section => section.id === field.customFieldSectionId)
    const title = configuredSection?.name || field.formSection || defaultDetailSection(field.section)
    const order = configuredSection?.position ?? field.formSectionOrder
    const section = sections.get(title) || { title, order, fields: [] }
    section.order = Math.min(section.order, order)
    section.fields.push(field)
    sections.set(title, section)
  })
  return [...sections.values()]
    .map(section => ({
      ...section,
      fields: [...section.fields].sort((a, b) => a.position - b.position || a.label.localeCompare(b.label))
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}
// Client registration sections come from field definitions so empty configured fields remain visible.
const clientDetailSections = computed(() => groupDetailFields(
  customFields.value
    .filter(field => field.section === 'client' && field.type !== 'group')
    .map(field => ({
      id: field.id,
      label: field.label,
      section: field.section,
      type: field.type,
      customFieldSectionId: field.customFieldSectionId,
      formSection: field.formSection,
      formSectionOrder: field.formSectionOrder,
      position: field.position,
      value: deal.value?.clientCustomFields?.[field.id]
    } as DetailField))
))
// Saved values drive the detail view; creation conditions must not hide existing data.
const businessDetailSections = computed(() => groupDetailFields(detailFieldsFromValues(deal.value?.customFields || {}, 'business').filter(field => ['business', 'product'].includes(field.section) && field.type !== 'group')))
const repeatableBusinessFields = computed(() => customFields.value.filter(field => field.type === 'group'))
const repeatableBusinessSections = computed(() => groupCustomFields(repeatableBusinessFields.value))
const activeRepeatableField = computed(() => {
  if (!activeTab.value.startsWith('repeatable:')) return null
  const fieldId = activeTab.value.slice('repeatable:'.length)
  return repeatableBusinessFields.value.find(field => String(field.id) === fieldId) || null
})
const businessTabs = computed<Array<{ id: BusinessTab, label: string, icon: string }>>(() => [
  { id: 'registration', label: 'Cadastro', icon: 'mdi:card-account-details-outline' },
  { id: 'business', label: 'Negócio', icon: 'mdi:briefcase-outline' },
  ...repeatableBusinessFields.value.map(field => ({ id: `repeatable:${field.id}` as const, label: field.label, icon: 'mdi:format-list-group' })),
  { id: 'notes', label: 'Notas', icon: 'mdi:note-text-outline' },
  { id: 'activities', label: 'Atividades', icon: 'mdi:calendar-clock-outline' },
  { id: 'documents', label: 'Documentos', icon: 'mdi:file-document-outline' },
  { id: 'history', label: 'Histórico', icon: 'mdi:history' }
])
const businessDisplaySections = computed(() => {
  const sections = new Map<string, { title: string, order: number, fields: DetailField[], repeatableFields: CRMCustomField[] }>()

  businessDetailSections.value.forEach(section => {
    sections.set(section.title, {
      title: section.title,
      order: section.order,
      fields: section.fields,
      repeatableFields: []
    })
  })

  repeatableBusinessSections.value.forEach(section => {
    const current = sections.get(section.title) || {
      title: section.title,
      order: section.order,
      fields: [],
      repeatableFields: []
    }

    current.order = Math.min(current.order, section.order)
    current.repeatableFields = section.fields
    sections.set(section.title, current)
  })

  return [...sections.values()].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
})

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
const showActionsMenu = ref(false)
const showEditModal = ref(false)
type BusinessEditTarget = {
  type: 'client-core' | 'deal-core' | 'client-custom-section' | 'business-custom-section' | 'group-row' | 'group-new'
  title?: string
  fieldIds?: string[]
  groupFieldId?: string
  rowIndex?: number
}
const editTarget = ref<BusinessEditTarget | null>(null)
const selectedLossReason = ref('')
const deletingDeal = ref(false)
const removingRepeatableRow = ref<string | null>(null)

const openEdit = (target: BusinessEditTarget) => {
  if (!isDealOpen.value) return
  editTarget.value = target
  showEditModal.value = true
}
const closeEdit = () => {
  showEditModal.value = false
  editTarget.value = null
}

const removeGroupRow = async (field: CRMCustomField, row: Record<string, unknown>) => {
  if (!deal.value || !isDealOpen.value || removingRepeatableRow.value) return
  const rows = Array.isArray(deal.value.customFields[field.id])
    ? deal.value.customFields[field.id] as Array<Record<string, unknown>>
    : []
  const rowIndex = rows.findIndex(item => item === row)
  if (rowIndex < 0) return
  if (!await toast.confirm(`A linha selecionada de “${field.label}” será removida.`, { title: 'Remover valor?', confirmLabel: 'Remover' })) return

  removingRepeatableRow.value = field.id
  try {
    const nextRows = rows.filter((_, index) => index !== rowIndex)
    await request(`/businesses/${deal.value.id}`, {
      method: 'PATCH',
      body: { custom_data: { custom_fields: { ...deal.value.customFields, [field.id]: nextRows } } }
    })
    await loadDealById(deal.value.id)
    toast.success('Valor removido com sucesso.')
  } catch {
    // useApi displays the API error globally.
  } finally {
    removingRepeatableRow.value = null
  }
}

if (import.meta.client && !isAuthenticated.value) {
  await navigateTo('/login')
}

const initialLoading = ref(true)
onMounted(async () => {
  try {
    if (!deal.value) await loadDealById(dealId.value)
    await loadDealActivities()
    if (!users.value.length) await loadUsers()
  } finally {
    initialLoading.value = false
  }
})

watch(deal, currentDeal => {
  selectedOwnerId.value = currentDeal?.ownerId ?? null
}, { immediate: true })

const isDealLost = computed(() => (deal.value?.status ?? 'active') === 'lost')
const isDealWon = computed(() => (deal.value?.status ?? 'active') === 'won')
const isDealOpen = computed(() => Boolean(deal.value) && !isDealLost.value && !isDealWon.value)
const dealInitials = computed(() => (deal.value?.title || 'Negócio').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase())
const statusLabel = computed(() => isDealWon.value ? 'Ganho' : isDealLost.value ? 'Perdido' : 'Em andamento')
const statusBadgeClass = computed(() => isDealWon.value
  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
  : isDealLost.value
    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
    : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
)
const canDeleteDeal = computed(() => {
  if (!deal.value || !user.value) return false

  const role = String(user.value.role || '').toLowerCase()
  if (role === 'master' || role === 'admin') return true

  return role === 'seller' && isDealOpen.value && String(deal.value.ownerId) === String(user.value.id)
})
const isCurrentStageFinal = computed(() => dealStageColumns.value.some(column => column.isFinal && String(column.id) === String(deal.value?.funnelStageId)))

const timeline = computed(() => {
  return [...(deal.value?.timeline ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})
const nextActivity = computed<CRMActivity | null>(() => [...dealActivities.value]
  .filter(activity => activity.status === 'pending')
  .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0] || null)
const formatActivityDate = (value: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

const changeStage = async (stage: DealStage | string) => {
  if (!deal.value) return
  if (String(deal.value.funnelStageId || deal.value.stage) === String(stage)) return

  await moveDeal(deal.value.id, stage)
  await loadDealById(deal.value.id)
}

const assignOwner = async () => {
  if (!deal.value || !selectedOwnerId.value || selectedOwnerId.value === deal.value.ownerId) return false

  const previousOwnerId = deal.value.ownerId
  assigningOwner.value = true
  try {
    await assignDealOwner(deal.value.id, selectedOwnerId.value)
    toast.success('Responsável atualizado.')
    return true
  } catch {
    selectedOwnerId.value = previousOwnerId
    toast.error('Não foi possível atribuir este negócio.')
    return false
  } finally {
    assigningOwner.value = false
  }
}

const openOwnerModal = () => {
  if (!deal.value || !isDealOpen.value) return
  ownerSelectionId.value = deal.value.ownerId
  showOwnerModal.value = true
}

const closeOwnerModal = () => {
  if (assigningOwner.value) return
  showOwnerModal.value = false
}

const confirmOwnerChange = async () => {
  if (!deal.value || !ownerSelectionId.value) return
  if (ownerSelectionId.value === deal.value.ownerId) {
    closeOwnerModal()
    return
  }

  selectedOwnerId.value = ownerSelectionId.value
  if (await assignOwner()) closeOwnerModal()
}

const openLossModal = () => {
  selectedLossReason.value = ''
  showLossModal.value = true
}

const confirmWinDeal = async () => {
  if (!deal.value || !isCurrentStageFinal.value) return
  if (!await toast.confirm('O negócio será marcado como ganho.', { title: 'Ganhar negócio?', confirmLabel: 'Confirmar ganho' })) return
  await request(`/businesses/${deal.value.id}`, { method: 'PATCH', body: { status: BUSINESS_STATUS.WON, loss_reason: null } })
  await loadDealById(deal.value.id)
}

const confirmLoseDeal = async () => {
  if (!deal.value || !selectedLossReason.value) return

  await request(`/businesses/${deal.value.id}`, { method: 'PATCH', body: { loss_reason: selectedLossReason.value, status: BUSINESS_STATUS.LOST } })
  await loadDealById(deal.value.id)
  showLossModal.value = false
}

const confirmReopenDeal = async () => {
  if (!deal.value || isDealOpen.value) return
  if (!await toast.confirm('O negócio voltará a ficar aberto.', { title: 'Reabrir negócio?', confirmLabel: 'Confirmar reabertura' })) return
  await request(`/businesses/${deal.value.id}`, { method: 'PATCH', body: { status: BUSINESS_STATUS.OPEN, loss_reason: null } })
  await loadDealById(deal.value.id)
}

const confirmDeleteDeal = async () => {
  if (!deal.value || !canDeleteDeal.value || deletingDeal.value) return
  if (!await toast.confirm('O negócio será excluído permanentemente.', { title: 'Excluir negócio?', confirmLabel: 'Excluir' })) return

  deletingDeal.value = true
  try {
    await removeDeal(deal.value.id)
    toast.success('Negócio removido com sucesso.')
    await navigateTo('/')
  } catch {
    // useApi displays the API error globally.
  } finally {
    deletingDeal.value = false
  }
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
.field-pair {
  @apply min-w-0 space-y-1;
}
.field-name {
  @apply block text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500;
}
.field-value {
  @apply block break-words text-sm font-semibold;
}
.summary-field {
  @apply min-w-0 space-y-1;
}
.summary-field__label {
  @apply block text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500;
}
.summary-field__value {
  @apply block max-w-full truncate text-sm font-semibold text-slate-800 dark:text-slate-100;
}
.action-menu-item {
  @apply flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800;
}
.edit-card-button {
  @apply inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:border-slate-800 dark:hover:bg-indigo-950 dark:hover:text-indigo-300;
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
