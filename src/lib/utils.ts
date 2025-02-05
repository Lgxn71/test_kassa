import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getTextToDisplay = (actionsButtonText: string): string => {
  switch (actionsButtonText) {
    case "Расскажи о своих возможностях":
      return "Я – ваш кассовый аппарат reKassa, который помогает вам управлять продажами и оформлять фискальные чеки. Я могу предоставить вам информацию о товарах на складе, помочь с оформлением транзакций и созданием отчетов по продажам. Пожалуйста, напишите, что вы планируете продать, и я с радостью вам помогу!";
    case "Оформи чек":
      return "Мы поможем вам оформить чек.";
    case "Подсчитай остатки":
      return "Мы поможем вам подсчитать остатки.";
    case "Создай отчет на тему":
      return "Мы поможем вам создать отчет на тему.";
    case "Еще...":
      return "Мы поможем вам с чем угодно.";
    default:
      return "";
  }
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

/**
 * Draws a rounded rectangle path
 */
export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}
