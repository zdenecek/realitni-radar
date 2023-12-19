<template>
    
    <article class="content">
        <h1>Realitní Radar</h1>

        <p>Vítejte v aplikaci Realitní Radar!</p>
        
        <p v-if="auth.user?.role === 'registered'">Děkuji za váš zájem o Realitní Radar. Pro aktivaci účtu mě prosím kontaktujte na email: <a href="mailto:ondrej.elterlein@gmail.com">ondrej.elterlein@gmail.com</a> nebo na <a href="tel:606348638">tel. č. 606 348 638</a>. Vstup do aplikace je zpoplatněn.</p>

        <h2> Přehled počtu inzerátů </h2>

        <listing-count-overview :data="siteStats" :error="error" :extended="auth.isAdmin"></listing-count-overview>

        <h2>Webové rozšíření</h2>
        <p>Webové rozšíření umožňuje jedním kliknutím přejít z Sreality na inzerát na tomto webu</p>

        <v-list nav density="compact" class="d-inline-flex flex-column align-start">
        <v-list-item prepend-icon="mdi-google-chrome" color="primary" title="Odkaz na stažení rozšíření pro Chrome" :href="chrome"></v-list-item>
        <v-list-item prepend-icon="mdi-firefox" title="Odkaz na stažení rozšíření pro Firefox" :href="firefox"></v-list-item>
        </v-list>  
    </article>
</template>

<script setup lang="ts">
import { firefoxUrl as firefox, chromeUrl as chrome } from "@/main";
import ListingCountOverview from "@/components/ListingCountOverview.vue";
import axios from "@/plugins/axios";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const siteStats = ref(undefined);
const error = ref(undefined);

axios.get("/site-stats").then((response) => {
    siteStats.value = response.data;
    error.value = undefined;
}).catch((err) => {
    error.value = err.message;
})


</script>

<style scoped lang="scss">
@import "@/style/theme.scss";

.flex {
    display: flex;
    align-items: center;
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
