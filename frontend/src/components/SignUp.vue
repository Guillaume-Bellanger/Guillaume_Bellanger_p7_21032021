<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Créer votre compte</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Pseudo"
                name="name"
                prepend-icon="mdi-account-details"
                type="text"
                v-model="name"
              ></v-text-field>

              <v-text-field
                label="Adresse E-mail"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                v-model="email"
              ></v-text-field>

              <v-text-field
                id="password"
                label="Mot de passe"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="register()">Créer un compte</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "SignUp",
  data() {
    return {
      email: "",
      password: "",
      name: "",
    };
  },
  methods: {
    register() {
      axios
        .post("http://localhost:3000/signup", {
          email: this.email,
          password: this.password,
          name: this.name,
        })
        .then((response) => {
          // reussite de manipulation.
          console.log(response.data);
          this.$router.push("/login");
        })
        .catch((error) => {
          // erreur de manipulation
          console.log("An error occurred:", error.response);
        });
    },
  },
};
</script>
