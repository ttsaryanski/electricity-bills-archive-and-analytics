import { z } from "zod";

export const createBillSchema = z.object({
    month: z.number().min(1).max(12, "Month must be between 1 and 12"),
    year: z.number().min(1900).max(2100, "Year must be between 1900 and 2100"),
    period: z.date(),
    day_consumption_kwh: z
        .number()
        .min(0, "Day consumption must be a positive number")
        .max(1000000, "Day consumption must be less than or equal to 1000000"),
    night_consumption_kwh: z
        .number()
        .min(0, "Night consumption must be a positive number")
        .max(
            1000000,
            "Night consumption must be less than or equal to 1000000",
        ),
    total: z
        .number()
        .min(0, "Bill must be a positive number")
        .max(1000000, "Bill must be less than or equal to 1000000"),
    addressId: z.cuid2("Invalid address ID"),
});
export type CreateBillInput = z.infer<typeof createBillSchema>;

export const yearQuerySchema = z.object({
    year: z
        .number()
        .min(1900, "Year must be between 1900 and 2100")
        .max(2100, "Year must be between 1900 and 2100"),
});
export type YearQueryInput = z.infer<typeof yearQuerySchema>;

export const editBillSchema = z.object({
    total: z
        .number()
        .min(0, "Bill must be a positive number")
        .max(1000000, "Bill must be less than or equal to 1000000"),
    day_consumption_kwh: z
        .number()
        .min(0, "Day consumption must be a positive number")
        .max(1000000, "Day consumption must be less than or equal to 1000000"),
    night_consumption_kwh: z
        .number()
        .min(0, "Night consumption must be a positive number")
        .max(
            1000000,
            "Night consumption must be less than or equal to 1000000",
        ),
});
export type EditBillInput = z.infer<typeof editBillSchema>;
