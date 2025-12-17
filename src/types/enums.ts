export const AppointmentStatus = {
  APPROVED: "approved",
  CANCELED_BARBER: "canceled_barber",
  CANCELED_CLIENT: "canceled_client",
  NOT_PRESENT: "not_present",
  COMPLETED: "completed",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const ReschedulingStatus = {
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "pendent",
} as const;

export type ReschedulingStatus =
  (typeof ReschedulingStatus)[keyof typeof ReschedulingStatus];

export const UnitOfMeasure = {
  UNIT: "UN",
  ML: "ML",
  LITER: "L",
  KG: "KG",
  GRAM: "G",
} as const;

export type UnitOfMeasure = (typeof UnitOfMeasure)[keyof typeof UnitOfMeasure];

export const MovementType = {
  ENTRY: "entry",
  EXIT: "exit",
} as const;

export type MovementType = (typeof MovementType)[keyof typeof MovementType];

export const MovementExitType = {
  SALE: "sale",
  LOSS: "loss",
  USE_INTERNAL: "internal_use",
  EXPIRED: "expired",
} as const;

export type MovementExitType =
  (typeof MovementExitType)[keyof typeof MovementExitType];
