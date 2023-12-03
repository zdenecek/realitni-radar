<template>
  <v-navigation-drawer expand-on-hover :rail="true" class="pt-4"  permanent  >


    <v-list >
      <v-list-item :to="{name: 'listings'}" :active="false" :ripple="false"  id="logo">
        <template v-slot:prepend>
          <v-avatar image="@/assets/logo.png" rounded="0" />
        </template>
        <v-list-item-title id="logo-title">Realitní Radar</v-list-item-title>
      </v-list-item>
    </v-list>


    <v-divider></v-divider>


    <v-list nav density="compact">
      <v-list-item prepend-icon="mdi-home-city-outline" title="Inzeráty" :to="{name: 'listings'}" exact></v-list-item>
      <v-list-item prepend-icon="mdi-city-variant-outline" title="Města" :to="{name: 'listings-cities'}"></v-list-item>
      <v-list-item prepend-icon="mdi-information-outline" title="O Aplikaci" :to="{name: 'about'}"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <default-view />
  </v-main>
</template>

<script lang="ts" setup>
import Avatar from 'vuetify'

import DefaultView from './View.vue'
</script>

<style>
#logo-title {
  font-size: 1.2rem;
  font-family: sans-serif;
  color: black;
  font-weight: bold;
}

#logo {
  background-color: transparent !important;
}

.spacer {
  height: 25px;
}
</style>
