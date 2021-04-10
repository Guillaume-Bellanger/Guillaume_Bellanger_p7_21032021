import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import SignUp from "../components/SignUp.vue";
import Home from "../components/Home.vue";
import Message from "../components/Message.vue";
import Profil from "../components/Profil.vue";
import OneMessage from "../components/OneMessage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "SignUp",

    component: SignUp,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/message/",
    name: "Message",
    component: Message,
  },
  {
    path: "/message/:id",
    name: "OneMessage",
    component: OneMessage,
  },
  {
    path: "/profil/:id",
    name: "Profil",
    component: Profil,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
