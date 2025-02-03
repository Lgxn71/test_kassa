<script setup lang="ts">
import { computed, type CSSProperties } from "vue";

interface ShimmerButtonProps {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  borderRadius?: string;
  background?: string;
  className?: string;
}

const props = withDefaults(defineProps<ShimmerButtonProps>(), {
  shimmerColor: "#ffffff",
  shimmerSize: "0.05em",
  shimmerDuration: "3s",
  borderRadius: "100px",
  background: "rgba(0, 0, 0, 1)",
  className: "",
});

const buttonStyle = computed<CSSProperties>(() => ({
  "--spread": "90deg",
  "--shimmer-color": props.shimmerColor,
  "--radius": props.borderRadius,
  "--speed": props.shimmerDuration,
  "--cut": props.shimmerSize,
  "--bg": props.background,
}));

const buttonClass = computed(() => [
  "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black",
  "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
  props.className,
]);

const sparkContainerClass = computed(() => [
  "-z-30 blur-[2px]",
  "absolute inset-0 overflow-visible [container-type:size]",
]);

const highlightClass = computed(() => [
  "insert-0 absolute size-full",
  "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
  "transform-gpu transition-all duration-300 ease-in-out",
  "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
  "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]",
]);

const backdropClass = computed(() => [
  "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]",
]);
</script>

<template>
  <button
    :style="buttonStyle"
    :class="buttonClass"
    ref="buttonRef"
    v-bind="$attrs"
  >
    <!-- spark container -->
    <div :class="sparkContainerClass">
      <!-- spark -->
      <div
        class="animate-shimmer-slide absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none]"
      >
        <!-- spark before -->
        <div
          class="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]"
        />
      </div>
    </div>
    <slot></slot>

    <!-- Highlight -->
    <div :class="highlightClass" />

    <!-- backdrop -->
    <div :class="backdropClass" />
  </button>
</template>

<style scoped>
/* Define the shimmer slide animation */
@keyframes shimmer-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer-slide {
  animation: shimmer-slide var(--speed) linear infinite;
}

/* Define the spin around animation */
@keyframes spin-around {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-around {
  animation: spin-around var(--speed) linear infinite;
}
</style>
