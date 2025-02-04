import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import HomePage from "@/pages/HomePage.vue";
import LoginPage from "@/pages/auth/LoginPage.vue";
import SignUpPage from "@/pages/auth/SignUpPage.vue";
import ChatPage from "@/pages/ChatPage.vue";

const routes = [
  { path: "/", component: HomePage, meta: { auth: false } },
  { path: "/auth/login", component: LoginPage, meta: { auth: false } },
  { path: "/auth/sign-up", component: SignUpPage, meta: { auth: false } },
  { path: "/chat", component: ChatPage, meta: { auth: true } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.userInfo.token;

  if (to.meta.auth && !isAuthenticated) {
    next({ path: "/auth/login" });
  } else if (!to.meta.auth && isAuthenticated) {
    if (to.path === "/auth/login" || to.path === "/auth/sign-up") {
      next({ path: "/chat" });
    } else {
      next();
    }
  } else {
    next();
  }
});
