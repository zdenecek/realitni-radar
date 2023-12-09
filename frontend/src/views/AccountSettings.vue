
<template>
    <div class="flex flex-col">
        <h1>Nastavení</h1>
        <v-container>
            <v-row>
                <v-col cols="12" sm="8" md="6">
                  <password-form />

                </v-col>
            </v-row>
        </v-container>
    </div>
        
</template>


<script lang="ts" setup>
import PasswordForm from "@/components/account/ChangePasswordForm.vue";

</script>


<style scoped>

.flex {
    align-items: start;
}

</style>