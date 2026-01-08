<template>
    <div class="mt-3">Hello Administrator</div>
</template>

<script setup>

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['administrator'],
})

</script>