<template>
    <div class="autocomplete">
        <div class="flex flex-start align-center">

            <v-autocomplete ref="input" @input="update" v-model:search="searchString" v-model="selectedLocality"
                data-tooltip="Vyhledávání podle místa funguje na principu hledání v kruhu kolem bodu. Když se zvolí lokalita,  program dostane jeden bod, který je někde uprostřed (to platí i pro města), a pak hledá v kruhu o zadaném poloměru. Je nutné zvolit něco z našeptávače, do pole s vyhledáváním se pak doplní pouze první řádek výsledku našeptávače, to neznamená, hledá se ale opravdu podle vybrané položky. Lokality v našeptávači jsou z externího api Mapy.cz."
                variant="outlined" density="compact" :items="suggestions.data" item-props hide-details return-object
                item-value="userData.ruianId" :no-data-text="noSearch ? 'Zadejte hledaný termín' : 'Nenalezeno'" no-filter
                :loading="loading" item-title="userData.suggestFirstRow">

                <template #item="{ props, item }">
                    <v-list-item v-bind="props" :title="(props.userData as any).suggestFirstRow"
                        :subtitle="(props.userData as any).suggestSecondRow">
                    </v-list-item>
                </template>

            </v-autocomplete>
            <div v-show="!exact" class="flex align-center ml-4">
                <span>v okruhu</span>
                <v-text-field type="number" class="short" v-model="radius" :step="radius > 1 ? 1 : 0.1" min="0" />
                <span>km</span>
            </div>
        </div>
        {{ selectedLocality }}

    </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import axios from "@/plugins/axios";
import { ref, watch } from "vue";
import { GeoObject } from "@/class/GeoObject";
import { ExactLocationFilter, RadiusLocationFilter } from "@/class/GeoFilter";

const props = defineProps({
    modelValue: {
        type: Object,
    },
    exact: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue"]);

const suggestions = ref({
    count: 0,
    data: [] as any,
})

const searchString = ref(props.modelValue?.userData?.suggestFirstRow ?? "");
const noSearch = ref(true);

function update(e: any) {
    loading.value = true;
    suggestDebounced(e.target.value);
}

const selectedLocality = ref(props.modelValue?.userData.suggestFirstRow as any);
const radius = ref(1);
const loading = ref(false);

function emitUpdate() {
    if (!selectedLocality.value)  emit("update:modelValue", null);
    else if (props.exact) emit("update:modelValue", new ExactLocationFilter(selectedLocality.value));
    else emit("update:modelValue",  new RadiusLocationFilter(selectedLocality.value, radius.value));

}

watch(radius, () => {
    if (selectedLocality.value) emitUpdate();
});

function suggest(s: string) {
    if (s.length < 2) {
        loading.value = false;
        noSearch.value = true;
        suggestions.value = {
            count: 0,
            data: [],
        };
        return;
    }
    axios
        .get("/suggest", {
            params: {
                phrase: s,
                category: "region_cz,district_cz,municipality_cz,ward_cz,quarter_cz,street_cz",
                count: 20,
            },
        })
        .then((response) => {
            suggestions.value = response.data;
            noSearch.value = false;
            loading.value = false;
        });
}

const suggestDebounced = _.debounce(suggest, 500);
watch(selectedLocality, (item: GeoObject) => {
    console.debug("selectedLocality", item);
    emitUpdate();
});

</script>


<style lang="scss">
.short {
    max-width: 80px;
}
</style>
