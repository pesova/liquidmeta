import { z } from "zod";

export const onboardSchema = z
  .object({
    // User fields (optional — only needed if no account exists)
    name: z.string().min(1, "Name is required").optional(),
    email: z.email("Please provide a valid email address").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z.string().optional(),

    // Vendor fields
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    businessName: z.string().min(1, "Business name is required"),
    nin: z.string().length(11, "NIN must be exactly 11 characters"),
    phoneNumber: z.string().min(1, "Phone number is required"),
  })
  .refine(
    (data) => {
      // If any user field is provided, all must be provided
      const hasUserFields = data.name || data.email || data.password;
      if (hasUserFields) {
        return data.name && data.email && data.password && data.confirmPassword;
      }
      return true;
    },
    {
      message:
        "Name, email, password and confirmPassword are required when creating a new account",
      path: ["email"],
    },
  )
  .refine(
    (data) => {
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const updateVendorSchema = z.object({
  businessName: z.string().optional(),
  phoneNumber: z.string().optional(),
});
