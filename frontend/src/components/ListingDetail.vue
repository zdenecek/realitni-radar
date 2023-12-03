<template>
    <div>
        <span v-show="loading">Inzerát se načítá...</span>
        <div v-if="listing !== null">
            <listing :data="listing" :autoexpand="true"></listing>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Listing from "@/components/Listing.vue";
import axios from "@/plugins/axios";

import { useHead } from '@unhead/vue';
import ListingClass from "@/class/Listing";

export default defineComponent({
    name: "ListingsDetail",

    components: {
        Listing,
    },

    data() {
        return {
            loading: true,
            listing: null as ListingClass | null
        };
    },
    created() {
        this.getListing(this.$route.params.id as string);
    },
    methods: {
        getListing(id?: string) {
            //console.debug("fetching listing");
            this.loading = true;
            axios
                .get(`listing/${id}`)
                .then((response) => {
                    this.listing = response.data;
                    this.loading = false;
                    if(!this.listing) {
                        console.error("Listing not found");
                        return;
                    }
                    useHead({ title: this.listing.title  });
                })
                .catch((error) => {
                    console.error(error);
                    this.loading = false;
                });
        },
    },
});
</script>
