<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Connexion</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Adresse E-mail"
                name="email"
                prepend-icon="mdi-account"
                type="text"
                v-model="email"
                autocomplete=""
              ></v-text-field>

              <v-text-field
                id="password"
                label="Mot de passe"
                name="password"
                prepend-icon="mdi-lock"
                required
                type="password"
                v-model="password"
                autocomplete="new password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login()">Se connecter</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      //client HTTP basé sur les promesses
      axios
        .post("http://localhost:3000/login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.$store.dispatch("setToken", response.data.token);
          this.$store.dispatch("setUser", response.data.userId);
          this.$store.dispatch("setAdmin", response.data.isAdmin);
          this.$router.push("/Message");
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
        });
    },
  },
};
</script>
