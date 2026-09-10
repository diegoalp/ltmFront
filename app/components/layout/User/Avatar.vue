<template>
  <div class="flex min-w-0 items-center gap-2">
    <img
      :src="avatarUrl"
      :alt="`Avatar de ${userName}`"
      class="h-10 w-10 rounded-full border-2 border-slate-300 object-cover dark:border-slate-700"
    >
    <span class="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{{ userName }}</span>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()

const userName = computed(() => user.value?.name || 'Usuário')
const avatarUrl = computed(() => (
  `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=random&color=fff&size=128`
))
</script>
