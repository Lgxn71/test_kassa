import { z } from "zod";

export const emailSchema = z
  .string({
    required_error: "е-mail обязателен",
    invalid_type_error: "email должен быть строкой",
  })
  .min(1, { message: "e-mail обязателен" })
  .email("введеный e-mail некорректен")
  .trim();

export const passwordSchema = z
  .string({
    required_error: "Пароль обязателен",
    invalid_type_error: "Пароль должен быть строкой",
  })
  .min(8, {
    message: "Пароль должен содержать как минимум 5 буквы",
  })
  .trim();

export const nameSchema = z
  .string({
    required_error: "Имя обязательно",
    invalid_type_error: "Имя должно быть строкой",
  })
  .min(2, { message: "Имя должно содержать как минимум 2 буквы" })
  .trim();
