import { WeeklyCalendar } from "@/components/agenda/weekly-calendar";
import { startOfToday } from "date-fns";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Appointment } from "@/types/interfaces";

export function MyAgenda() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      _id: "1",
      barber: {
        name: "Vinicius",
        phone: "16997008655",
      },
      client: {
        name: "Jose",
        phone: "16997008653",
      },
      services: [
        {
          id: "2213",
          name: "Corte + Barba",
          price: 450,
        },
      ],
      date: startOfToday().toISOString(),
      time: "09:00",
      status: "approved",
      observation: "Cliente prefere tesoura",
    },
    {
      _id: "2",
      barber: {
        name: "Vinicius",
        phone: "16997008655",
      },
      client: {
        name: "Eduardo",
        phone: "16997008654",
      },
      services: [
        {
          id: "2213",
          name: "Corte + Barba",
          price: 450,
        },
      ],
      date: startOfToday().toISOString(),
      time: "10:00",
      status: "approved",
      observation: "Cliente prefere tesoura",
    },
  ]);

  const [role] = useState<"manager" | "barber">("manager");
  const [currentBarber, setCurrentBarber] = useState("16997008653");
  const barbers = ["João", "Carlos", "Pedro", "Rafael", "Marcos"];

  const handleAddAppointment = (newAppointment: Omit<Appointment, "id">) => {
    const appointment: Appointment = {
      ...newAppointment,
      _id: Math.random().toString(36).substr(2, 9),
    };
    setAppointments([...appointments, appointment]);
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(
      appointments.map((apt) =>
        apt._id === updatedAppointment._id ? updatedAppointment : apt
      )
    );
  };

  return (
    <div className="px-8 flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Sua agenda</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* <div className="flex items-center gap-2">
          <Label htmlFor="role-switch" className="text-zinc-300">
            Modo Gerente
          </Label>
          <Switch
              id="role-switch"
              checked={role === "barber"}
              onCheckedChange={(checked) =>
                setRole(checked ? "barber" : "manager")
              }
            />
          <Label htmlFor="role-switch" className="text-zinc-300">
            Modo Barbeiro
          </Label>
        </div> */}

        {role === "barber" && (
          <div className="flex items-center gap-2">
            <Label className="text-zinc-300">Barbeiro Atual:</Label>
            <Select value={currentBarber} onValueChange={setCurrentBarber}>
              <SelectTrigger className="w-[180px] bg-zinc-950 border-zinc-800 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                <SelectItem value="Todos">Todos os Barbeiros</SelectItem>
                {barbers.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex-1 h-[800px]">
        <WeeklyCalendar
          appointments={appointments}
          onAddAppointment={handleAddAppointment}
          onUpdateAppointment={handleUpdateAppointment}
          barbers={barbers}
          services={[
            "Corte Simples",
            "Corte + Barba",
            "Barba",
            "Pezinho",
            "Degradê",
            "Pigmentação",
          ]}
          role={role}
          currentBarberId={currentBarber}
        />
      </div>
    </div>
  );
}
