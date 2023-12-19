<template>
  <div id="container" :class="{ 'mobile': mobile }">
    <router-view />
  </div>
</template>


<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay()
</script>

<style lang="scss" >
@import "@/style/theme.scss";

#container {

  min-height: 100%;
  display: flex;
  flex-direction: column;

  &:not(.mobile) {
    padding-top: 3em;
    padding-bottom: 2em;
    padding-right: 4em;
    padding-left: 2em;
  }

  &.mobile {
    padding: 1em;
  }
}

</style>
