<template>
  <v-container light-blue fill-height class=" mt-5 test">
    <v-row class="row" justify="center">
      <v-col class=" col-sm-12 col-md-8">
        <v-card id="app">
          <v-card-text align="center" dark>
            <v-list-item class="itemAvatar">
              <v-avatar id="btnAvatar" size="150" class="mx-auto">
                <v-img :src="imgProfil" v-if="imgProfil != ''"></v-img>
                <v-img :src="user.avatar" v-else></v-img>
              </v-avatar>
            </v-list-item>
            <v-list-item>
              <input
                id="imgProfil"
                type="file"
                nome="imgProfil"
                ref="inputFile"
                @change="imgHandler"
              />
              <v-btn
                aria-label=" bouton pour modifier l'avatar"
                title="bouton pour modifier l'avatar'"
                class=" mt-5  changeAvatar"
                color="#33A8FF"
                @click="changeAvatar"
                v-if="id == userId || isAdmin"
                >Changer d'avatar
                <v-icon>mdi-system-update-alt</v-icon>
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-list-item-content class="d-block font-weight-bold my-3"
                >Nom : {{ user.name }}</v-list-item-content
              >
              <v-list-item-content class="d-block font-weight-bold my-3"
                >Email : {{ user.email }}</v-list-item-content
              >
            </v-list-item>

            <v-divider></v-divider>

            <v-col class="col-md-10 col-sm-12 flex-column">
              <v-list-item>
                <v-list-item-title class="font-weight-bold mb-3"
                  >Description :</v-list-item-title
                >
                <v-btn
                  aria-label=" bouton pour modifier la bio"
                  title="bouton pour modifier la bio"
                  color="#33A8FF"
                  icon
                  class="mb-3"
                  @click="changingBio = true"
                  v-if="isAdmin"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  aria-label=" bouton pour modifier la bio"
                  title="bouton pour modifier la bio"
                  color="#33A8FF"
                  icon
                  class="mb-3"
                  @click="changingBio = true"
                  v-else-if="id == userId"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="d-block"
                  >{{ changedBio }}
                </v-list-item-content>
              </v-list-item>

              <v-col
                class="col-sm-12 col-md-10 flex-column"
                v-if="changingBio == true"
              >
                <v-textarea
                  outlined
                  counter
                  full-width
                  placeholder="description"
                  auto-grow
                  v-if="isAdmin"
                  v-model="changedBio"
                ></v-textarea>
                <v-textarea
                  outlined
                  counter
                  full-width
                  placeholder="description"
                  auto-grow
                  v-else-if="id == userId"
                  v-model="changedBio"
                ></v-textarea>
                <v-btn
                  aria-label=" bouton pour valider les modifications de la bio"
                  title="bouton pour valider la modification de la bio"
                  color="#33A8FF"
                  icon
                  class="mb-3"
                  v-if="changingBio == true"
                  @click="changingBio = false"
                >
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-btn>
              </v-col>
            </v-col>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions class="btnSupUp" justify="end" align="end">
            <v-btn
              aria-label=" bouton pour supprimer le profil"
              title="bouton pour supprimer le profil"
              color="error"
              class="mb-3 mr-1 col-6 col-nd-4 col-lg-3"
              v-if="isAdmin"
              @click="deleteProfil()"
            >
              <v-icon left dark class="logoSup">mdi-delete-forever</v-icon>
              Supprimer
            </v-btn>
            <v-btn
              aria-label=" bouton pour supprimer le profil"
              title="bouton pour supprimer le profil"
              color="error"
              class="mb-3 mr-1 col-6 col-nd-4 col-lg-3"
              v-else-if="id == userId"
              @click="deleteProfil()"
            >
              <v-icon left dark>mdi-delete-forever</v-icon>
              Supprimer
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="id == userId || isAdmin"
              aria-label=" bouton pour sauvegarder le profil"
              title="bouton pour sauvegarder le profil"
              color="#33A8FF"
              class="mb-3  mr-1 col-6 col-nd-4 col-lg-3"
              @click="updateProfil()"
            >
              <v-icon left dark>mdi-checkbox-marked-circle</v-icon>
              Enregistrer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import store from "../store/index.js";
import { mapState } from "vuex";
import Swal from "sweetalert2";

export default {
  name: "Message",
  data() {
    return {
      id: this.$route.params.id,
      user: [],
      changingBio: false,
      changedBio: "",
      imgProfil: "",
      imgFile: "",
    };
  },
  mounted() {
    axios
      .get(`http://localhost:3000/profil/${this.id}`, {
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      })
      .then((user) => {
        this.user = user.data;
        this.changedBio = user.data.bio;
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  },
  computed: {
    ...mapState(["isAdmin", "userId"]),
  },
  methods: {
    deleteProfil() {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer le compte!",
      })
        .then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Compte supprimé!",
              icon: "success",
            });
            axios.delete(`http://localhost:3000/profil/${this.id}`, {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
              },
            });
            this.$store.dispatch("setToken", null);
            this.$store.dispatch("setUser", null);
            this.$store.dispatch("setAdmin", false);
            this.$router.push("/");
          }
        })
        .catch((error) => {
          // Handle error.
          Swal.fire({
            icon: "error",
            title:
              "Le compte n'a pas pu être supprimé, veuillez réessayer plus tard !",
            showConfirmButton: false,
            timer: 2500,
          });
          console.log("An error occurred:", error.response);
        });
    },
    updateProfil() {
      const updateData = new FormData();
      updateData.append("body", JSON.stringify({ bio: this.changedBio }));
      updateData.append("image", this.imgFile);
      axios
        .put(
          `http://localhost:3000/profil/${this.id}`,

          updateData,
          {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          }
        )
        .then((message) => {
          console.log(message);
          Swal.fire({
            icon: "success",
            title: "Profil mis à jour",
            showConfirmButton: false,
            timer: 2500,
          });
        })
        .catch((error) => {
          // Handle error.
          Swal.fire({
            icon: "error",
            title:
              "Le profil n'a pas pu être mis à jour, veuillez réessayer plus tard !",
            showConfirmButton: false,
            timer: 2500,
          });
          console.log("An error occurred:", error.response);
        });
    },
    imgHandler(event) {
      //met a jour l'image du fichier
      this.imgFile = event.target.files[0];

      this.imgProfil = URL.createObjectURL(event.target.files[0]);
      console.log(this.imgProfil);
    },
    changeAvatar() {
      this.$refs.inputFile.click();
    },
  },
};
</script>
<style scoped>
#app {
  margin-top: 50px;
}
.logoSup {
  padding-right: 2px;
}
input {
  display: none;
}
.changeAvatar {
  margin: 0 0 0 15%;
}
@media screen and (min-width: 604px) {
  .changeAvatar {
    margin: 0 0 0 36%;
  }
}
</style>
