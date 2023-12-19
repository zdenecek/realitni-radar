<template>
  <v-main>
    <div class="dialog-container">
      <router-link class="flex align-center" :to="{ name: 'home' }">
        <v-img class="mx-2" src="@/assets/logo.png" height="70" width="70" contain></v-img>

        <span class="logo-title title-l ">
          Realitní Radar
        </span>
      </router-link>
      <div>
        <router-view />
      </div>
    </div>
  </v-main>
</template>

<style lang="scss">
@import url("@/style/theme.scss");

.title-l {
  font-size: 2em;
  color: black;
}

#logo {
  background-color: transparent !important;
}

a {
  text-decoration: none;
}

.dialog-container {
  max-width: 70%;
  width: 100%;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
}
</style>
