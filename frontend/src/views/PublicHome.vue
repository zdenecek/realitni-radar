<template>
    
    <article class="content">
        <h1>Realitní Radar</h1>

        <p>Jediná aplikace, která vám řekne, jak dlouho se nemovitost prodává a jak se vyvíjí její cena.</p>

        
        <h2>Sledujte trh a dělejte správná rozhodnutí, díky těmto podporovaným funkcím:</h2>
        <ul class="list">
     <li>Periodcké ukládání a aktualizace všech inzerátů - budete mít vždy aktuální přehled o nabídce nemovitostí na trhu</li>
     <li>Vytváření databáze smazaných inzerátů - budete mít kompletní přehled o trhu nemovitostí včetně historických dat</li>
     <li>Zobrazení délky inzerce - zjistěte, jak dlouho se nemovitost prodává</li>
     <li>Zobrazení změny ceny nemovitosti v čase  - sledujte vývoj cen nemovitostí</li>
     <li>Možnost filtrace podle výše slevy - najděte nemovitost s výraznou slevou</li>
     <li>Možnost filtrace podle stáří inzerátu - zaměřte se na nemovitost, která je na trhu již delší dobu</li>
     <li>Možnost filtrace podle ceny nemovitosti (celkové či na plochu) - najděte nemovitost za svou cenu</li>
     <li>Řazení vyfiltrovaných inzerátů (dle slevy, stáří, ceny celkové či na plochu) - uspořádejte inzeráty podle svých preferencí</li>
     <li>Filtrování podle počtu inzerátů v lokalitě - zjistěte, jaká je nabídka v konkrétním městě</li>
     <li>Řazení a filtrace v rámci smazaných inzerátů - procházejte historické údaje a zjistěte, jak se v daném místě nemovitosti prodávají či pronajímají</li>
     <li>Ukládání filtrovaných inzerátů mezi Oblíbené - uložte si inzeráty, které vás zaujaly, abyste se k nim mohli kdykoli vrátit</li>
     <li>Přecházení z aplikace na web sreality.cz a naopak - snadno přejděte z aplikace na web sreality.cz a naopak</li>
        </ul>

        <h2>Počet inzerátů v databázi</h2>

        <listing-count-overview :data="siteStats" :error="error"></listing-count-overview>


        <p> Získejte nefér výhodu a náskok před konkurencí. Ušetřete měsíce vašeho času. Zaregistrujte se a začněte používat Realitní Radar ještě dnes. </p>

       
    
    </article>
</template>

<script setup lang="ts">
import ListingCountOverview from "@/components/ListingCountOverview.vue";
import axios from "@/plugins/axios";
import { ref } from "vue";

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

ul.list {
    display: flex;
    gap: .2em;
    flex-direction: column;
}



li {
    margin-left: 1em;
}

svg {
    stroke: $primary;
}
</style>
