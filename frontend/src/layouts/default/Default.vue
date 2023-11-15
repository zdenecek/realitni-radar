<template>
  <v-navigation-drawer expand-on-hover :rail="true" class="pt-4"  >


    <v-list>
      <v-list-item >
        <template v-slot:prepend>
          <v-avatar image="@/assets/logo.png" rounded="0" />
        </template>
        <v-list-item-title id="logo-title">Scraper</v-list-item-title>
      </v-list-item>
    </v-list>


    <v-divider></v-divider>


    <v-list nav density="compact">
      <v-list-item prepend-icon="mdi-home" title="Inzeráty" value="listings"></v-list-item>
      <v-list-item prepend-icon="mdi-information" title="O Aplikaci" value="myfiles"></v-list-item>
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
}

.spacer {
  height: 25px;
}
</style>
