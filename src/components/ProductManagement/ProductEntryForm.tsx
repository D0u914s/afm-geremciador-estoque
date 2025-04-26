
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

const formSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  partNumber: z.string().min(1, "Número da peça é obrigatório"),
  supplier: z.string().min(1, "Fornecedor é obrigatório"),
  quantity: z.number().min(1, "Quantidade deve ser maior que zero"),
  inspector: z.string().min(1, "Nome do conferente é obrigatório"),
  invoiceNumber: z.string().min(1, "Número da nota é obrigatório")
})

export function ProductEntryForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      partNumber: "",
      supplier: "",
      quantity: 0,
      inspector: "",
      invoiceNumber: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from('product_entries')
        .insert({
          date: values.date,
          part_number: values.partNumber,
          supplier: values.supplier,
          quantity: values.quantity,
          inspector: values.inspector,
          nota_fiscal: values.invoiceNumber,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })

      if (error) throw error

      toast.success("Entrada de produto registrada com sucesso!")
      form.reset()
    } catch (error: any) {
      toast.error("Erro ao registrar entrada: " + error.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold">Entrada de Produtos</h2>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="partNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° da Peça</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fornecedor</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Peças</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inspector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Conferente</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da Nota</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Registrar Entrada</Button>
      </form>
    </Form>
  )
}
