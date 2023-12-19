<template>
  <v-app-bar v-if="mobile && ! drawer" collapse>

    <v-btn @click=" drawer = true"  prepend-icon="mdi-menu" text="Menu">
    </v-btn>
  </v-app-bar>
  <v-navigation-drawer class="pt-4" v-model="drawer" :temporary="mobile" :permanent="!mobile">
    <v-list>
      <v-list-item :to="{ name: 'user-home' }" :active="false" :ripple="false" class="logo-header">
        <template v-slot:prepend>
          <v-avatar image="@/assets/logo.png" rounded="0" />
        </template>
        <v-list-item-title class="logo-title title-logo">Realitní Radar</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav density="compact">
      <v-list-item prepend-icon="mdi-home-city-outline" title="Inzeráty" :to="{ name: 'listings' }" exact @click="hide"></v-list-item>
      <v-list-item prepend-icon="mdi-city-variant-outline" title="Města" :to="{ name: 'listings-cities' }" @click="hide"></v-list-item>
      <v-list-item v-show="loggedIn" prepend-icon="mdi-heart-outline" title="Oblíbené"
        :to="{ name: 'favorites' }"></v-list-item>

      <template v-if="auth.isAdmin">
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-account-group-outline" title="Uživatelé" :to="{ name: 'users' }"></v-list-item>
      </template>
    </v-list>


    <template v-slot:append>
      <v-list nav density="compact">
        <v-list-item v-if="!loggedIn" prepend-icon="mdi-account-outline" title="Přihlásit"
          :to="{ name: 'login' }"></v-list-item>

        <template v-else>
          <v-list-item prepend-icon="mdi-logout" title="Odhlásit se" @click-once="logout"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="Nastavení" :to="{ name: 'account-settings' }"></v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar>
                <v-img src="@/assets/user2.png" />
              </v-avatar>
              <v-spacer class="spacer"></v-spacer>
            </template>
            <v-list-item-title>{{ user?.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
          </v-list-item>

        </template>

      </v-list>
    </template>
  </v-navigation-drawer>

  <v-main>
    <default-view />
  </v-main>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import DefaultView from './View.vue'

import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { toast } from '@/plugins/toastify';

const { mobile } = useDisplay()

const auth = useAuthStore();
const loggedIn = computed(() => auth.isAuthenticated);
const user = computed(() => auth.user);


const router = useRouter();

async function logout() {
  await auth.logout();
  router.push({ name: 'home' });
  toast("Byl/a jste odhlášen.")
}

const drawer = ref(false || !mobile.value);

function hide() {
  if (mobile.value) {
    drawer.value = false;
  }
}

</script>

<style>
.title-logo {
  font-size: 1.4rem;
  color: black;
}

.logo-header {
  background-color: transparent !important;
}

.v-divider {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.container {
    max-width: 760px;
}



</style>
