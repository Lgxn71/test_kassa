<script setup lang="ts">
import ShimmerButton from "@/components/ui/buttons/ShimmerButton.vue";
</script>
<template>
  <div className="flex bg-black items-center justify-center h-screen">
    <RouterLink to="/auth/sign-up">
      <ShimmerButton>Чтобы зарегистрироваться в этом демо нажмите на кнопку</ShimmerButton>
    </RouterLink>
  </div>
</template>
