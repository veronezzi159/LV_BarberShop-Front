import z from "zod";

const phoneRegex = /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;

export const registerSchema = z.object({
  name: z.string().min(2, "O nome deve conter no mínimo 2 caracteres"),
  phone: z.string().regex(phoneRegex, "Telefone Inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
