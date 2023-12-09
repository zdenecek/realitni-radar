<template>
    <div class="wrapper">
        <v-form ref="form" v-model="valid" @submit.prevent="submit">

            <v-card class="auth-card">
                <h2>Přihlášení</h2>

                <div class="fields">
                    <v-text-field label="Email" v-model="username" :rules="usernameRules" required
                        :error-messages="errorMessages.username" @input="errorMessages.username = ''"></v-text-field>
                    <v-text-field label="Heslo" type="password" v-model="password" :rules="passwordRules"
                        :error-messages="errorMessages.password" @input="errorMessages.password = ''"
                        required></v-text-field>
                </div>


                <v-card-actions class="actions">
                    <v-btn variant="outlined" :to="{ name: 'register' }">Registrace</v-btn>

                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" type="submit" color="primary" :disabled="!valid">Přihlásit</v-btn>

                </v-card-actions>
            </v-card>
        </v-form>

    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import _ from 'lodash';
import { Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const valid = ref(false);
const form = ref(null as HTMLFormElement | null);






const usernameRules = [
    v => !!v || 'Vyplňte email nebo uživatelské jméno',
];

const passwordRules = [
    v => !!v || 'Vyplňte heslo',
];

const errorMessages = ref({} as any);
const router = useRouter();
const route = useRoute();

const submit = _.throttle(async () => {
    if (!form.value?.validate()) return;
    try {
        await authStore.login(username.value, password.value);
        if (route.query.redirect)
            router.push(route.query.redirect as string);
        else router.push({ name: 'home' });

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
    }
}, 1000);

</script>

<style scoped>
.auth-card {
    width: 400px;
    margin: 0 auto;
    padding: 10px 20px;

    justify-self: center;
}

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}

.actions {
    display: flex;
    justify-content: space-between;
}

.fields {
    display: flex;
    flex-direction: column;
    gap: 10px;

    margin: 20px 0;
}
</style>
