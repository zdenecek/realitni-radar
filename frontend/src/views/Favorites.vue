
<template>
    <div>
        <h1>Oblíbené inzeráty</h1>
        <listings-view :show-city-filter="false" url="/favorites"></listings-view>
    </div>
</template>

<script setup lang="ts">
import ListingsView from "@/components/ListingsView.vue";
</script>