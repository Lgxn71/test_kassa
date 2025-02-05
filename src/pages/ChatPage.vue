<script setup lang="ts">
import { ref, computed } from "vue";

import ChatHeader from "@/components/features/chat/ChatHeader.vue";
import MessageBot from "@/components/features/chat/MessageBot.vue";
import MessageUser from "@/components/features/chat/MessageUser.vue";

import Button from "@/components/ui/buttons/button-base/Button.vue";
import { inputVariants } from "@/components/ui/input";

import { cn, formatTime, getTextToDisplay } from "@/lib/utils";

import X from "@/components/ui/icons/X.vue";
import Arrow from "@/components/ui/icons/Arrow.vue";
import Microphone from "@/components/ui/icons/Microphone.vue";
import Audio from "@/components/ui/audio/Audio.vue";

// --- Reactive State ---
const messages = ref<ChatMessage[]>([]);
const actionButtons = ref([
  "Расскажи о своих возможностях",
  "Оформи чек",
  "Подсчитай остатки",
  "Создай отчет на тему",
  "Еще...",
]);
const newMessage = ref("");
const isBotTyping = ref(false);

// --- Audio Recording State ---
const isVoiceMessageRecording = ref(false);
let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];
const recordingTime = ref(0);
let recordingTimerInterval: number | undefined;

const formattedRecordingTime = computed(() => formatTime(recordingTime.value));

const pushMessage = (message: ChatMessage) => messages.value.push(message);

// --- Bot Typing Simulation ---
const dummyBotResponses = ["Добавьте backend для ответов от бота"];
let typingInterval: number | undefined;

/**
 * Simulate bot typing by revealing text one character at a time.
 */
const typeText = async (fullText: string) => {
  isBotTyping.value = true;
  const botMessage: ChatMessage = {
    sender: "bot",
    text: "",
    messageType: "text",
  };
  pushMessage(botMessage);

  let index = 0;
  typingInterval = window.setInterval(() => {
    if (index < fullText.length) {
      botMessage.text += fullText.charAt(index);
      index++;
      // Force reactivity update if needed
      messages.value = [...messages.value];
    } else {
      clearInterval(typingInterval);
      isBotTyping.value = false;
    }
  }, 20);
};

/**
 * Handles sending of a user message.
 */
const onSendMessage = () => {
  if (isBotTyping.value || !newMessage.value.trim()) return;

  pushMessage({
    sender: "user",
    text: newMessage.value,
    messageType: "text",
  });
  newMessage.value = "";

  setTimeout(() => {
    replyWithDummyBotResponse();
  }, 500);
};

/**
 * Replies with a dummy bot response.
 */
const replyWithDummyBotResponse = () => {
  const dummyText = dummyBotResponses[0];
  const textToDisplay = getTextToDisplay(dummyText);
  if (textToDisplay !== "") typeText(textToDisplay);
  else typeText("Добавьте бэкенд чтобы получать ответы от бота");
};

/**
 * Handles the click on an action button.
 */
const onClickActionButton = (buttonText: string) => {
  if (isBotTyping.value) return;

  pushMessage({
    sender: "user",
    text: buttonText,
    messageType: "text",
  });
  const textToDisplay = getTextToDisplay(buttonText);
  typeText(textToDisplay);
};

// --- Audio Recording Functions ---

/**
 * Start audio recording using the MediaRecorder API.
 */
const startRecording = async () => {
  if (isBotTyping.value) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.start();
    isVoiceMessageRecording.value = true;
    recordingTime.value = 0;
    recordingTimerInterval = window.setInterval(() => {
      recordingTime.value++;
    }, 1000);
  } catch (error) {
    console.error("Error starting audio recording:", error);
  }
};

/**
 * Stop the audio recording, create a blob URL, and add it as a message.
 */
const stopRecording = () => {
  if (!mediaRecorder || !isVoiceMessageRecording.value) return;
  mediaRecorder.stop();
  isVoiceMessageRecording.value = false;

  if (recordingTimerInterval) {
    clearInterval(recordingTimerInterval);
    recordingTimerInterval = undefined;
  }

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(recordedChunks, { type: "audio/mp3" });
    const audioUrl = URL.createObjectURL(audioBlob);
    pushMessage({
      sender: "user",
      text: audioUrl,
      messageType: "audio",
    });
  };

  setTimeout(() => {
    replyWithDummyBotResponse();
  }, 500);
};

/**
 * Cancel the current audio recording and reset state.
 */
const cancelRecording = () => {
  if (!mediaRecorder || !isVoiceMessageRecording.value) return;
  mediaRecorder.stop();
  isVoiceMessageRecording.value = false;

  if (recordingTimerInterval) {
    clearInterval(recordingTimerInterval);
    recordingTimerInterval = undefined;
  }
  recordedChunks = [];
};
</script>

<template>
  <div class="relative h-screen">
    <ChatHeader />

    <!-- Welcome section (shown when there are no messages) -->
    <div
      v-show="messages.length === 0"
      class="px-[15px] phone-400:px-[33px] sm:text-center lg:px-[40px] xl:px-[60px] 2xl:px-[80px]"
    >
      <h2
        class="pb-[28px] pt-[262px] text-[30px] font-bold leading-[30px] text-[#000000DE]"
      >
        Чем мы можем помочь?
      </h2>
      <div class="flex flex-wrap gap-[15px] sm:items-center sm:justify-center">
        <Button
          v-for="buttonText in actionButtons"
          :key="buttonText"
          variant="outline-accent"
          @click.prevent="onClickActionButton(buttonText)"
          :disabled="isBotTyping"
        >
          {{ buttonText }}
        </Button>
      </div>
    </div>

    <!-- Chat messages -->
    <div
      class="space-y-4 px-[15px] pt-[50px] phone-395:px-[23px] lg:px-[40px] xl:px-[60px] 2xl:px-[80px]"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="
          cn(
            'flex',
            message.sender === 'user' ? 'justify-end' : 'justify-start',
          )
        "
      >
        <!-- Render audio message -->
        <template v-if="message.messageType === 'audio'">
          <Audio :src="message.text" />
        </template>

        <!-- Render text message -->
        <template v-else>
          <MessageBot
            v-if="message.sender === 'bot'"
            :text="message.text"
            class="text-[16.5px] lg:text-[19px]"
            messageType="text"
          />
          <MessageUser
            v-else
            :text="message.text"
            class="text-[16.5px] lg:text-[19px]"
            messageType="text"
          />
        </template>
      </div>
    </div>

    <!-- Message input and voice recording controls -->
    <div
      class="absolute bottom-[40px] left-0 right-0 mx-auto flex w-full max-w-[1480px] flex-row items-center justify-center gap-2 px-[15px] phone-395:px-[23px] lg:px-[40px] xl:px-[60px] 2xl:px-[80px]"
    >
      <!-- Text input when not recording -->
      <div
        class="flex h-[44px] w-full items-center justify-between rounded-md bg-[#F5F5F5] p-[8px] phone-400:p-[12px]"
      >
        <template v-if="!isVoiceMessageRecording">
          <input
            placeholder="Напишите сообщение"
            type="text"
            v-model="newMessage"
            @keydown.enter="onSendMessage"
            :class="
              cn(inputVariants({ variant: 'chat', size: 'chat' }), 'w-full')
            "
            :disabled="isBotTyping"
          />
          <div
            class="cursor-pointer"
            @mousedown="startRecording"
            @touchstart.prevent="startRecording"
          >
            <Microphone />
          </div>
        </template>

        <template v-else>
          <X
            class="max-h-[22px] min-h-[12px] min-w-[12px] max-w-[22px] cursor-pointer phone-400:max-h-[25px] phone-400:max-w-[25px] md:max-h-[26px] md:max-w-[26px]"
            @click="cancelRecording"
          />
          <p
            class="text-[12px] text-[#0000008A] phone-400:text-[16px] lg:text-[19px]"
          >
            Запись Аудио...
          </p>
          <div class="flex items-center gap-2">
            <div
              class="h-3 w-3 rounded-full bg-[#D54444] phone-400:h-4 phone-400:w-4"
            />
            <p class="text-[12px] text-[#0000008A] phone-400:text-[16px]">
              {{ formattedRecordingTime }}
            </p>
          </div>
        </template>
      </div>

      <!-- Submit / Stop Recording Button -->
      <Button
        variant="chat-submit"
        size="chat-submit"
        @click="isVoiceMessageRecording ? stopRecording() : onSendMessage()"
        :disabled="isBotTyping"
      >
        <Arrow class="min-h-[22px] min-w-[22px] rotate-90" />
      </Button>
    </div>
  </div>
</template>
