<template>
    <article class="content">
        <h1>Realitní Radar</h1>
        <p>Realitní Radar je prohlížeč inzerátů ze serveru sreality.cz.</p>

        <h2>Aktuálně podporované funkce</h2>
        <ul>
            <li>Periodcké ukládání a aktualize všech inzerátů - neaktualizované inzeráty jsou označeny za smazané</li>
            <li>Filtrování inzerátů</li>
            <li>Zobrazení historie ceny inzerátu</li>
            <li>Pokročilé filtrování podle počtu inzerátů v městech</li>
            <li>
                Přecházení z aplikace na web sreality.cz a naopak, možnost zobrazení všech informací odkazem na
                api
            </li>
        </ul>

        <h2>Webové rozšíření</h2>
        <ul>
            <li>Webové rozšíření (addon)</li>
            <li>Umožňuje jedním kliknutím přejít z sreality na inzerát na tomto webu</li>
        </ul>

        <v-list nav density="compact" class="d-inline-flex flex-column align-start">
        <v-list-item prepend-icon="mdi-google-chrome" color="primary" title="Odkaz na stažení rozšíření pro Chrome" :href="chrome"></v-list-item>
        <v-list-item prepend-icon="mdi-firefox" title="Odkaz na stažení rozšíření pro Firefox" :href="firefox"></v-list-item>
        </v-list>

        <h2>Historie verzí</h2>
        <ul>
            <li>
                23.2.2023
                <ul>
                    <li>Web: Oprava řazení</li>
                </ul>
            </li>

            <li>
                20.2.2023
                <ul>
                    <li>Web: Zobrazování důležitých dat (datumů), změna zobrazování stáří smazaných inzerátů, přidány
                        podíly, oprava nezakliknutí defaultní možnosti u volby zobrazení smazaných inzerátů</li>
                    <li>Scraper: Scraper sbírá podíly, sbíral je ale i do teď, protože se zobrazovaly v api i v jiných
                        kategoriích</li>
                    <li>Databáze: Smazány ceny z 20. 9. 2022, které se po jednom dni změnily</li>
                </ul>
            </li>
            <li>
                12.2.2023
                <ul>
                    <li>Web: Změna zobrazování labelů - slevy nad 30% se zobrazují všechny stejně, svícící prvky byly stejně
                        většinou u nesmyslných slev</li>
                    <li>Web/Api: Pokročilá možnost filtrování smazaných inzerátů - smazané, vše, aktivní</li>
                    <li>Web: Zobrazení smazaných inzerátů - Label posunut před název, při zobrazení smazaných i nesmazaných
                        inzerátů jsou smazané částečně průhledné, při najetí myší a/nebo rozkliknutí detailu se průhlednost
                        obnoví</li>
                    <li>Web: Oprava: při vytvoření filtru z url adresy - uloženého odkazu - je filtr aplikován rovnou při
                        prvním spuštění, ne až při úpravě filtru, další detailní opravy</li>
                </ul>
            </li>
            <li>
                30.1.2023
                <ul>
                    <li>Web: Detail inzerátu, Název stránky</li>
                    <li>Scraper: Oprava přepisování data smazání - historie smazání je špatně</li>
                </ul>
            </li>
            <li>
                23.11.2022
                <ul>
                    <li>Web: Oprava chyby v řazení</li>
                </ul>
            </li>
            <li>
                14.11.2022
                <ul>
                    <li>Web: Přidáno řazení</li>
                    <li>Web: Filtr je nyní perzistentní - při zachování url adresy zůstane filtr i při obnovení stránky.
                        Lze uložit url pro uložení filtru. Přidáno tlačítko vyčištění filtru.
                    </li>
                    <li>Scraper: Scraper umí u inzerátů, kde není cena uvedena jako cena, nýbrž jako položky Původní
                        cena a Zlevněno, správně rozpoznat cenu.
                    </li>
                </ul>
            </li>
            <li>
                22.10.2022
                <ul>
                    <li>Web: Změna barevného schématu labelů kvůli čitelnosti</li>
                    <li>Scraper: Oprava</li>
                </ul>
            </li>
            <li>
                19.10.2022
                <ul>
                    <li>Web: Oprava filtru slevy</li>
                    <li>Web: Přidání nápověd pro dva prvky</li>
                    <li>Web: Přidání barevných labelů</li>
                </ul>
            </li>
            <li>
                18.10.2022
                <ul>
                    <li>Scraper: Oprava přepisování historie cen novější cenou</li>
                    <li>Scraper: Scraper ověřuje, jestli nějaký smazaný inzerát nebyl znovu objeven</li>
                    <li>Databáze: Oprava nekonzistentních dat</li>
                    <li>Databáze: Vytvoření indexů - id, datum vložení</li>
                    <li>Web: Rozdělení filtrů na cenu na nájem a cenu prodeje</li>
                    <li>Web: Přidání filtrů typu i u inzerátů, které nejsou na byt</li>
                    <li>Web: Lze zobrazit smazané inzeráty</li>
                </ul>
            </li>


        </ul>
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
