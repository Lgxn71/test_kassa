import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import LoginPage from "@/pages/auth/LoginPage.vue";
import SignUpPage from "@/pages/auth/SignUpPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/auth/login", component: LoginPage },
  { path: "/auth/sign-up", component: SignUpPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
