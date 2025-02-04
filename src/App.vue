<script setup lang="ts">
import { RouterView } from "vue-router";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const userToken = localStorage.getItem("userToken");
const refreshToken = localStorage.getItem("refreshToken");
const expiresIn = localStorage.getItem("expiresIn");

const checkUser = () => {
  if (userToken && refreshToken && expiresIn) {
    authStore.userInfo.token = userToken;
    authStore.userInfo.expiresIn = expiresIn;
    authStore.userInfo.refreshToken = refreshToken;
  }
};

checkUser();
</script>
<template>
  <RouterView />
  <Toaster position="top-center" />
</template>
