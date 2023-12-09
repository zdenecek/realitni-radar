<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import "toastify-js/src/toastify.css"
</script>


<style>
@import "@/style/utils.scss";

.label {
    margin-bottom: 0.2em;
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>