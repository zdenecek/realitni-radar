
<template>
    <div class="flex flex-column gap align-start" v-if="data">
        <p>
            <span class="font-weight-bold"> {{ data.countLive.toLocaleString() }} </span>
            počet aktivních inzerátů
        </p>
        <p>
            <span class="font-weight-bold">{{ data.countAll.toLocaleString() }}</span> celkový počet inzerátů v databázi
        </p>
        <p v-if="extended">
            {{ data.countLiveWithoutAddress.toLocaleString() }} inzerátů bez adresy ({{ data.countWithoutAddress.toLocaleString() }} včetně smazaných)
        </p>
    </div>
    <div v-else-if="error">
        <p>Chyba při načítání dat</p>
        <p>{{ error }}</p>
    </div>
    <div v-else>
        <loader>Načítání dat...</loader>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import Loader from '@/components/partial/Loader.vue';

defineProps({
    data: {
        type: Object,
        default: undefined,
    },
    error: {
        type: String,
        default: undefined,
    },
    extended: {
        type: Boolean,
        default: false,
    }
})

</script>