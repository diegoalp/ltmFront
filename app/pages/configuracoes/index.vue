<template>
  <div class="settings-page">
    <!-- Page header -->
    <div class="border-b border-gray-200 pb-5 mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">Configurações da Instância</h1>
      <p class="mt-2 text-sm text-gray-500">
        Gerencie os produtos de crédito, regras comerciais, acessos e captação do seu CRM de consignado.
      </p>
    </div>

    <!-- Grid em Duas Colunas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between md:col-span-2 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2 dark:text-slate-100">
            <span class="w-2 h-4 bg-violet-600 rounded-full inline-block"></span>
            Estrutura da Operação
          </h2>
          <p class="text-xs text-gray-400 mt-1 mb-4 dark:text-slate-500">Configure os funis e as informações usadas na jornada das propostas de crédito consignado.</p>
          <NuxtLink to="/instancias" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group dark:text-slate-300 dark:hover:bg-slate-800">
            <span>Instâncias</span>
            <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </NuxtLink>
          <NuxtLink to="/configuracoes/funis" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group dark:text-slate-300 dark:hover:bg-slate-800">
            <span>Múltiplos funis</span>
            <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </NuxtLink>
          <NuxtLink to="/configuracoes/campos" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group dark:text-slate-300 dark:hover:bg-slate-800">
            <span>Construtor de ficha e campos</span>
            <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between md:col-span-2">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span class="w-2 h-4 rounded-full inline-block" style="background-color: var(--crm-primary);"></span>
            Identidade Visual
          </h2>
          <p class="text-xs text-gray-400 mt-1 mb-4">Configure logotipo, nome da marca e esquema de cores da interface.</p>

          <NuxtLink to="/configuracoes/identidade" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
            <span>Personalizar marca do CRM</span>
            <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </NuxtLink>
        </div>
      </div>
      
      <!-- Sales management section -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span class="w-2 h-4 bg-indigo-600 rounded-full inline-block"></span>
            Gestão Comercial
          </h2>
          <p class="text-xs text-gray-400 mt-1 mb-4">Configure o fluxo e os produtos do setor de vendas.</p>
          
          <nav class="space-y-2">
            <!-- <NuxtLink to="/configuracoes/etapas" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Etapas do Funil</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink> -->
            <NuxtLink to="/configuracoes/produtos" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Produtos</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
            <NuxtLink to="/configuracoes/categorias" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Categorias de Clientes</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
            <NuxtLink to="/configuracoes/origens" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Origens de Leads</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
            <NuxtLink to="/configuracoes/tipos-atividades" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group"><span>Tipos de atividades</span><span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span></NuxtLink>
            <NuxtLink to="/configuracoes/tipos-documentos" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group"><span>Tipos de documentos</span><span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span></NuxtLink>
          </nav>
        </div>
      </div>

      <!-- Access control section -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span class="w-2 h-4 bg-emerald-600 rounded-full inline-block"></span>
            Controle de Acesso
          </h2>
          <p class="text-xs text-gray-400 mt-1 mb-4">Gerencie membros, permissões e regras de atendimento.</p>
          
          <nav class="space-y-2">
            <NuxtLink to="/configuracoes/usuarios" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Usuários e Equipes</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
            <NuxtLink to="/configuracoes/tabulacoes" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Tabulações (Motivos de perda)</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
            <!-- <NuxtLink to="/configuracoes/permissoes" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Papéis e Permissões</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink> -->
          </nav>
        </div>
      </div>

      <!-- System and integrations section -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between md:col-span-2 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2 dark:text-slate-100">
            <span class="w-2 h-4 bg-amber-500 rounded-full inline-block"></span>
            Captação
          </h2>
          <p class="text-xs text-gray-400 mt-1 mb-4 dark:text-slate-500">Configure entradas públicas para captação de novos clientes interessados em consignado.</p>
          
          <nav>
            <NuxtLink to="/configuracoes/formularios" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group dark:text-slate-300 dark:hover:bg-slate-800">
              <span>Formulários de captação</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
          </nav>
        </div>
      </div>

    </div>
  </div>
</template>
