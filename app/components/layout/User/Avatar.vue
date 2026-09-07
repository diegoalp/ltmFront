<template class="flex items-center gap-2">
  <img
    :src="avatarUrl ?? null"
    alt="User Avatar"
    class="h-10 w-10 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700"
  />
  <span class="text-sm text-slate-700 dark:text-slate-200 text-medium">{{ userName }}</span>
</template>
<script setup lang="ts">
const userName = 'Diêgo Pessoa'
const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff&size=128`
</script>