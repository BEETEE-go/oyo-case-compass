
import { z } from "zod";

export const formSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  defaultView: z.string(),
  accessPath: z.string().min(5, "Please enter a valid file path"),
  syncInterval: z.string(),
  syncMethod: z.enum(["odbc", "oledb", "csv"]),
  syncDirection: z.enum(["import", "export", "both"])
});

export type FormValues = z.infer<typeof formSchema>;
