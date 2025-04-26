
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
import { useState } from "react"

const formSchema = z.object({
  supplierName: z.string().min(1, "Nome do fornecedor é obrigatório"),
  contactName: z.string().min(1, "Nome do contato é obrigatório"),
  cnpj: z.string().min(14, "CNPJ é obrigatório e deve ter pelo menos 14 dígitos"),
})

export function SuppliersRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierName: "",
      contactName: "",
      cnpj: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id
      
      // Fixed to match the database schema - use 'name' instead of 'supplier_name'
      const { error } = await supabase.from('suppliers').insert({
        name: values.supplierName,
        responsible: values.contactName,
        cnpj: values.cnpj,
        created_by: userId,
      });
      
      if (error) throw error;

      toast.success("Fornecedor cadastrado com sucesso!")
      form.reset()
    } catch (error: any) {
      toast.error("Erro ao cadastrar fornecedor: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Cadastro de Fornecedores</h2>
      <p className="text-muted-foreground">
        Cadastre e gerencie informações sobre fornecedores.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <FormField
            control={form.control}
            name="supplierName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Fornecedor</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Contato</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="00.000.000/0000-00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="bg-blue-700 hover:bg-blue-800">
            {isSubmitting ? "Cadastrando..." : "Cadastrar Fornecedor"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
