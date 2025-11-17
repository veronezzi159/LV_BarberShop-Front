import AppointmentsList from "@/components/client/appointment-list";
import BookingForm from "@/components/client/booking-form";
import { Scissors } from "lucide-react";

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Minha Barbearia
              </h1>
            </div>
            <button className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg font-medium transition-colors">
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Agendar Novo Horário
                </h2>
                <p className="text-muted-foreground text-sm">
                  Escolha o barbeiro, serviço e data desejada
                </p>
              </div>
              <BookingForm />
            </div>
          </div>

          {/* Appointments Section */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Seus Agendamentos
              </h2>
              <AppointmentsList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
