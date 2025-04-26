
import * as z from "zod"

export const partsFormSchema = z.object({
  partNumber: z.string().min(1, "Número da peça é obrigatório"),
  partName: z.string().min(1, "Nome da peça é obrigatório"),
  isOriginal: z.boolean().default(true),
  location: z.string().optional(),
})

export type PartsFormValues = z.infer<typeof partsFormSchema>
