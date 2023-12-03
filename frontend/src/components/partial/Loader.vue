

<template>
    <div class="flex align-center">
        <v-progress-circular class="text-primary mr-2" size="small" indeterminate></v-progress-circular>
        <slot>
            <span>{{ text }}</span>
        </slot>
    </div>
</template>


<script setup lang="ts">
defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    text: {
        type: String,
        default: "Načítání",
    },
});
</script>