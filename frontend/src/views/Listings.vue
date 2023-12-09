<template>
    <div>
        <h1>Prohlížeč inzerátů</h1>
        <listings-view :show-city-filter="false"></listings-view>
    </div>
</template>

<script setup lang="ts">
import ListingsView from "@/components/ListingsView.vue";
</script>