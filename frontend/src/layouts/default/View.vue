<template>
  <v-main id="container">
    <router-view />
  </v-main>
</template>

<style lang="scss" >
@import "@/style/theme.scss";

#container {
  padding-top: 2em;
  padding-bottom: 2em;
  padding-right: 4em;

  margin-left: 1em;
}



h1, h2 {
  color: $primary-dark;
}

h2 {
  font-size: 1.3em;
}

a.anchor {
  color: $primary-dark;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

</style>
