<template>
    <div class="mt-3">Hello user</div>
</template>

<script setup>

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['user']
})

</script>