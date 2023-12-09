<template>
    <article class="content">
        <h1>Realitní Radar</h1>

        <p>Vítejte v aplikaci Realitní Radar!</p>
    
    </article>
</template>

<script setup lang="ts">
import { firefoxUrl as firefox, chromeUrl as chrome } from "@/main";
</script>

<style scoped lang="scss">
@import "@/style/theme.scss";

.flex {
    display: flex;
    align-items: center;
    gap: .5em;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

li {
    margin-left: 1em;
}

svg {
    stroke: $primary;
}
</style>
