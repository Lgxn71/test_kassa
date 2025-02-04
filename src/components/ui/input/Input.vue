<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { useVModel } from "@vueuse/core";
import { inputVariants } from ".";
const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  errorMessage: string | undefined;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input
    v-model="modelValue"
    :class="
      cn(
        inputVariants({ variant: errorMessage ? 'error' : 'default' }),
        props.class,
      )
    "
  />
</template>
