import { z } from "zod";

const phoneRegex = /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;

export const loginSchema = z.object({
  phone: z.string().regex(phoneRegex, "Telefone Inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
