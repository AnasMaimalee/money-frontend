<script setup lang="ts">
import { theme } from 'ant-design-vue'

const { darkAlgorithm, defaultAlgorithm } = theme
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: defaultAlgorithm,
      token: {
        colorPrimary: '#1f3b4d',
        colorLink: '#1f3b4d',
        colorTextSecondary: '#8a8a8a',
        borderRadius: 10,
      },
    }"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>
