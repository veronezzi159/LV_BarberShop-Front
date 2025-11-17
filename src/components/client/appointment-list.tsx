import { Calendar, Clock, User, X, CheckCircle2, Clock3 } from "lucide-react";

const appointments = [
  {
    id: 1,
    date: "25/11/2025",
    time: "14:00",
    barber: "Carlos Silva",
    service: "Corte + Barba",
    status: "confirmado",
  },
  {
    id: 2,
    date: "28/11/2025",
    time: "10:30",
    barber: "João Santos",
    service: "Corte Simples",
    status: "pendente",
  },
];

export default function AppointmentsList() {
  return (
    <div className="space-y-3">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-card border-2 border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {appointment.status === "confirmado" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Clock3 className="w-4 h-4 text-primary" />
                )}
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    appointment.status === "confirmado"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {appointment.status === "confirmado"
                    ? "Confirmado"
                    : "Pendente"}
                </span>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive duration-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground font-medium">
                  {appointment.date}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground font-medium">
                  {appointment.time}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground font-medium">
                  {appointment.barber}
                </span>
              </div>
              <div className="text-sm font-semibold text-primary pt-2 border-t border-border/50">
                {appointment.service}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-card border-2 border-dashed border-border rounded-xl p-6 text-center">
          <p className="text-muted-foreground text-sm">
            Nenhum agendamento. Comece agora mesmo!
          </p>
        </div>
      )}
    </div>
  );
}
