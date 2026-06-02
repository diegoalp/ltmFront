<template>
  <section class="space-y-4">

    <div class="overflow-x-auto pb-2">
      <div class="flex min-w-max gap-3">
        <KanbanColumn
          v-for="column in columns"
          :key="column.id"
          :column="column"
          :cards="cardsByColumn[column.id]"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { columns, cardsByColumn, totalPipeline } = useKanbanData()

const totalFormatted = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(totalPipeline.value)
})
</script>
