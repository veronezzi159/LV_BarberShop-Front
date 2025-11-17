"use client";

import { useState } from "react";
import {
  Calendar,
  User,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";

const barbers = [
  { id: 1, name: "Carlos Silva" },
  { id: 2, name: "João Santos" },
  { id: 3, name: "Pedro Oliveira" },
];

const services = [
  {
    id: 1,
    name: "Corte Simples",
    duration: "30 min",
    price: "R$ 40",
    icon: "✂️",
  },
  {
    id: 2,
    name: "Corte + Barba",
    duration: "45 min",
    price: "R$ 65",
    icon: "💈",
  },
  {
    id: 3,
    name: "Barba Completa",
    duration: "30 min",
    price: "R$ 45",
    icon: "🧔",
  },
  {
    id: 4,
    name: "Hidratação + Corte",
    duration: "60 min",
    price: "R$ 85",
    icon: "✨",
  },
];

// Brazilian holidays and closed days
const holidays = {
  "2025-11-20": { name: "Consciência Negra", type: "holiday" },
  "2025-12-25": { name: "Natal", type: "holiday" },
  "2025-01-01": { name: "Ano Novo", type: "holiday" },
};

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    barber: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateInput, setDateInput] = useState("");
  const [isCustomDateSelected, setIsCustomDateSelected] = useState(false);

  const getAvailableDates = (days = 60) => {
    const dates = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const holiday = holidays[dateStr as keyof typeof holidays];
      const dayOfWeek = date.getDay();
      const isSunday = dayOfWeek === 0;

      dates.push({
        date: dateStr,
        dateObj: date,
        dayName: date
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", ""),
        dayNum: date.getDate(),
        holiday: holiday,
        isClosed: isSunday || !!holiday,
        closedReason: isSunday ? "Fechado" : holiday?.name || "",
      });
    }
    return dates;
  };

  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const allAvailable = getAvailableDates();
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const availableDate = allAvailable.find((d) => d.date === dateStr);
      const currentDayObj = new Date(year, month, day);
      currentDayObj.setHours(0, 0, 0, 0);

      days.push({
        day,
        dateStr,
        dateObj: new Date(year, month, day),
        holiday: availableDate?.holiday,
        isClosed: availableDate?.isClosed || false,
        isInPast: currentDayObj < today,
      });
    }

    return days;
  };

  const availableDates = getAvailableDates();
  const nextThreeDays = availableDates.slice(0, 3);
  const calendarDays = getCalendarDays(currentMonth);

  const handleServiceSelect = (serviceId: string) => {
    setFormData((prev) => ({ ...prev, service: serviceId }));
    setSubmitMessage("");
  };

  const handleDateSelect = (dateStr: string) => {
    const selectedDate = availableDates.find((d) => d.date === dateStr);
    if (selectedDate && !selectedDate.isClosed) {
      setFormData((prev) => ({ ...prev, date: dateStr }));
      setShowFullCalendar(false);
      setDateInput(new Date(dateStr).toLocaleDateString("pt-BR"));
      setIsCustomDateSelected(true);
      setSubmitMessage("");
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);

    if (value.length === 10) {
      const parts = value.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        const selectedDate = availableDates.find((d) => d.date === dateStr);
        if (selectedDate && !selectedDate.isClosed) {
          setFormData((prev) => ({ ...prev, date: dateStr }));
          setIsCustomDateSelected(true);
          setSubmitMessage("");
        }
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, time }));
    setSubmitMessage("");
  };

  const handleBarberSelect = (barberId: string) => {
    setFormData((prev) => ({ ...prev, barber: barberId }));
    setSubmitMessage("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitMessage("");
  };

  const handleDateSelect_NextThreeDays = (dateStr: string) => {
    const selectedDate = availableDates.find((d) => d.date === dateStr);
    if (selectedDate && !selectedDate.isClosed) {
      setFormData((prev) => ({ ...prev, date: dateStr }));
      setShowFullCalendar(false);
      setDateInput(new Date(dateStr).toLocaleDateString("pt-BR"));
      setIsCustomDateSelected(false);
      setSubmitMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.barber ||
      !formData.service ||
      !formData.date ||
      !formData.time
    ) {
      setSubmitMessage("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitMessage(
        "✓ Agendamento solicitado com sucesso! Você receberá uma confirmação em breve."
      );
      setFormData({ barber: "", service: "", date: "", time: "", notes: "" });
      setDateInput("");
      setIsCustomDateSelected(false);
      setIsSubmitting(false);
    }, 800);
  };

  const selectedDate = formData.date
    ? availableDates.find((d) => d.date === formData.date)
    : null;
  const isFormValid =
    formData.barber && formData.service && formData.date && formData.time;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Barber Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="w-4 h-4 text-primary" />
          Escolha seu barbeiro
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {barbers.map((barber) => (
            <button
              key={barber.id}
              type="button"
              onClick={() => handleBarberSelect(barber.id.toString())}
              className={`p-4 rounded-xl border-2 transition-all duration-300 font-medium text-sm ${
                formData.barber === barber.id.toString()
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              {barber.name}
            </button>
          ))}
        </div>
      </div>

      {/* Service Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-lg">✂️</span>
          Escolha o serviço
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => handleServiceSelect(service.id.toString())}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left group cursor-pointer ${
                formData.service === service.id.toString()
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{service.icon}</span>
                {formData.service === service.id.toString() && (
                  <CheckCircle2 className="w-5 h-5 text-primary animate-in" />
                )}
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {service.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {service.duration}
                </span>
                <span className="font-bold text-primary">{service.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date and Time Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          Escolha data e horário
        </label>

        {/* Quick Select - Next 3 Days */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">
            Próximos dias disponíveis
          </p>
          <div className="grid grid-cols-3 gap-2">
            {nextThreeDays.map((dayData) => (
              <button
                key={dayData.date}
                type="button"
                onClick={() => handleDateSelect_NextThreeDays(dayData.date)}
                disabled={dayData.isClosed}
                className={`p-3 rounded-xl border-2 transition-all duration-300 font-medium text-center ${
                  dayData.isClosed
                    ? "border-border bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60"
                    : formData.date === dayData.date && !isCustomDateSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                <div className="text-xs text-muted-foreground uppercase">
                  {dayData.dayName}
                </div>
                <div className="text-lg font-bold">{dayData.dayNum}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={dateInput}
              onChange={handleDateInputChange}
              placeholder="dd/mm/aaaa"
              className={`flex-1 p-3 rounded-xl border-2 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm ${
                isCustomDateSelected && formData.date
                  ? "border-primary"
                  : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowFullCalendar(!showFullCalendar)}
              className="p-3 rounded-xl border-2 border-border bg-card text-foreground hover:border-primary/50 transition-all"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>

          {showFullCalendar && (
            <div className="p-4 bg-card border-2 border-border rounded-xl space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1
                      )
                    )
                  }
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-foreground">
                  {currentMonth.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1
                      )
                    )
                  }
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map(
                  (day) => (
                    <div key={day}>{day}</div>
                  )
                )}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((dayInfo, idx) => (
                  <div key={idx} className="aspect-square">
                    {dayInfo ? (
                      <button
                        type="button"
                        onClick={() => handleDateSelect(dayInfo.dateStr)}
                        disabled={dayInfo.isClosed || dayInfo.isInPast}
                        className={`w-full h-full rounded-lg border-2 transition-all relative group ${
                          dayInfo.isInPast || dayInfo.isClosed
                            ? "border-border bg-muted/30 text-muted-foreground cursor-not-allowed opacity-50"
                            : formData.date === dayInfo.dateStr &&
                              isCustomDateSelected
                            ? "border-primary bg-primary/20 text-primary font-bold"
                            : "border-border bg-card/50 text-foreground hover:border-primary/50 hover:bg-card"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center h-full text-sm font-medium">
                          {dayInfo.day}
                          {dayInfo.holiday && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full" />
                          )}
                        </div>
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-muted-foreground">Feriado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded" />
                  <span className="text-muted-foreground">
                    Fechado / Indisponível
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedDate && selectedDate.holiday && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-400">
                Feriado: {selectedDate.holiday.name}
              </p>
              <p className="text-xs text-orange-300/80 mt-1">
                Este dia pode ter horários limitados
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Time Selection */}
      {formData.date && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">
            Horários disponíveis -{" "}
            {selectedDate?.dateObj.toLocaleDateString("pt-BR")}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeSelect(time)}
                className={`p-2 rounded-lg border-2 transition-all duration-300 font-medium text-sm ${
                  formData.time === time
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">
          Observações (Opcional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Alguma preferência ou informação adicional?"
          className="w-full bg-input border-2 border-border text-foreground placeholder:text-muted-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none h-20"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-bold py-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Processando...
          </>
        ) : isFormValid ? (
          <>
            CONFIRMAR AGENDAMENTO
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        ) : (
          "PREENCHA TODOS OS CAMPOS"
        )}
      </button>

      {/* Submit Message */}
      {submitMessage && (
        <div
          className={`p-4 rounded-lg text-sm font-medium transition-all ${
            submitMessage.includes("sucesso")
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {submitMessage}
        </div>
      )}
    </form>
  );
}
