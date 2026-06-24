<template>
  <div>
    <!-- Cabeçalho da Página -->
    <div class="border-b border-gray-200 pb-5 mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">Configurações da Instância</h1>
      <p class="mt-2 text-sm text-gray-500">
        Gerencie as regras de negócio, acessos, automações e integrações do seu CRM.
      </p>
    </div>

    <!-- Grid em Duas Colunas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Seção: Gestão Comercial -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span class="w-2 h-4 bg-indigo-600 rounded-full inline-block"></span>
            Gestão Comercial
          </h2>
          <p class="text-xs text-gray-400 mt-1 mb-4">Configure o fluxo e os produtos do setor de vendas.</p>
          
          <nav class="space-y-2">
            <NuxtLink to="/configuracoes/etapas" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Etapas do Funil</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
            <NuxtLink to="/configuracoes/produtos" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Produtos</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
            <NuxtLink to="/configuracoes/origens" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Origens de Leads</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
          </nav>
        </div>
      </div>

      <!-- Seção: Controle de Acesso -->
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
              <span>Tabulações (Status)</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
          </nav>
        </div>
      </div>

      <!-- Seção: Sistema & Conexões -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between md:col-span-2">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span class="w-2 h-4 bg-amber-500 rounded-full inline-block"></span>
            Sistema & Conexões
          </h2>
          <p class="text-xs text-gray-400 mt-1 mb-4">Configure chaves de API, Webhooks e integrações com plataformas externas.</p>
          
          <nav class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <NuxtLink to="/configuracoes/integracoes" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition group">
              <span>Integrações (WhatsApp, Webhooks, Facebook)</span>
              <span class="text-gray-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </NuxtLink>
          </nav>
        </div>
      </div>

    </div>
  </div>
</template>