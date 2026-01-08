<template>
    <div>Users Page</div>
</template>

<script setup>
    definePageMeta({
        layout: 'dashboard',
        middleware: 'auth',
        roles: ['superadmin']
    })
</script>