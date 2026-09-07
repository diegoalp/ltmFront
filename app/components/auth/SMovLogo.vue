<template>
  <div class="inline-flex items-center gap-3" aria-label="SMov CRM">
    <svg
      class="h-11 w-11 shrink-0"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="gradientId" x1="6" y1="5" x2="42" y2="43" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4F46E5" />
          <stop offset="1" stop-color="#0891B2" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" :fill="`url(#${gradientId})`" />
      <path
        d="M13.5 17.5C13.5 14.4624 15.9624 12 19 12H31.5L27.5 16H19C18.1716 16 17.5 16.6716 17.5 17.5C17.5 18.3284 18.1716 19 19 19H28.5C32.0899 19 35 21.9101 35 25.5C35 29.0899 32.0899 32 28.5 32H16.5L20.5 28H28.5C29.8807 28 31 26.8807 31 25.5C31 24.1193 29.8807 23 28.5 23H19C15.9624 23 13.5 20.5376 13.5 17.5Z"
        fill="white"
      />
      <path d="M13 36L18 31H24L19 36H13Z" fill="#A5F3FC" />
    </svg>

    <div class="flex items-baseline">
      <span class="text-[1.7rem] font-bold leading-none tracking-[-0.055em] text-slate-950 dark:text-white">S</span>
      <span class="text-[1.7rem] font-semibold leading-none tracking-[-0.055em] text-indigo-600 dark:text-indigo-400">Mov</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const gradientId = useId()
</script>
