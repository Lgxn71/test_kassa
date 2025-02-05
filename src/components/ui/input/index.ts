import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  "flex w-full rounded-md border border-input px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed focus-visible:outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
        error:
          "border-[#e5345b] text-[#e5345b] focus-visible:ring-[#e5345b] ring-offset-[#e5345b]",
        chat: "bg-[#F5F5F5] border-[0px] text-[14.5px] phone-400:text-[16.5px] lg:text-[19px]   placeholder:text-[#00000052]",
      },
      size: {
        default: "h-10 px-3 py-2",
        chat: "h-5 px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type InputVariants = VariantProps<typeof inputVariants>;
export { default as Input } from "./Input.vue";
