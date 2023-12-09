<template>
    <v-card class="listing" :class="{ deleted: deleted && !showDetails }">
        <div class="header">
            <div class="heading">
                <span v-if="data?.deleted" class="label-deleted"> Smazaný inzerát </span>
                {{ data?.title ?? "Inzerát" }}, {{ address }}
            </div>
            <v-chip-group class="top-labels">
                <v-chip v-if="data?.isFavorite"  append-icon="mdi-heart-outline"   class="top-label top-label-favorite text-secondary">
                    Oblíbený
                </v-chip>
                <v-chip v-if="data?.prop" :class="'top-label top-label-prop top-label-prop-' + data.prop" variant="flat">
                    {{ propLabel }}
                </v-chip>
                <v-chip variant="flat" v-if="data?.deal" :class="'top-label top-label-deal top-label-deal-' + data.deal">
                    {{ dealLabel }}
                </v-chip>
                <v-chip variant="flat" v-if="data?.ownership"
                    :class="'top-label top-label-ownership top-label-ownership-' + data.ownership">
                    {{ ownershipLabel }}
                </v-chip>
                <v-chip variant="flat" v-if="priceDropLabel"
                    :class="'top-label top-label-price-drop top-label-price-drop-' + priceDropLabel">
                    {{ priceDrop }}
                </v-chip>
                <v-chip variant="flat" v-if="data?.sub" :class="'top-label top-label-sub top-label-sub-' + data.sub">
                    {{ subLabel }}
                </v-chip>
            </v-chip-group>
        </div>
        <div class="images">
            <div v-for="image in data?.images" :key="image.view">
                <img loading="lazy" :src="image.gallery ?? image.view" />
            </div>
        </div>
        <div class="overview">
            <div class="listing-label price">
                <span>Cena</span>
                <span>{{ price }}</span>
            </div>
            <div class="listing-label" v-if="ownership">
                <span>Vlastnictví</span>
                <span>{{ ownership }}</span>
            </div>
            <div class="listing-label">
                <span>Stáří</span>
                <span>{{ ageString }}</span>
            </div>
            <div class="listing-label">
                <span>Data</span>
                <div class="dates">
                    <div>
                        <span>Vloženo</span>
                        <span>{{ dateStr(data?.inserted) }}</span>
                    </div>
                    <div v-if="data?.lastUpdate">
                        <span>Naposledy aktualizováno</span>
                        <span>{{ dateStr(data?.lastUpdate) }}</span>
                    </div>
                    <div v-if="deleted">
                        <span>Smazáno</span>
                        <span>{{ dateStr(data?.deleted) }}</span>
                    </div>
                </div>
            </div>
            <div class="listing-label" v-if="priceDrop">
                <span>Sleva</span>
                <span>{{ priceDrop }}</span>
            </div>
        </div>
        <div class="actions text-small"  >
            <v-btn class="button" @click="toggleDetails" prepend-icon="mdi-eye-outline">Zobrazit podrobnosti</v-btn>
            <v-btn class="button" :href="webUrl" target="_blank">Otevřít na Sreality</v-btn>
            <v-btn class="button" @click="togglefavorites"
                :prepend-icon="data?.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'">
                {{ data?.isFavorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených' }}</v-btn>
            <v-btn class="button" :href="detailUrl" target="_blank">Otevřít na nové stránce</v-btn>

            <v-btn class="button" :href="data?.apiUrl" target="_blank" v-show="false">Api</v-btn>
        </div>
        <div class="details" v-show="expand">
            <div class="description">
                <span v-html="description"></span>
            </div>
            <div class="items">
                <div class="listing-label" v-for="(item, key) in data?.items" :key="key">
                    <span>{{ key }}</span>
                    <checkmark v-if="item === false || item === true" :value="item"></checkmark>
                    <span v-else>{{ item }}</span>
                </div>
            </div>
            <div class="meta">
                <div>
                    <h3>Vývoj cen</h3>
                    <price-chart class="chart" :data="chartData"></price-chart>
                </div>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { Ownership, OwnershipLabels, OwnershipType, PropertyType } from "@/class/types";
import PriceChart from "./PriceChart.vue";
import Checkmark from "./partial/Checkmark.vue";
import { PropertyLabels, PropertyCodes, DealLabels, SubcategoryLabels } from "@/class/types";
import { computed, ref } from "vue";
import axios from "@/plugins/axios";
import { toast } from "@/plugins/toastify";

const props = defineProps({
    data: Object,
    autoexpand: Boolean
})

const showDetails = ref(false);
const expand = computed(() => props.autoexpand || showDetails.value);

const chartData = computed(() => ({
    priceHistory: props.data?.priceHistory,
    deleted: props.data?.deleted
}));

const priceDropLabel = computed(() => {
    if (props.data?.priceDropPercent >= 0.5) return 50;
    if (props.data?.priceDropPercent >= 0.4) return 40;
    if (props.data?.priceDropPercent >= 0.3) return 30;
    if (props.data?.priceDropPercent >= 0.25) return 25;
    if (props.data?.priceDropPercent >= 0.2) return 20;
    if (props.data?.priceDropPercent >= 0.15) return 15;
    if (props.data?.priceDropPercent >= 0.10) return 10;
    if (props.data?.priceDropPercent >= 0.075) return 7;
    if (props.data?.priceDropPercent >= 0.03) return 3;
    return false;
});

const propLabel = computed(() => PropertyLabels[props.data?.prop as PropertyType]);
const ownershipLabel = computed(() => OwnershipLabels[props.data?.ownership as OwnershipType]);
const dealLabel = computed(() => DealLabels[props.data?.deal as PropertyType]);
const subLabel = computed(() => SubcategoryLabels[props.data?.prop][props.data?.sub]);
const webUrl = computed(() => 'https://' + props.data?.url);
const detailUrl = computed(() => "/listing/" + props.data?.id);

const ageString = computed(() => {
    const to = props.data?.deleted ? Date.parse(props.data?.deleted) : Date.now();
    const from = Date.parse(props.data?.inserted);
    const age = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
    let s = age + (age === 1 ? " den" : " dní");

    if (props.data?.deleted) {
        const to2 = Date.now();
        const age2 = Math.ceil((to2 - from) / (1000 * 60 * 60 * 24));
        s += ` (${age2} ${age2 === 1 ? " den" : " dní"} od vložení)`;
    }
    return s;
});

const description = computed(() => props.data?.description ?? '-');
const price = computed(() => {
    let s = props.data?.price?.toLocaleString() + " Kč" ?? "-";
    if (props.data?.priceUnit) s += " " + props.data?.priceUnit;
    if (props.data?.pricePerMeter) s += ` (${Math.floor(props.data?.pricePerMeter).toLocaleString()} Kč/m²)`;

    return props.data?.price ? s : "-";
});
const priceHistory = computed(() => props.data?.priceHistory);
const ownership = computed(() => Ownership[props.data?.ownership] ?? false);
const priceDrop = computed(() => props.data?.priceDropPercent > 0 ? `${Math.round(props.data?.priceDropPercent * 100)} %` : false);
const address = computed(() => props.data?.address ?? props.data?.locality?.name ?? "");
const deleted = computed(() => props.data?.deleted);

function toggleDetails() {
    showDetails.value = ! showDetails.value;
}

function dateStr(date: string) {
    return new Date(Date.parse(date)).toLocaleDateString();
}

const emit = defineEmits(['toggle-favorites']);

function togglefavorites() {
    if (!props.data) return;
    emit('toggle-favorites', props.data.id);

    if (!props.data.isFavorite) {

        axios.post('/favorites/add', {
            id: props.data._id,
        }).then(() => {
            if (!props.data) return;
            props.data.isFavorite ^= 1;

        }).catch((e) => {
            if (!props.data) return;
            toast('Nepodařilo se přidat inzerát do oblíbených');
            console.error(e);
        });

    } else {
        axios.delete(`/favorites/delete/${props.data._id}`).then(() => {
            if (!props.data) return;
            props.data.isFavorite ^= 1;
        }).catch((e) => {
            if (!props.data) return;
            toast('Nepodařilo se odebrat inzerát z oblíbených');
            console.error(e);
        });
    }
}

</script>

<style lang="scss">
@import "../style/labels.scss";

.listing {
    display: flex;
    flex-flow: column;
    border-radius: 10px;
    overflow: hidden;

    &>div {
        padding: 4px 20px;
    }
}

.header {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.heading {
    font-size: 1.5em;
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;

    .label-deleted {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.8em;
        font-weight: bold;
    }
}



.images {
    display: flex;
    gap: 6px;
    overflow-x: auto;

    img {
        max-height: 200px;
    }
}

.overview {
    display: flex;
    flex-flow: column;
    gap: 6px;
}

.dates {
    display: flex;
    flex-flow: row;
    gap: 15px;
    align-items: center;

    &>div {
        display: flex;
        flex-flow: row;
        gap: 6px;
        align-items: center;
    }
}

.actions {
    display: flex;
    flex-flow: row;
    gap: 6px;
}

.description {
    grid-column: 1/3;
    padding-bottom: 10px;
}

.details {
    display: flex;
    flex-direction: column;

    @media only screen and (min-width: 768px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .items {
        display: flex;
        flex-flow: column;
        gap: 6px;

        .listing-label {
            background-color: #f2f2f2;
            grid-template-columns: 1fr 1fr;
        }
    }

    .meta {
        padding: 10px;
    }
}

.listing-label {
    display: grid;
    grid-template-columns: 100px auto;
    gap: 10px;

    &>span:first-child {
        width: 100%;
        font-weight: bold;
        text-align: right;
    }

    &.description {
        text-justify: justify;
    }
}

.price {
    font-weight: bold;
}
</style>
