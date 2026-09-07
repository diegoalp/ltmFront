<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
  <PageLoadingOverlay :active="isQuerying" />
  <AppToast position="bottom-right" />
</template>

<script setup lang="ts">
import AppToast from '~/components/layout/AppToast.vue'
import PageLoadingOverlay from '~/components/layout/PageLoadingOverlay.vue'

const { isQuerying } = useApiLoading()
</script>
