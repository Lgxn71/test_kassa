<script setup lang="ts">
import ChatBotIcon from "@/components/ui/icons/ChatBotIcon.vue";

defineProps<{ text: string; messageType?: "text" | "voice" }>();
</script>
<template>
  <div
    class="flex flex-row items-start gap-[15px] whitespace-pre-wrap rounded-xl"
  >
    <ChatBotIcon class="max-h-[30px] min-h-[30px] min-w-[30px] max-w-[30px]" />
    {{ text }}
  </div>
</template>
