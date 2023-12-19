<template>
    <v-form @submit.prevent="submit" v-model="valid" class="form" ref="form" validate-on="submit">
        <form-card class="form-card">
            <template v-slot:header>
            <h2>Změna hesla</h2>
            </template>
            <v-text-field label="Staré heslo" type="password" v-model="oldPassword" :rules="oldPasswordRules"
                :error-messages="errorMessages.oldPassword" @input="errorMessages.oldPassword = ''" required></v-text-field>
            <v-text-field label="Nové heslo" type="password" v-model="newPassword" :rules="newPasswordRules"
                :error-messages="errorMessages.newPassword" @input="errorMessages.newPassword = ''" required></v-text-field>
            <v-text-field label="Nové heslo znovu" type="password" v-model="newPassword2" :rules="newPassword2Rules"
                :error-messages="errorMessages.newPassword2" @input="errorMessages.newPassword2 = ''"
                required></v-text-field>

            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" variant="text" class="text-primary" :disabled="progress">Změnit heslo</v-btn>
            </template>
        </form-card>
    </v-form>
</template>

<script setup lang="ts">

import { useAuthStore } from '@/stores/auth';

import _ from 'lodash';

import { Ref, ref } from 'vue';

import { useRouter } from 'vue-router';
import { toast } from "@/plugins/toastify";
import FormCard from '@/components/partial/FormCard.vue';

const authStore = useAuthStore();

const oldPassword = ref('');
const newPassword = ref('');
const newPassword2 = ref('');
const valid = ref(false);
const form = ref(null as HTMLFormElement | null);
const progress = ref(false);

const oldPasswordRules = [
    (v: string) => !!v || 'Vyplňte staré heslo',
];

const newPasswordRules = [
    (v: string) => !!v || 'Vyplňte nové heslo',
];

const newPassword2Rules = [
    (v: string) => !!v || 'Vyplňte nové heslo znovu',
    (v: string) => v === newPassword.value || 'Hesla se neshodují',
];

const errorMessages = ref({} as any);

const router = useRouter();

const submit = _.throttle(async () => {
    const res = await form.value?.validate()
    if (! res.valid) return;
    try {
        progress.value = true;
        await authStore.changePassword(oldPassword.value, newPassword.value);
        toast("Heslo bylo změněno.")
        router.push({ name: 'user-home' });

    } catch (error: any) {
        if (error.response?.status === 401) {
            errorMessages.value = { oldPassword: 'Špatné heslo' };
        }
    } finally {
        progress.value = false;
    }
}, 1000);

</script>