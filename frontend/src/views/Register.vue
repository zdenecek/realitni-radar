<template>
    <v-form ref="form" v-model="valid" @submit.prevent="submit" validate-on="submit" class="form">
        <form-card>
            <template v-slot:header>
                <h2>Registrace</h2>
            </template>

            <v-text-field label="Jméno" name="name" v-model="name" :rules="nameRules" required density="comfortable"
                :error-messages="errorMessages.name" @input="errorMessages.name = ''"></v-text-field>
            <v-text-field label="Email" name='username' v-model="username" :rules="usernameRules" required
                density="comfortable" :error-messages="errorMessages.username"
                @input="errorMessages.username = ''"></v-text-field>
            <v-text-field label="Heslo" name='password' type="password" v-model="password" :rules="passwordRules"
                density="comfortable" :error-messages="errorMessages.password" @input="errorMessages.password = ''"
                required></v-text-field>
            <v-text-field label="Heslo znovu" type="password" v-model="password2" :rules="password2Rules"
                density="comfortable" :error-messages="errorMessages.password" @input="errorMessages.password = ''"
                required></v-text-field>

            <v-checkbox v-model="agree" :rules="agreeRules">
                <template v-slot:label>
                    <span>
                        Souhlasím s <router-link :to="{ name: 'terms' }">obchodními podmínkami</router-link> a
                        <router-link :to="{ name: 'privacy-policy' }">ochranou osobních údajů</router-link></span>
                </template>
            </v-checkbox>

            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" type="submit" color="primary" :disabled="progress">Registrovat</v-btn>
            </template>
        </form-card>
    </v-form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import _ from 'lodash';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from "@/plugins/toastify";
import FormCard from '@/components/partial/FormCard.vue';


const authStore = useAuthStore();

const username = ref('');
const name = ref('');
const password = ref('');
const password2 = ref('');
const valid = ref(false);
const form = ref(null as HTMLFormElement | null);
const progress = ref(false);

const agree = ref(false);

const agreeRules = [
    (v: boolean) => v || 'Musíte souhlasit s obchodními podmínkami a ochranou osobních údajů',
];

const usernameRules = [
    (v: string) => !!v || 'Vyplňte email nebo uživatelské jméno',
    (v: string) => /.+@.+\..+/.test(v) || 'Musí být platný email',
];
const nameRules = [
    (v: string) => v.length >= 5 || 'Zadejte celé jméno',
    (v: string) => !/\d/.test(v) || 'Zadejte celé jméno',
];

const passwordRules = [
    (v: string) => !!v || 'Vyplňte heslo',
];
const password2Rules = [
    (v: string) => !!v || 'Vyplňte heslo znovu',
    (v: string) => v === password.value || 'Hesla se neshodují',
];



const errorMessages = ref({} as any);
const router = useRouter();

const submit = _.throttle(async () => {
    const res = await form.value?.validate()
    if (!res.valid) return;
    try {
        progress.value = true;
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
    } finally {
        progress.value = false;
    }
}, 1000);

</script>