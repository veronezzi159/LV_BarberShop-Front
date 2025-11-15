import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  registerSchema,
  type RegisterSchema,
} from "@/schemas/auth/register-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maskPhone } from "@/lib/masks/phone-mask";

export function RegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(data: RegisterSchema) {
    console.log("Register =>", data);

    const justDigits = data.phone.replace(/\D/g, "");
    console.log("Register (Digits only) =>", { ...data, phone: justDigits });
  }

  const { onChange: rhfOnChange, ...restOfRegister } = register("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhone(e.target.value);
    e.target.value = maskedValue;
    rhfOnChange(e);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-6"}>
      <FieldGroup>
        <div className="flex justify-center lg:hidden">
          <img
            src="logo-barb.png"
            alt="Company Logo"
            className="h-auto w-33 mb-4"
          />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Junte-se à nossa barbearia e agende seus horários com facilidade.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input
            id="name"
            {...register("name")}
            placeholder="Digite seu nome"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Telefone</FieldLabel>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none border-r pr-1">
              +55
            </span>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              {...restOfRegister}
              onChange={handlePhoneChange}
              className="pl-11"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Digite sua senha"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </Field>
        <Field>
          <Button type="submit">Registro</Button>
        </Field>
        <FieldSeparator>ou continue com</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Já tem uma conta?{" "}
            <a
              className="underline underline-offset-4 text-primary cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
