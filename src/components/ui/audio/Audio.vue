<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Button from "../buttons/button-base/Button.vue";
import { formatTime, roundedRect } from "@/lib/utils";
import PlayTriangle from "../icons/PlayTriangle.vue";
import { Pause } from "lucide-vue-next";

const props = defineProps<{ src: string }>();

// Create the audio element
const audio = ref<HTMLAudioElement>(new Audio(props.src));
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const formattedTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));

const togglePlay = () => {
  if (audio.value) {
    if (isPlaying.value) {
      audio.value.pause();
    } else {
      // Adding a slight delay to avoid autoplay issues in Safari
      setTimeout(() => {
        // When starting playback from the beginning, reset the waveform if we're at the end.
        if (currentTime.value >= duration.value) {
          currentTime.value = 0;
          smoothedProgress.value = 0;
          audio.value.currentTime = 0;
        }
        audio.value.play().catch((e) => {
          console.error("Autoplay prevented or operation not supported: ", e);
        });
      }, 100); // Small delay
    }
  }
};

// ----------------------
// Waveform drawing logic
// ----------------------
const canvasRef = ref<HTMLCanvasElement | null>(null);
const waveformData = ref<number[]>([]);

// This value will ease toward the actual progress ratio.
const smoothedProgress = ref(0);

/**
 * Fetches and decodes the audio data from the blob URL,
 * then returns an array of amplitude values.
 * Lower the sample count to reduce the number of bars.
 */
async function getWaveformData(
  blobUrl: string,
  samples = 60,
): Promise<number[]> {
  try {
    const response = await fetch(blobUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)(); // Using type assertion for Safari compatibility
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / samples);
    const data: number[] = [];

    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[i * blockSize + j]);
      }
      data.push(sum / blockSize);
    }
    return data;
  } catch (error) {
    console.error("Error fetching or decoding waveform data:", error);
    return [];
  }
}

/**
 * Draws the waveform data on the canvas, smoothly updating the played portion.
 */

function animateCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  if (waveformData.value.length) {
    const gap = 2;
    const totalGaps = (waveformData.value.length - 1) * gap;
    const barWidth = (width - totalGaps) / waveformData.value.length;

    const actualProgress = duration.value
      ? currentTime.value / duration.value
      : 0;

    smoothedProgress.value += actualProgress - smoothedProgress.value;

    const playedColor = "#08B0A0";
    const unplayedColor = "#676767";

    waveformData.value.forEach((value, index) => {
      const barCenterRatio = (index + 0.5) / waveformData.value.length;
      const pixelsForBarsWithNoSound = 7;
      const barHeight = value * height * 10 + pixelsForBarsWithNoSound;
      const x = index * (barWidth + gap);
      const y = (height - barHeight) / 2;
      const barWidthAdjusted = barWidth;

      const radius = 4;

      ctx.fillStyle =
        barCenterRatio <= smoothedProgress.value ? playedColor : unplayedColor;

      roundedRect(ctx, x, y, barWidthAdjusted, barHeight, radius);
      ctx.fill();
    });
  }

  // Throttle requestAnimationFrame for smoother updates
  if (navigator.userAgent.includes("Safari")) {
    setTimeout(() => requestAnimationFrame(animateCanvas), 20); // Adjust for Safari performance
  } else {
    requestAnimationFrame(animateCanvas);
  }
}

// ----------------------
// Audio event listeners
// ----------------------
onMounted(() => {
  audio.value.addEventListener("timeupdate", () => {
    currentTime.value = audio.value?.currentTime || 0;
  });

  audio.value.addEventListener("loadedmetadata", () => {
    // to fix is Nan Error (chromium bug i guess)
    if (
      audio.value.duration === Infinity ||
      isNaN(Number(audio.value.duration))
    ) {
      audio.value.currentTime = 1e101;
      audio.value.addEventListener("timeupdate", getAudioDuration);
    } else {
      duration.value = audio.value.duration;
    }
  });

  audio.value.addEventListener("ended", () => {
    isPlaying.value = false;
    // Reset waveform and playback time when the audio ends.
    currentTime.value = 0;
    smoothedProgress.value = 0;
    audio.value.currentTime = 0;
  });

  audio.value.addEventListener("play", () => {
    isPlaying.value = true;
  });
  audio.value.addEventListener("pause", () => {
    isPlaying.value = false;
  });

  // Get waveform data with fewer samples and start the animation loop
  getWaveformData(props.src, 25).then((data) => {
    waveformData.value = data;
    requestAnimationFrame(animateCanvas);
  });
});

function getAudioDuration(event: Event) {
  if (event.target) {
    const target = event.target as HTMLAudioElement;
    target.currentTime = 0;
    target.removeEventListener("timeupdate", getAudioDuration);
    duration.value = target.duration;
  }
}

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value.src = "";
    audio.value.load();
  }
});
</script>

<template>
  <div
    class="flex flex-col gap-2 rounded-xl bg-[#F2F2F2] p-1 px-3 shadow-sm md:p-2 md:px-4"
  >
    <div class="flex items-center gap-2 md:gap-4">
      <Button variant="chat-submit" size="chat-submit" @click="togglePlay">
        <span v-if="!isPlaying">
          <PlayTriangle />
        </span>
        <span v-else>
          <Pause class="fill-white text-white" />
        </span>
      </Button>
      <canvas ref="canvasRef" class="max-h-[64px] max-w-[150px]" />
      <div class="max-w-[37px] text-sm font-medium text-[#0000008A]">
        {{ isPlaying ? formattedTime : formattedDuration }}
      </div>
    </div>
  </div>
</template>
