<script setup lang="ts">
import { ref } from "vue";

import { useRouter, RouterLink } from "vue-router";

import { useAuthStore } from "@/stores/auth";

import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import AuthSchema from "@/validations/AuthSchema";

import { toast } from "vue-sonner";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/buttons/button-base";
import { Input } from "@/components/ui/input";

import { Lock, LoaderCircle } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref<boolean>(false);

const { handleSubmit, errors, resetForm, setFieldError } = useForm({
  validationSchema: toTypedSchema(AuthSchema),
});

const onSubmit = handleSubmit(async (val) => {
  isLoading.value = true;
  const isSuccesfulSignup = await authStore.signUp(val);
  if (isSuccesfulSignup) {
    resetForm();
    isLoading.value = false;

    toast.success("Вы успешно создали аккаунт");

    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  } else {
    isLoading.value = false;
    if (authStore.error.fieldTrigger !== "") {
      setFieldError(authStore.error.fieldTrigger, authStore.error.message);
    }
  }
});
</script>

<template>
  <div
    class="m-auto flex h-screen items-center justify-center lg:w-[90%] lg:grid-cols-2"
  >
    <div class="flex flex-row items-center rounded-lg lg:border">
      <div class="hidden w-[50%] bg-muted lg:block lg:max-w-[705px] lg:flex-1">
        <img
          src="/placeholder.svg"
          alt="Image"
          class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div
        class="lg:w-max-[450px] w-[100%] py-12 lg:max-w-[450px] lg:flex-1 lg:px-[28px]"
      >
        <div class="phone-395:w-[100%] mx-auto grid w-[90%] gap-5">
          <div class="text-center">
            <h1 class="text-3xl font-bold">Создать аккаунт</h1>
            <p class="text-balance text-muted-foreground">
              Создайте аккаунт используя ваш email и пароль
            </p>
          </div>

          <div class="text-muted-foreground">
            <p class="text-balance pb-0.5 text-xs">
              Пожалуйста убедитесь, что вы посещаете
            </p>

            <div
              class="flex w-fit flex-row items-center gap-[5px] rounded-sm border bg-slate-50 py-1 pl-1 pr-3"
            >
              <Lock class="max-h-4 min-h-4 min-w-4 max-w-4" />
              <span class="text-balance text-xs text-[#249a5f]">
                <strong>https://rekassa.kz</strong>
              </span>
            </div>
          </div>

          <form class="grid gap-3" @submit.prevent="onSubmit">
            <div class="grid gap-2">
              <FormField v-slot="{ componentField }" name="email">
                <div class="grid gap-2">
                  <FormItem>
                    <FormLabel for="email">E-mail</FormLabel>
                    <FormControl>
                      <Input
                        :errorMessage="errors.email"
                        id="email"
                        type="email"
                        placeholder="введите ваш e-mail"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </FormField>

              <FormField v-slot="{ componentField }" name="password">
                <div class="grid gap-2">
                  <FormItem>
                    <FormLabel for="password">Пароль</FormLabel>
                    <FormControl>
                      <Input
                        :errorMessage="errors.password"
                        id="password"
                        type="password"
                        placeholder="введите ваш пароль"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </FormField>
            </div>
            <Button :disabled="isLoading" type="submit" class="w-full">
              <LoaderCircle class="animate-spin" v-if="isLoading" />
              Создать
            </Button>
          </form>

          <div class="mt-4 text-center text-sm">
            У вас уже есть аккаунт?
            <RouterLink to="/auth/login" class="underline"> Войти </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
