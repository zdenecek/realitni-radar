<template>
    <v-form ref="form" v-model="valid" @submit.prevent="submit" validate-on="submit" class="form flex">
        <form-card>
            <template v-slot:header>
                <h2>Přihlášení</h2>
            </template>

                <v-text-field label="Email" v-model="username" :rules="usernameRules" required density="default"
                    :error-messages="errorMessages.username" @input="errorMessages.username = ''"></v-text-field>
                <v-text-field label="Heslo" type="password" v-model="password" :rules="passwordRules" density="default"
                    :error-messages="errorMessages.password" @input="errorMessages.password = ''" required></v-text-field>

            <template v-slot:actions>
                <v-btn variant="text" size="large" :to="{ name: 'register' }">Registrace</v-btn>

                <v-spacer></v-spacer>
                <v-btn variant="text" size="large" type="submit" color="primary" :disabled="progress">Přihlásit</v-btn>
            </template>
        </form-card>
    </v-form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import _ from 'lodash';
import { Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormCard from '@/components/partial/FormCard.vue';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const valid = ref(null);
const form = ref(null as HTMLFormElement | null);
const progress = ref(false);





const usernameRules = [
    (v: string) => !!v || 'Vyplňte email nebo uživatelské jméno',
];

const passwordRules = [
    (v: string) => !!v || 'Vyplňte heslo',
];

const errorMessages = ref({} as any);
const router = useRouter();
const route = useRoute();

const submit = _.throttle(async () => {

    const res = await form.value?.validate()
    if (! res.valid) return;
    try {
        progress.value = true;
        await authStore.login(username.value, password.value);
        
        if (route.query.redirect)
            router.push(route.query.redirect as string);
        else router.push({ name: 'user-home' });

    } catch (error: any) {
        if (error.response?.status === 401) {
            errorMessages.value = { password: 'Špatné heslo' };
        }
        else if (error.response?.status === 404) {
            errorMessages.value = { username: 'Uživatel neexistuje' };
        }
        else {
            errorMessages.value = { username: 'Nastala chyba' };
        }
    } finally {
        progress.value = false;
    }

}, 1000);

</script>
