<template>
    <div class="wrapper">
        <v-form ref="form" v-model="valid" @submit.prevent="submit">

        <v-card class="auth-card">
            <h2>Registrace</h2>

            <div class="fields">
                <v-text-field  label="Jméno" v-model="name" :rules="nameRules" required  :error-messages="errorMessages.name" @input="errorMessages.name = ''"></v-text-field>
                <v-text-field  label="Email" v-model="username" :rules="usernameRules" required  :error-messages="errorMessages.username" @input="errorMessages.username = ''"></v-text-field>
                <v-text-field label="Heslo" type="password" v-model="password" :rules="passwordRules" :error-messages="errorMessages.password" @input="errorMessages.password = ''"
                    required></v-text-field>
                <v-text-field label="Heslo znovu" type="password" v-model="password2" :rules="password2Rules" :error-messages="errorMessages.password" @input="errorMessages.password = ''"
                    required></v-text-field>
            </div>


            <v-card-actions class="actions">
                <v-spacer></v-spacer>
                <v-btn variant="outlined" type="submit" color="primary"  :disabled="!valid">Registrovat</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>

    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import _ from 'lodash';
import { Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import {toast} from "@/plugins/toastify";


const authStore = useAuthStore();

const username = ref('');
const name = ref('');
const password = ref('');
const password2 = ref('');
const valid = ref(false);
const form = ref(null as HTMLFormElement | null);

const usernameRules = [
    v => !!v || 'Vyplňte email nebo uživatelské jméno',
    v => /.+@.+\..+/.test(v) || 'Musí být platný email',
];
const nameRules = [
    v => v.length >= 5 || 'Zadejte celé jméno',
    v => !/\d/.test(v) || 'Zadejte celé jméno',
];

const passwordRules = [
    v => !!v || 'Vyplňte heslo',
];
const password2Rules = [
    v => !!v || 'Vyplňte heslo znovu',
    v => v === password.value || 'Hesla se neshodují',
];



const errorMessages = ref({ } as any);
const router = useRouter();

const submit = _.throttle( async () => {
    if (!form.value?.validate()) return;
    try {
        await authStore.register(username.value, name.value, password.value);
        toast("Registrace proběhla úspěšně. Nyní se můžete přihlásit.")
        router.push({ name: 'login' });

    } catch (error: any) {
        if (error.response?.status === 401) {
            errorMessages.value = { password: 'Špatné heslo' };
        }
        else if (error.response?.status === 409) {
            errorMessages.value = { username: 'Uživatel již existuje' };
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
