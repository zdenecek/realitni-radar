<template>
    <div class="flex-col filter">
        <div class="flex flex-wrap align-center">
            <h2 class="mr-4">Filtr</h2>
            <v-btn @click="visible = !visible" :text="visible ? 'Skrýt' : 'Zobrazit'" size="small"
                :prepend-icon="visible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" variant="outlined"></v-btn>
            <v-btn @click="clearFilter" v-show="visible" size="small" prepend-icon="mdi-close" variant="outlined">Smazat
                filtr</v-btn>
           
        </div>
        <div class="animation-wrapper">
            <Transition name="expand">
                <form @submit.prevent="update" v-show="!collapseAll && visible">
                    <div class="search mb-2 mt-2">
                        <div class="label flex-wrap">
                            <span>Vyhledávání</span>
                            <v-chip-group v-model="searchType" class="chips text-secondary" hide-details mandatory>
                                <v-chip value="str" variant="outlined" density="compact">Text</v-chip>
                                <v-chip value="location" variant="outlined" density="compact">V okolí</v-chip>
                                <v-chip value="location-exact" variant="outlined" density="compact">Místo</v-chip>
                            </v-chip-group>
                        </div>
                        <div class="flex-col">
                            <v-text-field type="text" placeholder="Vyhledávání" v-model="filter.query"
                                v-show="searchType == 'str'" />
                            <location-filter v-model="filter.location" v-show="locationSearch"
                                :exact="locationExact"></location-filter>
                        </div>
                    </div>
                    <div v-for="[prop, labels, mainLabel] in filters">
                        <div class="label">
                            <span>{{ mainLabel }}</span>
                            <v-chip density="compact" class="text-red-darken-4 no-chip-pad" variant="plain"
                                @click="(filter[prop] as any[]) = []" v-show="(filter[prop] as any[])?.length">
                                <v-icon icon="mdi-close-box-outline" color="red-darken-4"></v-icon>
                            </v-chip>
                        </div>
                        <v-chip-group multiple v-model="filter[prop]" class="chips text-primary">
                            <v-chip v-for="(label, item) in labels" :key="item" :value="item" filter variant="outlined"
                                density="comfortable">{{ label }}</v-chip>
                        </v-chip-group>
                    </div>
                    <div>
                        <div class="label">Cena prodeje</div>
                        <div class="flex spaced flex-wrap">

                            <div class="price-filter flex flex-wrap">
                                <v-text-field type="number" class="numeric" placeholder="kč" label="Cena od" clearable
                                    v-model="filter.priceMin" min="0" step="100000" />
                                <v-text-field type="number" class="numeric" placeholder="kč" label="Cena do" clearable
                                    v-model="filter.priceMax" min="0" step="100000" />
                            </div>
                            <div class="price-filter flex flex-wrap">
                                <v-text-field type="number" class="numeric unit-kcm" placeholder="kč/m²"
                                    label="Cena za plochu od" clearable v-model="filter.pricePerMeterMin" min="0"
                                    step="1000" />
                                <v-text-field type="number" class="numeric" placeholder="kč/m²" label="Cena za plochu do"
                                    clearable v-model="filter.pricePerMeterMax" min="0" step="1000" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="label">Cena nájmu</div>
                        <div class="flex spaced flex-wrap">
                            <div class="price-filter flex flex-wrap">
                                <v-text-field class="numeric" type="number" placeholder="kč/měsíc" label="Nájem od"
                                    clearable v-model="filter.rentMin" min="0" step="1000" />
                                <v-text-field class="numeric" type="number" placeholder="kč/měsíc" label="Nájem do"
                                    clearable v-model="filter.rentMax" min="0" step="1000" />
                            </div>
                            <div class="price-filter flex flex-wrap">
                                <v-text-field class="numeric" type="number" placeholder="kč/m² a měsíc" clearable
                                    label="Nájem za plochu od" v-model="filter.rentPerMeterMin" min="0" step="25" />
                                <v-text-field class="numeric" type="number" placeholder="kč/m² a měsíc" clearable
                                    label="Nájem za plochu do" v-model="filter.rentPerMeterMax" min="0" step="25" />

                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="label">Sleva ceny/nájmu</div>
                        <div class="flex flex-wrap">
                            <v-text-field class="numeric" type="number" label="Sleva alespoň %" clearable
                                v-model="filter.priceDropPercent" placeholder="%" min="0" max="100" step="0.001" />
                            <v-text-field class="numeric" type="number" label="Sleva alespoň kč" clearable
                                v-model="filter.priceDropCzk" placeholder="kč" min="0" step="1000" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div class="label">Stáří inzerátu</div>
                            <div class="flex flex-wrap">
                                <v-text-field class="numeric" type="number" label="Stáří alespoň" v-model="filter.ageMin"
                                    placeholder="dní" min="0" clearable />
                                <v-text-field class="numeric" type="number" label="Stáří nejvýše" v-model="filter.ageMax"
                                    placeholder="dní" min="0" clearable />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="label">Smazané inzeráty</div>
                        <v-chip-group v-model="filter.deleted" class="chips text-primary">
                            <v-chip v-for="(label, item) in deletedOptions" :key="item" :value="item" variant="outlined"
                                density="comfortable">{{ label }}</v-chip>

                        </v-chip-group>
                    </div>
                    <div>
                        <div class="label">
                            <span>Řazení</span>
                            <v-chip class="text-secondary no-chip-pad" v-show="canAddOrdering" @click="addOrdering"
                                variant="text" density="compact">
                                <v-icon icon="mdi-plus-box-outline" />
                            </v-chip>
                        </div>
                        <div class="ordering flex flex-col mb-2">
                            <div class="flex align-center" v-for="ordering, index in filter.orderBy" :key="ordering.key">
                                <v-select hide-details v-model="ordering.key" :items="orderByOptions" item-value="value"
                                    variant="outlined" density="compact" class="mr-4 ordering-select" clearable
                                    @click:clear="filter.orderBy.splice(index, 1)" :label="filter.orderBy.length > 1 ? index + 1 + '. kritérium' : undefined" />

                                <v-switch density="compact"
                                    :label="ordering.desc ? orderByLabels[ordering.key].descLabel : orderByLabels[ordering.key].ascLabel"
                                    hide-details v-model="ordering.desc" />
                            </div>
                        </div>

                    </div>


                    <h4 class="text-primary">Podkategorie</h4>
                    <div>
                        <v-chip-group multiple v-model="subcategoryFilter[0]" class="chips">
                            <v-chip :value="0" text="Neuvedeno" filter variant="outlined" density="comfortable"
                                class="text-primary" />
                        </v-chip-group>
                    </div>
                    <div v-for="prop in PropertyCodes" :key="prop">
                        <div class="label">
                            <span>{{ subcategoryFormLabels[prop] }}</span>

                            <v-chip density="compact" class="text-red-darken-4 no-chip-pad" variant="plain"
                                @click="subcategoryFilter[prop] = []" v-show="subcategoryFilter[prop].length">
                                <v-icon icon="mdi-close-box-outline" color="red-darken-4"></v-icon>
                            </v-chip>
                        </div>
                        <v-chip-group multiple v-model="subcategoryFilter[prop]" class="chips">

                            <v-chip v-for="item in subcategoryCodes(prop)" v-show="item !== 0" :key="item" :value="item"
                                filter variant="outlined" density="comfortable" class="text-primary">{{
                                    SubcategoryLabels[prop][item] }}</v-chip>
                        </v-chip-group>
                    </div>

                </form>
            </Transition>
        </div>

    </div>
</template>


<script  setup lang="ts" >
import LocationFilter from "./LocationFilter.vue";
import { DealLabels, PropertyLabels, OwnershipLabels, SubcategoryLabels, Property, PropertyCodes, PropertyType, SubcategoryCodes, OtherSubcategory } from "@/class/types";
import { FilterObject, OrderingOption } from "@/class/FilterObject";
import { useRouter, useRoute } from "vue-router";
import { watch, computed, onMounted, ref } from "vue";

const emit = defineEmits(["update"]);
const router = useRouter();
const route = useRoute();
const filter = ref(new FilterObject());


// UPDATE
function update() {
    emit("update", filter.value);
}
watch(filter, () => {
    update();
    router.push({ query: filter.value.toParams() })
}, { deep: true })
onMounted(() => {

    update()
})

// CLEAR
function clearFilter() {
    filter.value = new FilterObject();
    searchType.value = 'location'
    // @ts-ignore
    Object.keys(subcategoryFilter.value).forEach(key => subcategoryFilter.value[key] = [])
}

// HIDE
const props = defineProps({
    hideOnStart: {
        type: Boolean,
        default: false
    }
})
const visible = ref(!props.hideOnStart)



// SEARCH
const searchType = ref<"str" | "location-exact" | "location">("location");
watch(searchType, () => {
    if (searchType.value == "str") {
        filter.value.location = undefined;
    } else {
        filter.value.query = "";
    }
});
onMounted(() => {
    filter.value = FilterObject.fromParams(route.query);
    if (filter.value?.location?.type === 'radius') searchType.value = 'location'
    else if (filter.value?.location?.type === 'exact') searchType.value = 'location-exact'
    else if (filter.value?.query) searchType.value = 'str'
    else searchType.value = 'location'
})
const locationSearch = computed(() => searchType.value === "location" || searchType.value === "location-exact");
const locationExact = computed(() => searchType.value === "location-exact");

// MAIN FILTERS
const filters = [
    ['property', PropertyLabels, "Kategorie"],
    ['deal', DealLabels, "Nabídka"],
    ['ownership', OwnershipLabels, "Vlastnictví"]
] as [keyof FilterObject, any, string][]


// ORDERING
const orderByOptions = [
    { value: "priceDrop", title: "Sleva" },
    { value: "age", title: "Stáří" },
    { value: "price", title: "Cena/Nájem" },
    { value: "pricePerMeter", title: "Cena/Nájem na plochu" },
]
const orderByLabels = {
    priceDrop: { descLabel: "Sestupně", ascLabel: "Vzestupně" },
    age: { descLabel: "Od nejnovějších", ascLabel: "Od nejstarších", },
    price: { descLabel: "Sestupně", ascLabel: "Vzestupně" },
    pricePerMeter: { descLabel: "Sestupně", ascLabel: "Vzestupně" },
}
function addOrdering() {
    const remainingFilters = orderByOptions.filter(k => filter.value.orderBy.every(o => o.key != k.value))
    filter.value.orderBy.push({
        desc: false,
        key: remainingFilters[0].value as OrderingOption ?? "age",
    });
}

const canAddOrdering = computed(() => filter.value.orderBy.length < Object.values(orderByOptions).length);


// SUBCATEGORY
function subcategoryCodes(prop: PropertyType) {
    // @ts-ignore
    return SubcategoryCodes[prop];
}

const subcategoryFilter = ref<{ [key in PropertyType]: Array<number> }>({
    [0]: [],
    [Property.apartment]: [],
    [Property.commercial]: [],
    [Property.parcel]: [],
    [Property.house]: [],
    [Property.other]: [],
});
const subcategoryFormLabels = {
    [Property.apartment]: "Typ bytu",
    [Property.commercial]: "Typ komerční nemovitosti",
    [Property.parcel]: "Typ pozemku",
    [Property.house]: "Typ domu",
    [Property.other]: "Typ - jiné"
} as { [key in PropertyType]: string };
watch(subcategoryFilter, () => {
    filter.value.subcategory = Object.values(subcategoryFilter.value).flat();
}, { deep: true })


// COLLAPSE ALL if only one listing
const collapseAll = ref(false);
onMounted(() => {
    if (route.query.id) collapseAll.value = true;
})

// DELETED
const deletedOptions = {
    active: "Aktivní",
    all: "Vše",
    deleted: "Jen smazané",
}

</script>


<style lang="scss" scoped>
@import "@/style/animation-expand";

.flex.spaced {
    gap: 4px 32px;
}

.search .label {
    display: flex;
    align-items: center;
    gap: 1em;
}

.chips {
    padding: 0;

    .v-chip {
        margin-top: 0;
        margin-bottom: .2em;
    }
}

.numeric {
    width: 180px;
    max-width: 180px;
}

.ordering {
    .ordering-select {
        max-width: 250px;
    }

    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
