<template>
  <v-container class="mb-4">
    <v-card class="mx-auto overflow-hidden">
      <v-app-bar
        app
        dark
        color="#43a047"
        shrink-on-scroll
        prominent
        src="https://picsum.photos/1920/1080?random"
        fade-img-on-scroll
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
          ></v-img>
        </template>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

        <v-toolbar-title>Menu</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-col cols="5" sm="3" md="2">
          <v-text-field
            hide-details
            prepend-icon="mdi-magnify"
            single-line
            value
          ></v-text-field>
        </v-col>
      </v-app-bar>
      <v-sheet
        id="scrolling-techniques-5"
        class="overflow-y-auto"
        max-height="128"
      >
      </v-sheet>

      <v-navigation-drawer v-model="drawer" app temporary>
        <v-list nav dense>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
            <v-list-item @click="home()">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Accueil</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="$store.state.isUserLoggedIn" @click="profil()">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mon profil</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="!$store.state.isUserLoggedIn" @click="login()">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Se connecter</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="!$store.state.isUserLoggedIn" @click="signup()">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Créer un compte</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item v-if="$store.state.isUserLoggedIn" @click="message()">
              <v-list-item-icon>
                <v-icon>mdi-message</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Voir les messages</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="$store.state.isUserLoggedIn" @click="logout()">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Se déconnecter</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Header",
  data: () => ({
    drawer: false,
    dialog: false,
    content: "",
  }),
  methods: {
    logout() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setAdmin", false);
      this.$router.push("/");
    },
    signup() {
      this.$router.push("/signup");
    },
    login() {
      this.$router.push("/login");
    },
    home() {
      this.$router.push("/");
    },
    message() {
      if (this.$route.path == `/message`) {
        window.location.reload();
      } else this.$router.push("/message");
    },
    profil() {
      if (this.$route.path == `/profil/${this.$store.state.userId}`) {
        window.location.reload();
      } else {
        this.$router.push(`/profil/${this.$store.state.userId}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
