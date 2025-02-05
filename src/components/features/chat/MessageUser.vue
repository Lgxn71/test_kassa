<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{ text: string; messageType?: "text" | "voice" }>();
</script>
<template>
  <div class="self-end whitespace-pre-wrap rounded-xl bg-[#F2F2F2] p-[15px]">
    {{ text }}
  </div>
</template>
