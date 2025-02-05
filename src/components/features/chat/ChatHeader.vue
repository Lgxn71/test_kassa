<script setup lang="ts">
import { nextTick } from "vue";

import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReKassaLogo from "@/components/ui/icons/ReKassaLogo.vue";
import Arrow from "@/components/ui/icons/Arrow.vue";

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
  <div
    class="lg:py-[19;x] flex flex-row justify-between bg-primary px-[13.5px] py-[13.5px] md:px-[23px] md:py-[16px] lg:px-[40px] lg:py-[19px] xl:px-[60px] xl:py-[23px] 2xl:px-[80px] 2xl:py-[26px]"
  >
    <div class="flex flex-row items-center gap-[7.5px] lg:gap-[14.5px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Arrow
              class="cursor-pointer rounded-full hover:bg-[#072b2b]"
              v-show="userToken && refreshToken"
              @click="logout"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Выйти из аккаунта</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <h1
        class="text-base font-medium leading-[19px] text-white lg:text-[19px]"
      >
        Ассистент re:Kassa
      </h1>
    </div>

    <ReKassaLogo class="h-[20px] lg:h-[24px] 2xl:h-[27px]" />
  </div>
</template>
