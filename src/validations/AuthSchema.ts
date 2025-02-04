import { z } from "zod";
import { emailSchema, passwordSchema } from "./utils";

const AuthSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export default AuthSchema;
