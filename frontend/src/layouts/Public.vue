<template>

  <v-main>
    <v-toolbar height="85" color="white" class="elevation-2">
      <div class="container header flex space-between align-center" :class="{ 'mobile': mobile }">
      <router-link :to="{ name: 'home' }" class="top  grow">
        <v-img class="mx-2" id="logo" src="@/assets/logo.png" contain></v-img>

        <v-toolbar-title class="logo-title toolbar-logo-title" id="header">
          Realitní Radar
        </v-toolbar-title>
      </router-link>
      <div class="flex align-center" v-if="!mobile">
        <v-btn :to="{ name: 'listings' }" variant="outlined" prepend-icon="mdi-account" text="Uživatelská sekce">
        </v-btn>
      </div>
      <div v-else>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" :to="{name: 'listings'}" v-bind="props" variant="outlined">
              <v-icon size="large">mdi-account</v-icon>

            </v-btn>
          </template>

        </v-menu>

      </div>
    </div>
    </v-toolbar>
    <div class="container content" :class="{ 'mobile': mobile }">
      <router-view />
    </div>
  </v-main>

  <div class="elevation-4 footer bg-white" >
    <div class="container" :class="{ 'mobile': mobile }">

      <v-container>
        <v-row>
          <v-col class="flex flex-col align-center">

            <router-link :active="false" :to="{ name: 'terms'}">Obchodní podmínky</router-link>
            <router-link :active="false" :to="{ name: 'privacy-policy'  }">Ochrana osobních údajů</router-link>
            <span class="cp">  
          &copy; 2022 - {{ new Date().getFullYear() }} Realitní Radar
            </span>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay()

</script>

<style lang="scss">
@import url("@/style/theme.scss");


.toolbar-logo-title {
  font-size: 1.8rem !important;
  color: black;
}

.top {
  display: flex;
  align-items: center;
}

.mobile .top {
  justify-content: flex-start;
}

#logo {
  max-width: 50px;
  max-width: 50px;
}

.mobile #logo {
  width: 40px;
  width: 40px;
}

.mobile .toolbar-logo-title {
  font-size: 1.4rem !important;
  text-wrap: wrap;
}


#logo {
  background-color: transparent !important;
}

.container {
  max-width: 80%;
  width: 100%;
  margin: auto;

  &.header {
    margin-top: 1rem;
    margin-bottom: 1rem;
    max-width: 82%;
  }
}

.container.mobile {
  max-width: 90%;
}

.container.content {
  margin-top: 2rem;
  margin-bottom: 2rem;

  min-height: calc(100vh - 85px);
}

a.top {
  text-decoration: none !important;
}

.footer a {
  text-decoration: none !important;
  color: black;
}

.footer {
  margin-top: 2em;
  padding-top: 1em;
  padding-bottom: 1.5rem;

  .cp {
    margin-top: 1em;
    font-size: 0.8rem;
  }
}
</style>
