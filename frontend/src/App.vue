<template>
  <v-app>
    <header-top></header-top>
    <router-view></router-view>
    <footer-bottom />
  </v-app>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  name: "App",

  components: {
    "header-top": Header,
    "footer-bottom": Footer,
  },
};
</script>
<style scoped>
#app {
  background-image: url(./assets/icon.png);
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center 20px;
  background-size: contain;
}
</style>
