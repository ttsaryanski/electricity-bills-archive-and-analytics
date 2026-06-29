import { z } from "zod";

export const createAddressSchema = z.object({
    address: z
        .string()
        .min(3, "Address must be at least 3 characters")
        .max(50, "Address must be at most 50 characters"),
});
