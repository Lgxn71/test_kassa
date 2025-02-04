import { nextTick, ref } from "vue";
import { defineStore } from "pinia";

import { AxiosError } from "axios";
import firebaseAPI from "@/utils/api";

const firebaseAPIKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref({
    token: "",
    email: "",
    userId: "",
    refreshToken: "",
    expiresIn: "",
  });
  const error = ref<{
    message: string;
    fieldTrigger: "email" | "password" | "";
  }>({
    message: "",
    fieldTrigger: "",
  });
  const login = async (payload: { email: string; password: string }) => {
    await nextTick();
    error.value = {
      message: "",
      fieldTrigger: "",
    };
    try {
      let response = await firebaseAPI.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`,
        {
          ...payload,
          returnSecureToken: true,
        },
      );

      userInfo.value = {
        token: response.data.idToken,
        email: response.data.email,
        userId: response.data.localId,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      };

      localStorage.setItem("userToken", response.data.idToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("expiresIn", response.data.expiresIn);
      return true;
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        if (err.response !== undefined && err.response.data !== undefined) {
          switch (err.response.data.error.message) {
            case "INVALID_LOGIN_CREDENTIALS":
              error.value = {
                message: "Неверный логин или пароль",
                fieldTrigger: "password",
              };
              break;
            case "OPERATION_NOT_ALLOWED":
              error.value = {
                message: "Операция не разрешена",
                fieldTrigger: "password",
              };
              break;
            case "TOO_MANY_ATTEMPTS_TRY_LATER":
              error.value = {
                message: "Неверный логин или пароль",
                fieldTrigger: "password",
              };
              break;
            case "EMAIL_NOT_FOUND":
              error.value = {
                message: "Email не найден, попробуйте другой",
                fieldTrigger: "email",
              };
              break;
            case "INVALID_PASSWORD":
              error.value = {
                message: "Неверный пароль",
                fieldTrigger: "password",
              };
              break;
            case "USER_DISABLED":
              error.value = {
                message: "Пользователь заблокирован",
                fieldTrigger: "email",
              };
              break;
            case "USER_NOT_FOUND":
              error.value = {
                message: "Пользователь не найден",
                fieldTrigger: "email",
              };
              break;
            default:
              error.value = {
                message: "Что-то пошло не так",
                fieldTrigger: "password",
              };
          }
        }
      }
      return false;
    }
  };

  const signUp = async (payload: { email: string; password: string }) => {
    await nextTick();

    error.value = {
      message: "",
      fieldTrigger: "",
    };

    try {
      await firebaseAPI.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseAPIKey}`,
        {
          ...payload,
          returnSecureToken: true,
        },
      );

      return true;
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        if (err.response != undefined) {
          switch (err.response.data.error.message) {
            case "EMAIL_EXISTS":
              error.value = {
                message: "Данный email уже зарегистрирован",
                fieldTrigger: "email",
              };
              break;
            case "OPERATION_NOT_ALLOWED":
              error.value = {
                message: "Операция не разрешена",
                fieldTrigger: "password",
              };
              break;
            case "TOO_MANY_ATTEMPTS_TRY_LATER":
              error.value = {
                message: "Cлишком много попыток, попробуйте позже",
                fieldTrigger: "email",
              };
              break;
            case "EMAIL_NOT_FOUND":
              error.value = {
                message: "Email не найден, попробуйте другой",
                fieldTrigger: "email",
              };
              break;
            case "INVALID_PASSWORD":
              error.value = {
                message: "Неверный пароль",
                fieldTrigger: "password",
              };
              break;
            case "USER_DISABLED":
              error.value = {
                message: "Пользователь заблокирован",
                fieldTrigger: "email",
              };
              break;
            case "USER_NOT_FOUND":
              error.value = {
                message: "Пользователь не найден",
                fieldTrigger: "email",
              };
              break;
            case "WEAK_PASSWORD":
              error.value = {
                message: "Слабый пароль",
                fieldTrigger: "password",
              };
              break;
            default:
              error.value = {
                message: "Что-то пошло не так",
                fieldTrigger: "password",
              };
          }
        }
      }
      return false;
    }
  };

  const logout = () => {
    userInfo.value = {
      token: "",
      email: "",
      userId: "",
      refreshToken: "",
      expiresIn: "",
    };
  };

  return { signUp, login, userInfo, error, logout };
});
