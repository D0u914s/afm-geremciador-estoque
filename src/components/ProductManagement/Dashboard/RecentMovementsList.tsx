
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function RecentMovementsList() {
  const { data: recentEntries } = useQuery({
    queryKey: ['recentEntries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (error) throw error
      return data || []
    }
  })

  const { data: recentExits } = useQuery({
    queryKey: ['recentExits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_exits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (error) throw error
      return data || []
    }
  })

  return (
    <>
      {/* Recent Entries */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Últimas Entradas (3)</h3>
        <div className="space-y-3">
          {recentEntries?.length ? (
            recentEntries.map((entry) => (
              <div key={entry.id} className="p-3 border-b">
                <div className="flex justify-between">
                  <span className="font-medium">
                    Peça: {entry.part_number}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(entry.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Quantidade:</span> {entry.quantity} | 
                  <span className="font-medium"> Fornecedor:</span> {entry.supplier} |
                  <span className="font-medium"> Nota Fiscal:</span> {entry.nota_fiscal}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Inspetor:</span> {entry.inspector}
                </p>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-muted-foreground">
              Nenhuma entrada recente encontrada
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Exits */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Últimas Saídas (3)</h3>
        <div className="space-y-3">
          {recentExits?.length ? (
            recentExits.map((exit) => (
              <div key={exit.id} className="p-3 border-b">
                <div className="flex justify-between">
                  <span className="font-medium">
                    Peça: {exit.part_number}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(exit.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Quantidade:</span> {exit.quantity} | 
                  <span className="font-medium"> Motivo:</span> {exit.reason}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Responsável:</span> {exit.responsible}
                  {exit.order_number && (
                    <> | <span className="font-medium">Pedido:</span> {exit.order_number}</>
                  )}
                </p>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-muted-foreground">
              Nenhuma saída recente encontrada
            </div>
          )}
        </div>
      </div>
    </>
  )
}
