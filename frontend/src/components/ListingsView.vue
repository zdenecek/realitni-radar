<template>
    <div>
        <city-filter v-if="showCityFilter" @update="updateCities" class="mt-2 mb-2" :filter="filter"></city-filter>
        <listings-filter @update="updateFilter" :hide-on-start="hideFilterOnStart" class="mt-2 mb-2"></listings-filter>
        <div class="listings mt-4">
            <div class="listings" :class="{ 'blur-deleted': blurDeleted }">
                <h2 id="listings">{{ listingsCount }} inzerátů</h2>
                <v-pagination v-show="pages > 1" v-model="page" :length="pages" density="compact" variant="outlined"
                    class="text-primary text-small">
                </v-pagination>
                <loader v-show="loading">Načítání inzerátů...</loader>

                <v-skeleton-loader v-for="n in 20" :key="n" v-if="loading" type="image, article"></v-skeleton-loader>
                <listing v-if="!nextPageUsed" v-for="listing in responseData.listings" :data="listing" :key="listing['_id']"
                    :autoexpand="expand"></listing>
                <listing v-else v-for="listing in responseData.nextPage" :data="listing" :key="listing['_id']"
                    :autoexpand="expand"></listing>
                <v-pagination v-show="pages > 1" v-model="page" :length="pages" density="compact" variant="outlined"
                    class="text-primary text-small" />

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import Listing from "@/components/Listing.vue";
import ListingsFilter from "./ListingsFilter.vue";
import CityFilter from "./CityFilter.vue";

import { FilterObject } from "@/class/FilterObject";
import { CityObject } from "@/class/MunicipalityObject";
import ListingObject from "@/class/Listing";
import Loader from "./partial/Loader.vue";

import axios from "@/plugins/axios";
import { LocationQuery, useRoute, useRouter } from "vue-router";
import { ref, watch, computed, onMounted } from "vue";

import _ from "lodash";

const route = useRoute();
const router = useRouter();

const props = defineProps({
    showCityFilter: {
        type: Boolean,
        default: true,
    },
    url: {
        type: String,
        default: "listings",
    },
    hideFilterOnStart: {
        type: Boolean,
        default: false,
    },
});

// LISTINGS
const listingsCount = computed(() => responseData.value.count);
const responseData = ref({
    count: 0,
    listings: [] as Array<ListingObject>,
    nextPage: [] as Array<ListingObject>
});
const perPage = ref(parseInt(route.query.perPage as string) || 20);
const pages = computed(() => Math.min(Math.ceil(listingsCount.value / perPage.value), 999));
const page = ref(parseInt(route.query.p as string) || 1);


// NEXT PAGE trick - preload one page in advance
const nextPageUsed = ref(false);

watch(page, () => {
    if (page.value === 1)
        router.push({ query: { p: page.value } });
    else
        router.push({ query: { p: page.value }, hash: "#listings" });
});
watch(page, (newVal: number, oldVal: number) => {

    if (!nextPageUsed.value && newVal === oldVal + 1) {
        nextPageUsed.value = true;
    } else {
        loading.value = true;
    }
    getListings();
});

// STATE
const expand = computed(() => listingsCount.value === 1);
const loading = ref(false);

// FILTERS
const filter = ref(new FilterObject() as FilterObject);
const cityFilter = ref([] as Array<CityObject>);

// BLUR DELETED
const blurDeleted = computed(() => filter.value?.deleted !== "deleted")



// FETCHING LISTINGS
const _debounced = _.debounce(getListings, 1000);
const getListingsDebouced = () => {
    loading.value = true;
    _debounced();
};


onMounted(() => {
    loading.value = true;
    filter.value = FilterObject.fromParams(route.query);
    // for compatibility with old links with id: /?id=123
    if (route.query.id) getListings(route.query.id as string);
});

function updateFilter(new_filter: FilterObject) {
    filter.value = new_filter;
    page.value = 1;
    router.push({ query: filter.value.toParams() as LocationQuery });
    getListingsDebouced();
}

function updateCities(new_cities: Array<CityObject>) {
    cityFilter.value = new_cities;
    page.value = 1;
    getListingsDebouced();
}

function getListings(id?: string) {
    console.debug("Fetching listings...");
    let params = {
        p: page.value,
        perPage: perPage.value,
    } as unknown as LocationQuery;

    if (filter.value) {
        params = { ...params, ...filter.value.toParams() };
    }
    if (cityFilter.value.length > 0) {
        params.cities = cityFilter.value
            .filter((a) => a.selected)
            .map((a) => a.postcode + "-" + a.name)
    }

    if (id) params = { id };

    axios
        .post(props.url, {
            ...params,
        })
        .then((response) => {
            nextPageUsed.value = false;
            responseData.value = response.data;
            loading.value = false;
        })
        .catch((error) => {
            console.error("Listings error: " + error.message);
        });
}

</script>


<style lang="scss">
.listings {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

div .filter {
    max-width: 760px;
}

.blur-deleted .deleted:not(:hover) .top-labels,
.blur-deleted .deleted:not(:hover) .images,
.blur-deleted .deleted:not(:hover) .overview,
.blur-deleted .deleted:not(:hover) .actions {
    opacity: 45%;
}

.text-small .v-btn__content {
    font-size: 0.8em !important;
}
</style>
