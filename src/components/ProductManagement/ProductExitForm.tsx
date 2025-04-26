
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const exitFormSchema = z.object({
  partNumber: z.string().min(1, "Número da peça é obrigatório"),
  quantity: z.number().min(1, "A quantidade deve ser maior que zero"),
  reason: z.string().min(1, "Motivo é obrigatório"),
  responsible: z.string().min(1, "Nome do responsável é obrigatório"),
});

type ExitFormValues = z.infer<typeof exitFormSchema>;

export function ProductExitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExitFormValues>({
    resolver: zodResolver(exitFormSchema),
    defaultValues: {
      partNumber: "",
      quantity: 1,
      reason: "",
      responsible: "",
    },
  });

  async function onSubmit(values: ExitFormValues) {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const userId = (await supabase.auth.getUser()).data.user?.id;

      const { error } = await supabase
        .from('product_exits')
        .insert({
          part_number: values.partNumber,
          quantity: values.quantity,
          reason: values.reason,
          responsible: values.responsible,
          created_by: userId,
          date: currentDate,
        });

      if (error) {
        throw new Error(`Erro ao registrar saída do produto: ${error.message}`);
      }

      toast.success("Saída de produto registrada com sucesso!");
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Registro de Saída de Produto</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="partNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da Peça</FormLabel>
                <FormControl>
                  <Input placeholder="Número da peça" {...field} />
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
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quantidade"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo</FormLabel>
                <FormControl>
                  <Input placeholder="Motivo da saída" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do responsável" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar Saída"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
