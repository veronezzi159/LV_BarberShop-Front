import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:flex flex-col items-center justify-center">
        <img
          src="undraw_barber_utly (1).svg"
          alt="Image"
          className="max-h-[50%] w-auto object-contain dark:brightness-[0.2] dark:grayscale"
        />

        {/* Título da barbearia */}
        <h1 className="mt-4 text-3xl font-bold text-primary">LV Barbearia</h1>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
