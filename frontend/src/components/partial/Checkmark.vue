<template>
    <div>

        <svg class="tick" v-if="value" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M9 12l2 2l4 -4"></path>
        </svg>
        <svg class="cross" v-else  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <circle cx="12" cy="12" r="9"></circle>
            <line x1="5.7" y1="5.7" x2="18.3" y2="18.3"></line>
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({

    name: "Checkmark",
    props: {
        value: Boolean,
    }
})

</script>

<style scoped>

    div {
        display: flex;
        align-items: center;
    }
.tick {
    height: 1em;
    color: #4caf50;
}	
.cross {
    height: 1em;
    color: #f44336;
}
</style>