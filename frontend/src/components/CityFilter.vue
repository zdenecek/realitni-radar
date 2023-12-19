<template>
    <div>
        <div class="flex">
            <h2 class="mr-4">Města</h2>
            <v-tooltip
                text="Při odemčení bude výčet měst ovlivňován dalšími změnami filtru. V počtech inzerátů pro město budou zahrnuty pouze inzeráty odpovídající filtru">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" @click="toggleLock" variant="outlined" size="small"
                        :prepend-icon="locked ? 'mdi-lock-outline' : 'mdi-lock-off-outline'"
                        :text="locked ? 'Odemknout' : 'Zamknout'">
                    </v-btn>
                </template>
            </v-tooltip>
            <v-btn @click="visible = !visible" :text="visible ? 'Skrýt' : 'Zobrazit'" size="small"
                :prepend-icon="visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" variant="outlined"></v-btn>
        </div>

        <div class="animation-wrapper">
            <transition name="expand">
                <div class="form " v-show="visible">
                    <div>
                        <div class="label">Počet inzerátů ve městě</div>
                        <div class="flex align-center">
                            <v-text-field class="numeric" type="number" v-model.number="range[0]" label="od"></v-text-field>
                            <v-text-field class="numeric" type="number" v-model.number="range[1]" label="do"></v-text-field>
                            <loader v-show="loading" text="Načítání měst..."></loader>
                        </div>
                        <h4 class="text-primary mt-4" v-show="!initial && !loading">Nalezená města (celkem {{ cities.length }} měst s {{ sum }} inzeráty)</h4>
                        <div v-show="!initial && cities.length == 0 && !loading" class="flex">
                            <span>Města s takovým počtem inzerátů nejsou v databázi</span>
                        </div>

                    </div>
                    <div class="flex flex-col" v-show="cities.length > 0 && !loading">
                        <div class="flex align-center mt-2">
                            <span class="mr-4">Vybráno {{ selectedCities.length }} měst</span>
                            <v-btn @click="toggleAll()">Vybrat všechna</v-btn>
                            <v-btn @click="toggleAll(false)">Zrušit výběr</v-btn>
                        </div>
                        <div class="grid mt-2">
                            <v-text-field v-model="search" label="Hledat"></v-text-field>
                            <v-select label="Kraj" variant="outlined" density="compact" :items="regions" clearable
                                hide-details v-model="region"></v-select>
                        </div>
                        <v-pagination v-show="pages > 1" class="text-primary" v-model="page" :length="pages"
                            density="compact" variant="plain"></v-pagination>
                        <div class="grid-3" v-show="cities.length > 0">
                            <v-checkbox color="secondary" v-for="city in citiesPaginated" :key="(city.postcode ?? 1) + (city.name ?? '') "
                                v-model="city.selected" :label="getLabel(city)" :title="city.postcode" hide-details
                                density="compact"></v-checkbox>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">

import _ from "lodash";
import axios from "@/plugins/axios";

import { computed, ref, watch } from "vue";
import { FilterObject } from "@/class/FilterObject";
import { CityObject, compare } from "@/class/MunicipalityObject";
import Loader from "./partial/Loader.vue";

const emit = defineEmits(["update"]);

// DATA
const range = ref(['', ''] as (number | string)[]);
const cities = ref([] as Array<CityObject>);
const page = ref(1);
const perPage = 24;
const pages = computed(() => Math.ceil(citiesFiltered.value.length / perPage));
const citiesPaginated = computed(() => citiesFiltered.value.slice((page.value - 1) * perPage , page.value * perPage));
const props = defineProps({
    filter: {
        type: Object as () => FilterObject,
        required: true,
    },
});
function getLabel(city: CityObject) {
    return `${city.name ?? 'neznámé'} (${city.count})`;
}

const selectedCities = computed(() => [...cities.value.filter((m) => m.selected)]);

watch(selectedCities, (new_val, old_val) => {
    if (new_val.length === 0 && old_val.length === 0) return;
    emit("update", selectedCities.value);
}, { deep: true });


// STATES
const visible = ref(true);
const locked = ref(true);
const filterChangedWhenLocked = ref(false);
const initial = ref(true);
const loading = ref(false);

// SEARCH
const search = ref("");
const regions = ref([] as string[])
const region = ref("");
watch(region, () => {
    page.value = 1;
});
watch(search, () => {
    page.value = 1;
});


const citiesFiltered = computed(() => {
    const searchLower = search.value.toLowerCase();
    return cities.value.filter((m) => {
        if (searchLower !== "" && !m.name?.toLowerCase().includes(searchLower)) return false;
        if (region.value && region.value !== m.region) return false;
        return true;
    });
});



function update() {
    loading.value = true;
    let max = range.value[1];
    if (max === '') max = 'undefined';
    let min = range.value[0];
    if (min === '') min = 'undefined';
    const ranges = [`${min}-${max}`]; // there used to be the option to specify more ranges

    console.debug("fetching cities");

    axios
        .get("/cities", {
            params: { ...props.filter?.toParams(), ranges },
        })
        .then((response) => {
            cities.value = response.data;
            cities.value.sort(compare);
            loading.value = false;
            initial.value = false;
            regions.value = [... new Set(cities.value.map((m) => m.region ?? '').filter((r) => r))]
        });
}

const _debounce = _.debounce(update, 1000);
const updateDebounced = () => {
    loading.value = true;
    _debounce();
};

watch(range, () => {
    updateDebounced();
}, { deep: true });

const sum = computed(() => cities.value.reduce((sum, municipality) => sum + municipality.count, 0))

watch(props.filter, () => {
    if (initial.value)
        return;
    if (locked.value) {
        filterChangedWhenLocked.value = true;
        return;
    }
    updateDebounced();
}, { deep: true });

function toggleLock() {
    locked.value = !locked.value;
    if (!locked.value && filterChangedWhenLocked.value) {
        filterChangedWhenLocked.value = false;
        updateDebounced();
    }
}

function toggleAll(value = true) {
    citiesFiltered.value.forEach((m) => (m.selected = value));
}
</script>

<style lang="scss" scoped>
@import "@/style/animation-expand";


.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 4px;
}

.grid-4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 4px;
}

.grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 4px;
}

.numeric {
    max-width: 180px;
}
</style>
