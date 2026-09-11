<template>
  <aside v-if="hasExpiredDeals" role="alert" class="rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100">
    <p class="font-semibold">Você tem {{ expiredOwnDeals.length }} negócio(s) expirado(s).</p>
    <p class="mt-1 text-sm">Regularize os negócios expirados para liberar os demais cards e a criação de novos negócios.</p>
    <div class="mt-2 flex flex-wrap gap-2">
      <NuxtLink v-for="deal in expiredOwnDeals" :key="deal.id" :to="`/negocio/${deal.id}`" class="rounded-lg border border-rose-300 px-3 py-1 text-sm font-semibold underline dark:border-rose-700">{{ deal.title }}</NuxtLink>
    </div>
  </aside>
</template>
<script setup lang="ts">
const { expiredOwnDeals, hasExpiredDeals, now } = useBusinessExpiration()
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  now.value = Date.now()
  timer = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>
