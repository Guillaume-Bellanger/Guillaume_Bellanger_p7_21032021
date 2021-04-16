<template>
  <v-container light-blue fill-height class="mb-4 mt-5">
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8">
        <v-card id="app">
          <v-card-text align="center" dark>
            <v-list-item>
              <v-avatar size="150" class="mx-auto">
                <v-img :src="user.avatar"></v-img>
              </v-avatar>
            </v-list-item>
            <v-list-item>
              <input
                id="imgProfil"
                @change="changeAvatar"
                type="file"
                nome="imgProfil"
                ref="inputFile"
              />
              <v-btn
                class="mx-8 mt-3"
                color="#33A8FF"
                v-if="isAdmin"
                @click="changeAvatar()"
                >Changer d'avatar
                <v-icon>mdi-system-update-alt</v-icon>
              </v-btn>

              <v-btn
                class="mx-8 mt-3"
                small
                color="#33A8FF"
                v-else-if="id == userId"
                @click="changeAvatar()"
                >Changer d'avatar

                <v-icon>mdi-upload</v-icon>
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

            <v-col cols="12" md="10" class="flex-column">
              <v-list-item>
                <v-list-item-title class="font-weight-bold mb-3"
                  >Description :</v-list-item-title
                >
                <v-btn
                  color="#33A8FF"
                  icon
                  class="mb-3"
                  @click="changingBio = true"
                  v-if="isAdmin"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
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
                cols="12"
                md="10"
                class="flex-column"
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
          <v-card-actions justify="end" align="end">
            <v-btn
              color="error"
              class="mb-3"
              v-if="isAdmin"
              @click="deleteProfil()"
            >
              <v-icon left dark>mdi-delete-forever</v-icon>
              Supprimer le compte
            </v-btn>
            <v-btn
              color="error"
              class="mb-3"
              v-else-if="id == userId"
              @click="deleteProfil()"
            >
              <v-icon left dark>mdi-delete-forever</v-icon>
              Supprimer le compte
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#33A8FF" class="mb-3" @click="updateProfil()">
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
      axios
        .put(
          `http://localhost:3000/profil/${this.id}`,
          {
            bio: this.changedBio,
            avatar: this.changedAvatar,
          },
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
          this.$router.push(`/profil/${this.id}`);
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
    changeAvatar(event) {
      this.$refs.inputFile.click();
      const imgData = new FormData();
      imgData.append("image", event.target.files[0]);

      imgData.append("body", JSON.stringify({ userId: this.id }));
      axios
        .put(`http://localhost:3000/profil/${this.id}`, imgData, {
          headers: {
            Authorization: `Bearer ${store.state.token}`,
          },
        })
        .then(() => {
          axios
            .get(`http://localhost:3000/profil/${this.id}`, {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
              },
            })
            .then((user) => {
              this.user = user.data;
              this.changedBio = user.data.bio;
            });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title:
              "Votre photo n'a pas pu être mise à jour, veuillez réessayer plus tard !",
            showConfirmButton: false,
            timer: 1500,
          });
          console.log("An error occurred:", error.response);
        });
    },
  },
};
</script>
<style scoped>
#app {
  margin-top: 50px;
}
.container {
  max-width: 1950px;
}
input {
  visibility: hidden;
}
</style>
