import { createMemoryHistory, createRouter } from "vue-router";

import HomePage from "../pages/HomePage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/auth/login", component: HomePage },
  { path: "/auth/sign-up", component: HomePage },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
