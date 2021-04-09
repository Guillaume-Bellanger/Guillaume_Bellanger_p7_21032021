<template>
  <div id="pad">
    <v-container>
      <v-row align="center" justify="center" class="mb-5">
        <v-col cols="12" sm="12" md="8">
          <router-link :to="`/message/`">
            <v-btn outlined absolute left text>
              <v-icon class="mr-2">mdi-undo</v-icon>
              Retour aux messages
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="12" md="8">
          <v-speed-dial
            v-model="fab"
            absolute
            right
            direction="left"
            transition="slide-x-reverse-transition"
            v-if="isAdmin"
          >
            <template v-slot:activator>
              <v-btn v-model="fab" color="blue darken-2" dark fab small>
                <v-icon v-if="fab"> mdi-close </v-icon>
                <v-icon v-else> mdi-format-list-bulleted-square </v-icon>
              </v-btn>
            </template>
            <v-btn fab dark small color="green" @click="dialog = true">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn fab dark small color="red" @click="deleteMessage()">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-speed-dial>
          <v-speed-dial
            v-model="fab"
            absolute
            top
            right
            direction="left"
            transition="slide-x-reverse-transition"
            v-else-if="id == userId"
          >
            <template v-slot:activator>
              <v-btn v-model="fab" color="blue darken-2" dark fab x-small>
                <v-icon v-if="fab"> mdi-close </v-icon>
                <v-icon v-else> mdi-format-list-bulleted-square </v-icon>
              </v-btn>
            </template>
            <v-btn fab dark small color="green" @click="dialog = true">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn fab dark small color="red" @click="deleteMessage()">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-speed-dial>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>Nouveau message</v-card-title>
              <v-card-text>
                <v-textarea
                  auto-grow
                  counter
                  clearable
                  v-model="message.content"
                ></v-textarea>

                <small class="grey--text"
                  >* Veuillez entrer un message compris entre 12 et 500
                  caractères</small
                >
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  text
                  color="primary"
                  @click="(dialog = false), updateMessage()"
                  >Modifier</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-card class="elevation-12" color="#26c6da">
            <v-card-title>
              <v-list-item>
                <router-link :to="`/profil/${message.userId}`">
                  <v-list-item-avatar outlined color="grey darken-3">
                    <v-img :src="message.User.avatar"></v-img>
                  </v-list-item-avatar>
                </router-link>
                <v-list-item-content>
                  <v-list-item-title>{{ message.User.name }}</v-list-item-title>
                  <p id="created">{{ message.createdAt }}</p>
                </v-list-item-content>
              </v-list-item>
            </v-card-title>

            <v-card-text class="h5 text-center font-weight-bold">
              {{ message.content }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-list-item class="justify-end">
                <v-btn
                  icon
                  color="red"
                  v-if="userLikeSearch"
                  @click="disliked()"
                >
                  <v-icon class="mr-1">mdi-thumb-up</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="grey"
                  v-else-if="!userLikeSearch"
                  @click="liked()"
                >
                  <v-icon class="mr-1">mdi-thumb-up</v-icon>
                </v-btn>
                <span class="subheading mr-2 mt-1">{{ totalLikes }}</span>
                <span class="mr-3">·</span>
                <v-btn icon color="black" @click="dialog2 = !dialog2">
                  <v-dialog
                    v-if="$store.state.isUserLoggedIn"
                    v-model="dialog2"
                    max-width="500px"
                  >
                    <v-card>
                      <v-card-title>Nouveau commentaire</v-card-title>
                      <v-card-text>
                        <v-textarea
                          auto-grow
                          counter
                          clearable
                          placeholder="Votre commentaire"
                          v-model="comment"
                        ></v-textarea>

                        <small class="grey--text"
                          >* Veuillez entrer un commentaire compris entre 12 et
                          500 caractères</small
                        >
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                          text
                          color="primary"
                          @click="(dialog2 = false), postComment()"
                          >Envoyer</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-icon class="mr-1">mdi-chat-plus</v-icon>
                </v-btn>
                <span class="subheading mr-2 mt-1">{{
                  allComments.length
                }}</span>
              </v-list-item>
            </v-card-actions>
          </v-card>

          <!--
/*Affichage des commentaires
--><v-col
            cols="10"
            sm="10"
            md="8"
            v-bind:key="index"
            v-for="(comment, index) in allComments"
          >
            <v-speed-dial
              v-model="fab"
              absolute
              right
              top
              direction="left"
              transition="slide-x-reverse-transition"
              v-if="isAdmin"
            >
              <template v-slot:activator>
                <v-btn v-model="fab" fab icon x-small>
                  <v-icon v-if="fab"> mdi-close </v-icon>
                  <v-icon v-else> mdi-dots-vertical </v-icon>
                </v-btn>
              </template>
              <v-btn fab dark small color="green" @click="dialog3 = true">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                fab
                dark
                small
                color="red"
                @click="deleteComment(comment.commentId)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-speed-dial>
            <v-speed-dial
              v-model="fab"
              absolute
              right
              top
              direction="left"
              transition="slide-x-reverse-transition"
              v-else-if="comment.userId == userId"
            >
              <template v-slot:activator>
                <v-btn v-model="fab" fab icon x-small>
                  <v-icon v-if="fab"> mdi-close </v-icon>
                  <v-icon v-else> mdi-dots-vertical </v-icon>
                </v-btn>
              </template>
              <v-btn fab small color="green" @click="dialog3 = true">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                fab
                small
                color="red"
                @click="deleteComment(comment.commentId)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-speed-dial>
            <v-dialog v-model="dialog3" activator max-width="500px">
              <v-card>
                <v-card-title>Modifiez votre message</v-card-title>
                <v-card-text>
                  <v-textarea
                    auto-grow
                    counter
                    clearable
                    v-model="comment.comment"
                  ></v-textarea>

                  <small class="grey--text"
                    >* Veuillez entrer un commentaire compris entre 12 et 500
                    caractères</small
                  >
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    text
                    color="primary"
                    @click="(dialog3 = false), updateComment(comment.commentId)"
                    >Modifier</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-card class="elevation-8" color="#E3F2FD">
              <v-card-title class="reduc_pad">
                <v-list-item>
                  <router-link :to="`/profil/${comment.User.userId}`">
                    <v-list-item-avatar outlined color="grey darken-3">
                      <v-img x-small :src="comment.User.avatar"></v-img>
                    </v-list-item-avatar>
                  </router-link>
                  <v-list-item-content>
                    <v-list-item-title class="h6">{{
                      comment.User.name
                    }}</v-list-item-title>
                    <p id="created">{{ comment.createdAt }}</p>
                  </v-list-item-content>
                </v-list-item>
              </v-card-title>

              <v-card-text
                class="h6 text-center font-weight-bold"
                color="black"
              >
                {{ comment.comment }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
import axios from "axios";
import store from "../store/index.js";
import { mapState } from "vuex";
import Swal from "sweetalert2";

export default {
  name: "OneMessage",
  data() {
    return {
      message: [],
      comment: "",
      allComments: [],
      dialog: false,
      dialog2: false,
      dialog3: false,
      id: this.$route.params.id,
      usersLiked: [],
      userLikeSearch: false,
      totalLikes: "",
    };
  },
  methods: {
    postComment() {
      axios
        .post(
          `http://localhost:3000/message/${this.id}/comment`,
          {
            comment: this.comment,
            userId: store.state.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          }
        )
        .then((comment) => {
          console.log(comment);
          this.allComments = [];
          this.comment = "";

          Swal.fire({
            icon: "success",
            title: "Commentaire posté",
            showConfirmButton: false,
            timer: 1000,
          });
          axios
            .get(`http://localhost:3000/message/${this.id}/comment`, {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
              },
            })
            .then((response) => {
              console.log(response);
              for (const comment of response.data.comments) {
                this.allComments.push(comment);
              }
            });
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
        });
    },
    liked() {
      this.usersLiked = [];
      axios
        .post(
          `http://localhost:3000/message/${this.id}/like`,
          {
            userId: store.state.userId,
            msgId: this.id,
          },
          {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          }
        )
        .then(() => {
          axios
            .get(`http://localhost:3000/message/${this.id}/like`, {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
              },
            })
            .then((response) => {
              console.log(response);
              this.totalLikes = response.data.likes.count;
              response.data.likes.rows.forEach((rows) => {
                this.usersLiked.push(rows.userId);
              });
              if (this.usersLiked.indexOf(this.$store.state.userId) === -1) {
                this.userLikeSearch = false;
              } else {
                this.userLikeSearch = true;
              }
            })
            .catch((error) => {
              console.log("An error occurred:", error.response);
            });
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
        });
    },
    disliked() {
      this.usersLiked = [];
      axios
        .delete(`http://localhost:3000/message/${this.id}/like`, {
          headers: {
            Authorization: `Bearer ${store.state.token}`,
          },
        })
        .then(() => {
          axios
            .get(`http://localhost:3000/message/${this.id}/like`, {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
              },
            })
            .then((response) => {
              console.log(response);
              this.totalLikes = response.data.likes.count;

              response.data.likes.rows.forEach((rows) => {
                this.usersLiked.push(rows.userId);
              });
              if (this.usersLiked.indexOf(this.$store.state.userId) === -1) {
                this.userLikeSearch = false;
              } else {
                this.userLikeSearch = true;
              }
            })
            .catch((error) => {
              console.log("An error occurred:", error.response);
            });
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
        });
    },
    allMessages() {
      this.$route.push("/message/");
    },
    deleteMessage() {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous me pourrez pas revenir en arrière !",
        icon: "warning",
        confirmButtonText: "Oui, supprimer le message!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      })
        .then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Message supprimé!",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
            });
            axios.delete(`http://localhost:3000/message/${this.id}`, {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
              },
            });
            this.$router.push("/message");
          }
        })
        .catch((error) => {
          // Handle error.
          Swal.fire({
            icon: "error",
            title:
              "Le message n'a pas pu être supprimé, veuillez réessayer plus tard !",
            showConfirmButton: false,
            timer: 2500,
          });
          console.log("An error occurred:", error.response);
        });
    },
    updateMessage() {
      axios
        .put(
          `http://localhost:3000/message/${this.id}`,
          {
            content: this.message.content,
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
            title: "Message modifié",
            showConfirmButton: false,
            timer: 1000,
          });
        })
        .catch((error) => {
          // Handle error.
          Swal.fire({
            icon: "error",
            title:
              "Le messagen'a pas pu être modifié, veuillez réessayer plus tard !",
            showConfirmButton: false,
            timer: 1000,
          });
          console.log("An error occurred:", error.response);
        });
    },
    deleteComment(commentId) {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous me pourrez pas revenir en arrière !",
        icon: "warning",
        confirmButtonText: "Oui, supprimer le commentaire!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      })
        .then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Commentaire supprimé!",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
            });
            axios
              .delete(
                "http://localhost:3000/message/" +
                  `${this.id}` +
                  "/comment/" +
                  commentId,
                {
                  headers: {
                    Authorization: `Bearer ${store.state.token}`,
                  },
                }
              )
              .then(() => {
                this.allComments = [];
                axios
                  .get(`http://localhost:3000/message/${this.id}/comment`, {
                    headers: {
                      Authorization: `Bearer ${store.state.token}`,
                    },
                  })
                  .then((response) => {
                    console.log(response);
                    for (const comment of response.data.comments) {
                      this.allComments.push(comment);
                    }
                  })
                  .catch((error) => {
                    console.log("An error occurred:", error.response);
                  });
              });
          }
        })
        .catch((error) => {
          // Handle error.
          Swal.fire({
            icon: "error",
            title:
              "Le commentaire n'a pas pu être supprimé, veuillez réessayer plus tard !",
            showConfirmButton: false,
            timer: 2500,
          });
          console.log("An error occurred:", error.response);
        });
    },
    updateComment(commentId) {
      axios
        .put(
          `http:localhost:3000/message/${this.id}/comment/${commentId}`,
          {
            comment: this.comment.comment,
          },
          {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          }
        )
        .then((comment) => {
          console.log(comment);
          Swal.fire({
            icon: "success",
            title: "Commentaire modifié",
            showConfirmButton: false,
            timer: 1000,
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title:
              "Le commentaire n'a pas pu être modifié, veuillez réessayer plus tard !",
            showConfirmButton: false,
            timer: 1000,
          });
          console.log("An error occurred:", error.response);
        });
    },
  },
  computed: {
    ...mapState(["isAdmin", "userId"]),
  },

  mounted() {
    axios
      .get(`http://localhost:3000/message/${this.id}`, {
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      })
      .then((message) => {
        console.log(message.data);
        this.message = message.data.message;
      })
      .then(() => {
        axios
          .get(`http://localhost:3000/message/${this.id}/comment`, {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          })
          .then((response) => {
            console.log(response);
            for (const comment of response.data.comments) {
              this.allComments.push(comment);
            }
          })
          .catch((error) => {
            console.log("An error occurred:", error.response);
          });
      })
      .then(() => {
        axios
          .get(`http://localhost:3000/message/${this.id}/like`, {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          })
          .then((response) => {
            console.log(response);
            this.totalLikes = response.data.likes.count;
            response.data.likes.rows.forEach((rows) => {
              this.usersLiked.push(rows.userId);
            });
            if (this.usersLiked.indexOf(this.$store.state.userId) === -1) {
              this.userLikeSearch = false;
            } else {
              this.userLikeSearch = true;
            }
          })
          .catch((error) => {
            console.log("An error occurred:", error.response);
          });
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  },
};
</script>

<style scoped>
#pad {
  margin-top: 80px;
}
#created {
  font-size: 12px;
}
.v-divider {
  margin: 0;
}
.v-card__actions {
  padding: 0 !important;
}
.v-list-item {
  padding: 0 5px !important;
}
.reduc_pad {
  padding: 5px 16px 0px 10px !important;
}
.v-list-item__content {
  padding: 5px 0px !important;
}
</style>
