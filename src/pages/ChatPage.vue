<script setup lang="ts">
import { nextTick } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const authStore = useAuthStore();

const userToken = localStorage.getItem("userToken");
const refreshToken = localStorage.getItem("refreshToken");

const logout = () => {
  authStore.logout();
  localStorage.clear();
  router.push("/auth/login");

  nextTick();
};
</script>

<template>
  <div class="py-[13.5px]">
    <button v-show="userToken && refreshToken" @click.prevent="logout">
      logout
    </button>
  </div>
</template>
