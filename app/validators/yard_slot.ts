import vine from "@vinejs/vine";

export const createYardSlotValidator = vine.create({
  bay: vine
    .string()
    .trim()
    .transform((str) => str.toUpperCase()),
  row: vine.number().min(1),
  toRow: vine.number().min(1).optional(),
  maxStackHeight: vine.number().min(0),
  type: vine
    .string()
    .trim()
    .transform((str) => str.toLowerCase()),
});

export const viewAllYardSlotsValidator = vine.create({
  page: vine.number().min(1).optional()
});
