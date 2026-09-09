<template>
  <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
    <div class="mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between px-4 md:px-6">
      <div class="flex items-center gap-3">
        <div class="flex min-w-0 items-center gap-2">
          <img
            v-if="settings.logoDataUrl"
            :src="settings.logoDataUrl"
            :alt="`${settings.companyName} logo`"
            class="h-9 w-9 rounded-lg border border-slate-200 bg-white object-contain p-1 dark:border-slate-800 dark:bg-slate-900"
          >
          <span
            v-else
            class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold shadow-sm"
            :style="{ backgroundColor: settings.primaryColor, color: settings.primaryTextColor }"
          >
            {{ brandInitials }}
          </span>
          <h2 class="truncate text-lg font-semibold priority-color">{{ settings.companyName }}</h2>
        </div>

        <button
          type="button"
          class="flex items-center justify-center rounded-md p-1.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Abrir menu"
          @click="isOpen = true"
        >
          <span class="material-icons text-[22px]">menu</span>
        </button>
        <Avatar />
      </div>


      <div class="flex items-center gap-2">
        <ActivityNotifications v-if="showActivityNotifications" />
        <InstanceSelect />
        <ThemeSwitch />

        <button
          class="flex gap-2 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-slate-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          type="button"
          aria-label="Logout"
          title="Logout"
          @click="logout"
        >
          sair <span class="material-icons text-[15px]">logout</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ActivityNotifications from '~/components/layout/ActivityNotifications.vue'
import ThemeSwitch from '~/components/layout/ThemeSwitch.vue'
import InstanceSelect from '~/components/layout/InstanceSelect.vue'
import Avatar from './User/Avatar.vue';
const { logout } = useAuth()
const { isOpen } = useSidebar()
const { settings } = useBranding()
const route = useRoute()
const showActivityNotifications = computed(() => !route.path.startsWith('/configuracoes'))
const brandInitials = computed(() => settings.value.companyName.slice(0, 2).toUpperCase())
</script>
