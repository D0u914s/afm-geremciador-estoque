
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function RecentTrackingList() {
  const { data: recentTracking } = useQuery({
    queryKey: ['recentTracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracking')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data || []
    }
  })

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Últimos Rastreamentos (5)</h3>
      <div className="space-y-3">
        {recentTracking?.length ? (
          recentTracking.map((record) => (
            <div key={record.id} className="p-3 border-b">
              <div className="flex justify-between">
                <span className="font-medium">
                  Pedido: {record.order_number} - Cliente: {record.customer}
                </span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(record.date), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
              <p className="text-sm">
                <span className="font-medium">Nota Fiscal:</span> {record.nota_fiscal} | 
                <span className="font-medium"> Transporte:</span> {record.transport} |
                <span className="font-medium"> Valor:</span> R$ {Number(record.order_value).toFixed(2)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Código de Rastreio:</span> {record.tracking_code}
                {record.tracking_link && (
                  <> | <a 
                    href={record.tracking_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    Link de Rastreio
                  </a></>
                )}
              </p>
            </div>
          ))
        ) : (
          <div className="p-3 text-center text-muted-foreground">
            Nenhum rastreamento recente encontrado
          </div>
        )}
      </div>
    </div>
  )
}
