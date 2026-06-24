<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
    <!-- Header Fixo no topo -->
    <AppHeader />
    <main class="mx-auto flex w-full max-w-[1500px] p-4 md:p-6">
      <AppSidebar class="hidden lg:block" />
      <section class="min-w-0 flex-1 space-y-4">
          <slot />
      </section>
    </main>
  </div>
</template>
<script setup>
import AppHeader from '~/components/layout/AppHeader';
import AppSidebar from '~/components/layout/AppSidebar';
</script>