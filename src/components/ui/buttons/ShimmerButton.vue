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

// default value
const props = withDefaults(defineProps<ShimmerButtonProps>(), {
  shimmerColor: "#00E673",
  shimmerSize: "0.07em",
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
  "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/20 px-3 py-3 text-white hover:text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black",
  "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
  props.className,
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
    <div
      class="absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]"
    >
      <!-- spark -->
      <div
        class="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]"
      >
        <!-- spark before -->
        <div
          class="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]"
        />
      </div>
    </div>

    <slot />

    <!-- Highlight -->
    <div
      class="insert-0 absolute size-full transform-gpu rounded-2xl px-1.5 py-1.5 text-xs font-medium shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
    />

    <!-- backdrop -->
    <div
      class="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
    />
  </button>
</template>
