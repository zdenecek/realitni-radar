<template>
    <v-card>
        <v-form @submit.prevent="submit" v-model="valid" class="flex flex-col" ref="form">
            <h2>Změna hesla</h2>
            <v-text-field label="Staré heslo" type="password" v-model="oldPassword" :rules="oldPasswordRules"
                :error-messages="errorMessages.oldPassword" @input="errorMessages.oldPassword = ''" required></v-text-field>
            <v-text-field label="Nové heslo" type="password" v-model="newPassword" :rules="newPasswordRules"
                :error-messages="errorMessages.newPassword" @input="errorMessages.newPassword = ''" required></v-text-field>
            <v-text-field label="Nové heslo znovu" type="password" v-model="newPassword2" :rules="newPassword2Rules"
                :error-messages="errorMessages.newPassword2" @input="errorMessages.newPassword2 = ''"
                required></v-text-field>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" :disabled="!valid" variant="outlined" class="text-primary">Změnit heslo</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">

import { useAuthStore } from '@/stores/auth';

import _ from 'lodash';

import { Ref, ref } from 'vue';

import { useRouter } from 'vue-router';
import {toast} from "@/plugins/toastify";

const authStore = useAuthStore();

const oldPassword = ref('');
const newPassword = ref('');
const newPassword2 = ref('');
const valid = ref(false);
const form = ref(null as HTMLFormElement | null);

const oldPasswordRules = [
    v => !!v || 'Vyplňte staré heslo',
];

const newPasswordRules = [
    v => !!v || 'Vyplňte nové heslo',
];

const newPassword2Rules = [
    v => !!v || 'Vyplňte nové heslo znovu',
    v => v === newPassword.value || 'Hesla se neshodují',
];

const errorMessages = ref({} as any);

const router = useRouter();

const submit = _.throttle(async () => {

    if (!form.value?.validate()) return;
    try {
        await authStore.changePassword(oldPassword.value, newPassword.value);
        toast("Heslo bylo změněno.")
        router.push({ name: 'home' });

    } catch (error: any) {
        if (error.response?.status === 401) {
            errorMessages.value = { oldPassword: 'Špatné heslo' };
        }
    }
}, 1000);

</script>


<style lang="scss" >
.v-card {
    padding: 10px 20px;
}

.flex {
    gap: 10px;
}
</style>