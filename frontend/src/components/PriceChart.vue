<template>
    <canvas class="price-chart" ref="canvas"></canvas>
</template>


<script setup lang="ts">
import { Chart, ChartItem } from "chart.js";
import PriceHistoryHelper from "@/class/PriceHistory";
import { onMounted, ref } from "vue";


interface PriceChartData {
    priceHistory: { [key: string]: number };
    deleted?: string;
}


const canvas = ref(null as HTMLCanvasElement | null); // component ref
const props = defineProps({
    data: {
        type: Object as () => PriceChartData,
        required: true,
    },
});

onMounted(() => {

    if (!props.data?.priceHistory) return;
    const normalizedData = PriceHistoryHelper.normalize(props.data.priceHistory, props.data?.deleted);

    new Chart(canvas.value as ChartItem, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Cena",
                    fill: true,
                    borderColor: '#1DAEFF',
                    data: normalizedData,
                },
            ],
        },
        options: {
            scales: {
                y: {
                }
            }
        },
    });
})

</script>



<style lang="scss">
.price-chart {
    width: 100%;
    height: 200px;
}
</style>