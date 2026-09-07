<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
    <AppSidebar />

    <div
      class="min-h-screen transition-[padding] duration-300 ease-in-out"
      :class="isOpen ? 'pl-20' : 'pl-0'"
    >
      <AppHeader />

      <main class="mx-auto flex w-full max-w-[1500px] p-4 md:p-6">
        <section class="min-w-0 flex-1 space-y-4">
          <BusinessExpirationAlert />
          <slot />
        </section>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'

const { isOpen } = useSidebar()
</script>
