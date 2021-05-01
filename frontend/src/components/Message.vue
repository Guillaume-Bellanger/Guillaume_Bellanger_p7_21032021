<template>
  <div>
    <div class="pad">
      <v-btn
        v-if="$store.state.isUserLoggedIn"
        dark
        fab
        class="mt-12 mb-12 pad newMsg"
        left
        color="#33A8FF"
        @click="dialog = !dialog"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-dialog
        v-if="$store.state.isUserLoggedIn"
        v-model="dialog"
        max-width="500px"
      >
        <v-card>
          <v-card-title>Nouveau message</v-card-title>
          <v-card-text>
            <v-textarea
              auto-grow
              counter
              clearable
              placeholder="Votre message"
              v-model="content"
            ></v-textarea>

            <small class="grey--text"
              >* Veuillez entrer un message compris entre 12 et 500
              caractères</small
            >
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text color="primary" @click="(dialog = false), postMessage()"
              >Envoyer</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row v-if="search != null">
        <p class="msgResult">
          {{ searchResult }}
        </p>
        <h2 v-if="allMessages.length > 0" class="msgScript">
          messages :
        </h2>
      </v-row>

      <v-container v-bind:key="index" v-for="(message, index) in allMessages">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" lg="8">
            <v-card class="elevation-12" color="#33A8FF">
              <router-link :to="`/message/${message.msgId}`">
                <v-btn fab x-small top right absolute class="mt-6">
                  <v-icon>
                    mdi-magnify
                  </v-icon>
                </v-btn>
              </router-link>
              <v-card-title>
                <v-list-item>
                  <router-link :to="`/profil/${message.User.userId}`">
                    <v-list-item-avatar outlined color="grey darken-3">
                      <v-img :src="message.User.avatar"></v-img>
                    </v-list-item-avatar>
                  </router-link>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      message.User.name
                    }}</v-list-item-title>
                    <p id="created">{{ message.createdAt }}</p>
                  </v-list-item-content>
                </v-list-item>
              </v-card-title>

              <v-card-text
                v-on:search="getSearch()"
                class="h5 text-center font-weight-bold"
              >
                {{ message.content }}
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-list-item class="justify-end">
                  <router-link :to="`/message/${message.msgId}`">
                    <v-btn icon color="red">
                      <v-icon class="mr-1">mdi-thumb-up</v-icon>
                    </v-btn>
                  </router-link>
                  <span class="subheading mr-2 mt-1">{{
                    message.likesLength
                  }}</span>
                  <span class="mr-3">·</span>
                  <router-link :to="`/message/${message.msgId}`">
                    <v-btn icon color="black">
                      <v-icon class="mr-1">mdi-chat-plus</v-icon>
                    </v-btn>
                  </router-link>
                  <span class="subheading">{{ message.commentLength }}</span>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-row v-if="allUsers.length > 0" class="userContainer">
      <h2 classe="usersScript">Users :</h2>
      <ul v-bind:key="index" v-for="(user, index) in allUsers">
        <li class="userResult">{{ user.name }}</li>
      </ul>
    </v-row>
    <v-pagination
      v-if="search == null"
      :length="10"
      @input="paginationEvent"
    ></v-pagination>
  </div>
</template>

<script>
import axios from "axios";
import store from "../store/index.js";
import Swal from "sweetalert2";

export default {
  name: "Message",
  data() {
    return {
      allMessages: [],
      content: "",
      dialog: false,
      fab: false,
      usersLiked: [],
      totalLikes: [],
      totalComments: [],
      messagesId: [],
      currentPage: 1,
      paginationFactor: 10,
      search: null,
      searchResult: null,
      allUsers: [],
    };
  },
  watch: {},
  methods: {
    postMessage() {
      axios
        .post(
          "http://localhost:3000/message",
          {
            content: this.content,
            userId: store.state.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          }
        )
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Message posté",
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        })
        .catch((error) => {
          //erreur de manipulation
          console.log("An error occurred:", error.response);
        });
    },
    getPosts() {
      //range est la variable de position des messages dans la BDD, currentPage est le numero de la page actuel
      //paginationFactor est le nombre d'article affiché par page

      let range = (this.currentPage - 1) * this.paginationFactor;
      const urlSearch = new URLSearchParams(window.location.search);

      this.search = urlSearch.get("search");
      if (this.search != null) {
        this.getSearch();
        return 0;
      }

      axios
        .get(
          `http://localhost:3000/message/paginate/${range}/${this.paginationFactor}`,
          {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          }
        )

        .then((response) => {
          this.allMessages = response.data.message;

          this.allMessages.forEach((message) => {
            this.messagesId.push(message.msgId);
          });
        })
        .catch((error) => {
          // erreur de manipulation.
          console.log("An error occurred:", error.response);
        });
    },
    getSearch() {
      axios
        .get(`http://localhost:3000/find/${this.search}`, {
          headers: {
            Authorization: `Bearer ${store.state.token}`,
          },
        })

        .then((response) => {
          //choix possible: (message, user) 1) [0.0] 2) [0.1] 3) [1.0] 4) [1.1]
          /*si choix 1) => searchResult = on affiche "aucun résultat" sinon searchResult = `${message.length} message(s) trouvé(s), ${user.length} utilisateur(s) trouvé(s)` */
          const messageLength = response.data.message.length;
          const userLength = response.data.users.length;

          if (!messageLength && !userLength) {
            this.searchResult = "Aucun résultat";
          } else {
            const messageInfo = messageLength
              ? `${messageLength} message(s) trouvé(s)`
              : "";
            const userInfo = userLength
              ? `${userLength} utilisateur(s) trouvé(s)`
              : "";
            //gestion de la virgule
            const separator = messageLength && userLength ? ", " : "";
            this.searchResult = [messageInfo, userInfo].join(separator);
          }
          this.allUsers = response.data.users;
          this.allMessages = response.data.message;

          this.allMessages.forEach((message) => {
            this.messagesId.push(message.msgId);
          });
        })
        .catch((error) => {
          // erreur de manipulation.
          console.log("An error occurred:", error.response);
        });
    },
    paginationEvent(event) {
      this.currentPage = parseInt(event);
      this.allMessages = [];
      this.messagesId = [];
      this.getPosts();
    },
  },
  mounted() {
    this.getPosts();
  },
};
</script>

<style scoped>
#created {
  font-size: 12px;
}
.newMsg {
  z-index: 6;
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
.v-list-item__content {
  padding: 5px 0px !important;
}
.container {
  padding-bottom: 0 !important;
}
.msgResult {
  margin-left: 5%;
}
.msgScript {
  margin-left: 15%;
}

.userContainer {
  margin-top: 5%;

  margin-left: 15%;
}
.userResult {
  padding-top: 5%;
  margin-left: 35%;
}

@media screen and (min-width: 604px) {
  .msgScript {
    line-height: 3;
    margin-right: 50%;
  }
  .userContainer {
    margin-left: 38%;
  }
}
</style>
