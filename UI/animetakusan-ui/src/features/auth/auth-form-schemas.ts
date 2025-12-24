import z from "zod";

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string(),
});

// Checks for:
// Password and Confirm Password match
// Password does not contain the username
// Password is not found in the Have I Been Pwned database
export const signUpFormSchema = z.object({
  email: z.email(),
  username: z.string().regex(
    /^[a-zA-Z0-9]{3,20}$/,
    "Username must be 3-20 characters long and can only contain letters and numbers."
  ),
  password: z.string().regex(
    /^.{12,}$/,
    "Password must be at least 12 characters long."
  ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => !data.password.toLowerCase().includes(data.username.toLowerCase()), {
  message: "Password cannot contain the username",
  path: ["password"],
});