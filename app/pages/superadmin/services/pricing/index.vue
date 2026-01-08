<template>
    <div>Hello</div>
</template>

<script setup>
    definePageMeta({
        layout: 'dashboard',
        middleware: 'auth',
        roles: ['superadmin']
    })
</script>