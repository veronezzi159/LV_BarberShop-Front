import * as React from "react";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Appointment, WeeklyCalendarProps } from "@/types/interfaces";

const generateTimeSlots = (
  start: number,
  end: number,
  intervalMinutes: number = 30
) => {
  const slots = [];
  for (let hour = start; hour <= end; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === end && minute > 0) break;
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export function WeeklyCalendar({
  date = new Date(),
  onDateChange,
  appointments = [],
  onAddAppointment,
  onUpdateAppointment,
  startHour = 7,
  endHour = 19,
  timeInterval = 30,
  locale = ptBR,
  barbers = ["Vinicius", "Veronezzi"],
  services = ["Corte Simples", "Corte + Barba", "Barba"],
  role = "manager",
  currentBarberId,
}: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(date);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<{
    date: Date;
    time: string;
  } | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    React.useState<Appointment | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
  const [appointmentToCancel, setAppointmentToCancel] =
    React.useState<Appointment | null>(null);

  const [formData, setFormData] = React.useState({
    barber: "",
    clientPhone: "",
    service: [""],
    startTime: "",
    observations: "",
  });

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const SLOT_HEIGHT = 96; // h-24 do Tailwind é 96px

  const filteredAppointments = React.useMemo(() => {
    if (role === "barber" && currentBarberId && currentBarberId !== "Todos") {
      return appointments.filter((apt) => apt.barber.phone === currentBarberId);
    }
    return appointments;
  }, [appointments, role, currentBarberId]);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Verifica se a hora atual está dentro do horário de funcionamento
      if (currentHour >= startHour && currentHour <= endHour) {
        // Calcula quantos minutos se passaram desde o startHour
        const totalMinutesPassed =
          (currentHour - startHour) * 60 + currentMinute;

        // Calcula pixels: (Minutos passados / 60) * Altura de 1 hora
        // Como SLOT_HEIGHT é para 30 min ou a cada slot, ajustamos:
        // Se SLOT_HEIGHT (96px) é para cada slot (ex: 30min), a conta muda.
        // Assumindo que timeInterval define cada slot e h-24 é a altura DE CADA SLOT:
        const slotsPassed = totalMinutesPassed / timeInterval;
        const scrollPosition = slotsPassed * SLOT_HEIGHT;

        // Subtrai um valor (ex: 150px) para o horário atual não ficar colado no topo
        // dando uma visão melhor do contexto "antes e depois"
        scrollContainerRef.current.scrollTop = scrollPosition - 100;
      }
    }
    // Executa apenas uma vez na montagem ou se o horário base mudar
  }, [startHour, endHour, timeInterval]);

  React.useEffect(() => {
    if (onDateChange) {
      onDateChange(currentDate);
    }
  }, [currentDate, onDateChange]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = generateTimeSlots(startHour, endHour, timeInterval);

  const handlePrevWeek = () => setCurrentDate((prev) => addDays(prev, -7));
  const handleNextWeek = () => setCurrentDate((prev) => addDays(prev, 7));

  const handleSlotClick = (day: Date, time: string) => {
    setSelectedSlot({ date: day, time });
    setSelectedAppointment(null);

    // const [hours, minutes] = time.split(":").map(Number);
    // const endMinutes = minutes + timeInterval;
    // const endHours = hours + Math.floor(endMinutes / 60);
    // const finalMinutes = endMinutes % 60;

    setFormData({
      barber:
        role === "barber" && currentBarberId && currentBarberId !== "Todos"
          ? currentBarberId
          : barbers[0] || "",
      clientPhone: "",
      service: services || "",
      startTime: time,
      //   endTime: `${endHours.toString().padStart(2, "0")}:${finalMinutes
      //     .toString()
      //     .padStart(2, "0")}`,
      observations: "",
    });
    setIsDialogOpen(true);
  };

  const handleAppointmentClick = (
    e: React.MouseEvent,
    appointment: Appointment
  ) => {
    e.stopPropagation();
    setSelectedAppointment(appointment);
    setSelectedSlot(null);
    setFormData({
      barber: appointment.barber.name,
      clientPhone: appointment.client.phone,
      service: appointment.services, //problema de tipagem
      startTime: appointment.time,
      observations: appointment.observation || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // if (selectedAppointment) {
    //   if (onUpdateAppointment) {
    //     onUpdateAppointment({
    //       ...selectedAppointment,
    //       barber: formData.barber,
    //       clientPhone: formData.clientPhone,
    //       service: formData.service,
    //       startTime: formData.startTime,
    //       endTime: formData.endTime,
    //       observations: formData.observations,
    //     });
    //   }
    // } else if (selectedSlot) {
    //   if (onAddAppointment) {
    //     onAddAppointment({
    //       barber: formData.barber,
    //       clientPhone: formData.clientPhone,
    //       service: formData.service,
    //       date: selectedSlot.date,
    //       startTime: formData.startTime,
    //       endTime: formData.endTime,
    //       status: "accepted",
    //       observations: formData.observations,
    //     });
    //   }
    // }
    setIsDialogOpen(false);
  };

  const handleCancelAppointment = () => {
    if (appointmentToCancel && onUpdateAppointment) {
      onUpdateAppointment({
        ...appointmentToCancel,
        status: "canceled_barber",
      });
      setIsCancelDialogOpen(false);
      setIsDialogOpen(false);
      setAppointmentToCancel(null);
    }
  };

  const handleQuickReject = (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation();
    setAppointmentToCancel(appointment);
    setIsCancelDialogOpen(true);
  };

  const handleInitiateCancel = () => {
    if (selectedAppointment) {
      setAppointmentToCancel(selectedAppointment);
      setIsCancelDialogOpen(true);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAppointmentsForSlot = (day: Date, time: string) => {
    return filteredAppointments.filter((apt) => {
      return isSameDay(apt.date, day) && apt.time === time;
    });
  };

  const slotsStatus = React.useMemo(() => {
    const status: Record<string, boolean> = {};

    timeSlots.forEach((time) => {
      const hasAppointment = weekDays.some(
        (day) => getAppointmentsForSlot(day, time).length > 0
      );
      status[time] = hasAppointment;
    });

    return status;
  }, [weekDays, timeSlots, getAppointmentsForSlot]);

  return (
    <>
      <div className="flex flex-col text-foreground rounded-xl border border-zinc-800 shadow-2xl overflow-hidden h-[800px] max-h-screen bg-zinc-950">
        <div className="flex items-center justify-between p-4 pb-6 border-b border-zinc-800 z-20 relative bg-zinc-950 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold capitalize text-zinc-100">
              {format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <div className="flex items-center gap-1 text-zinc-200">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevWeek}
                className="h-8 w-8 hover:bg-zinc-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(new Date())}
                className="h-8 px-2 text-xs hover:bg-zinc-800"
              >
                Hoje
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextWeek}
                className="h-8 w-8 hover:bg-zinc-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex w-full border-b border-zinc-800 bg-zinc-950 z-30 shrink-0 pr-2">
          <div className="w-16 shrink-0 border-r border-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-medium">
            Horário
          </div>

          {/* Grid de Dias */}
          <div className="flex-1 grid grid-cols-7 min-w-[800px]">
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={i}
                  className={cn(
                    "h-14 border-r border-zinc-800 last:border-r-0 flex flex-col items-center justify-center py-2 transition-colors",
                    isToday ? "bg-primary/10" : "bg-zinc-950"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-medium uppercase tracking-wider",
                      isToday ? "text-primary" : "text-zinc-500"
                    )}
                  >
                    {format(day, "EEE", { locale: ptBR })}
                  </span>
                  <div
                    className={cn(
                      "h-7 w-7 flex items-center justify-center rounded-full text-sm font-bold mt-0.5",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "text-zinc-400"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex flex-1 overflow-y-auto scroll-smooth dark-scrollbar relative"
        >
          <div className="flex min-w-full h-max">
            <div className="w-16 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-950 sticky left-0 z-10">
              {timeSlots.map((time) => {
                const isBusy = slotsStatus[time];
                const rowHeight = isBusy ? "h-20" : "h-14";
                return (
                  <div
                    key={time}
                    className={cn(
                      rowHeight,
                      "border-b border-zinc-800/50 flex items-start justify-center pt-2 text-xs text-zinc-500 bg-zinc-950 box-border transition-all"
                    )}
                  >
                    {time}
                  </div>
                );
              })}
            </div>

            <div className="flex-1 grid grid-cols-7 min-w-[800px]">
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className="flex flex-col border-r border-zinc-800 last:border-r-0"
                >
                  {timeSlots.map((time) => {
                    const slotAppointments = getAppointmentsForSlot(day, time);
                    const isBusy = slotsStatus[time];
                    const rowHeight = isBusy ? "h-20" : "h-14";
                    return (
                      <div
                        key={`${day.toISOString()}-${time}`}
                        className={cn(
                          rowHeight,
                          "border-b border-zinc-800/50 relative group hover:bg-zinc-900/40 p-1 box-border cursor-pointer transition-all"
                        )}
                        onClick={() => handleSlotClick(day, time)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                          <Plus className="h-4 w-4 text-zinc-600" />
                        </div>

                        <div className="flex flex-col gap-1 h-full overflow-y-auto custom-scrollbar">
                          {slotAppointments.map((apt) => (
                            <div
                              key={apt._id}
                              onClick={(e) => handleAppointmentClick(e, apt)}
                              className={cn(
                                "p-1.5 rounded text-xs border cursor-pointer transition-all hover:brightness-110 shadow-sm relative group/card",
                                apt.status === "approved" &&
                                  "bg-emerald-900/50 border-emerald-800 text-emerald-100",
                                apt.status === "canceled_barber" &&
                                  "bg-red-900/50 border-red-800 text-red-100 opacity-60",
                                apt.status === "canceled_client" &&
                                  "bg-amber-900/50 border-amber-800 text-amber-100"
                              )}
                            >
                              <div className="font-semibold truncate text-[11px]">
                                {apt.services[0].name}
                              </div>
                              <div className="text-[10px] opacity-90 truncate">
                                {apt.client.name}
                              </div>
                              {role === "manager" && (
                                <div className="text-[9px] text-zinc-400 truncate">
                                  {apt.barber.name}
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-[9px] opacity-70 mt-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                {apt.time}
                              </div>

                              {apt.status === "approved" && (
                                <div className="absolute top-0.5 right-0.5 flex gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => handleQuickReject(e, apt)}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded p-0.5 transition-colors"
                                    title="Cancelar"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>
              {selectedAppointment
                ? "Detalhes do Agendamento"
                : "Novo Agendamento"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedAppointment
                ? "Visualize ou edite as informações do agendamento."
                : "Preencha os dados para criar um novo agendamento."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barber" className="text-right text-zinc-300">
                Barbeiro
              </Label>
              <Select
                value={formData.barber}
                onValueChange={(value) =>
                  setFormData({ ...formData, barber: value })
                }
                disabled={role === "barber" && currentBarberId !== "Todos"}
              >
                <SelectTrigger className="col-span-3 bg-zinc-900 border-zinc-800 text-zinc-100 disabled:opacity-50">
                  <SelectValue placeholder="Selecione o barbeiro" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  {barbers.map((barber) => (
                    <SelectItem key={barber} value={barber}>
                      {barber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientPhone" className="text-right text-zinc-300">
                Cliente
              </Label>
              <Input
                id="clientPhone"
                placeholder="(00) 00000-0000"
                value={formData.clientPhone}
                onChange={(e) =>
                  setFormData({ ...formData, clientPhone: e.target.value })
                }
                className="col-span-3 bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right text-zinc-300">
                Serviço
              </Label>
              <Select
                value={formData.service[0]}
                // onValueChange={(value) =>
                //   setFormData({ ...formData, service: value })
                // }
              >
                <SelectTrigger className="col-span-3 bg-zinc-900 border-zinc-800 text-zinc-100">
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right text-zinc-300">
                Horário
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-blue-600"
                />
                <span className="text-zinc-500">-</span>
                {/* <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-blue-600"
                /> */}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="observations"
                className="text-right text-zinc-300"
              >
                Observações
              </Label>
              <Textarea
                id="observations"
                placeholder="Adicione observações sobre o agendamento..."
                value={formData.observations}
                onChange={(e) =>
                  setFormData({ ...formData, observations: e.target.value })
                }
                className="col-span-3 bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-blue-600"
                rows={3}
              />
            </div>

            {selectedAppointment && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-zinc-300">Status</Label>
                <div className="col-span-3 flex gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      selectedAppointment.status === "approved" &&
                        "border-emerald-600 text-emerald-500",
                      selectedAppointment.status === "canceled_barber" &&
                        "border-red-600 text-red-500",
                      selectedAppointment.status === "canceled_client" &&
                        "border-amber-600 text-amber-500"
                    )}
                  >
                    {selectedAppointment.status === "canceled_client"
                      ? "Pendente"
                      : selectedAppointment.status === "approved"
                      ? "Aceito"
                      : "Cancelado"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {selectedAppointment ? (
              <>
                {selectedAppointment.status === "approved" && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleInitiateCancel}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancelar Agendamento
                  </Button>
                )}
                <Button
                  type="submit"
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                Criar Agendamento
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar Cancelamento
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Tem certeza que deseja cancelar este agendamento? Esta ação não
              pode ser desfeita.
              {appointmentToCancel && (
                <div className="mt-3 p-3 bg-zinc-900 rounded-md border border-zinc-800">
                  <p className="text-sm text-zinc-300">
                    <strong>Serviço:</strong>{" "}
                    {appointmentToCancel.services[0].name}
                  </p>
                  <p className="text-sm text-zinc-300">
                    <strong>Cliente:</strong> {appointmentToCancel.client.phone}
                  </p>
                  <p className="text-sm text-zinc-300">
                    <strong>Horário:</strong> {appointmentToCancel.time}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800">
              Não, manter agendamento
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelAppointment}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sim, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
