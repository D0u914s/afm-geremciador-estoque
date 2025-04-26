
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

export function StatCards() {
  const { data: entriesCount, isLoading: isLoadingEntries } = useQuery({
    queryKey: ['entriesCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('product_entries')
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 0
    }
  })

  const { data: exitsCount, isLoading: isLoadingExits } = useQuery({
    queryKey: ['exitsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('product_exits')
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 0
    }
  })

  const { data: currentStock, isLoading: isLoadingStock } = useQuery({
    queryKey: ['currentStock'],
    queryFn: async () => {
      const { data: entries, error: entriesError } = await supabase
        .from('product_entries')
        .select('quantity')
      
      const { data: exits, error: exitsError } = await supabase
        .from('product_exits')
        .select('quantity')
      
      if (entriesError || exitsError) throw entriesError || exitsError
      
      const totalEntries = entries?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || 0
      const totalExits = exits?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || 0
      
      return totalEntries - totalExits
    }
  })

  const isLoading = isLoadingEntries || isLoadingExits || isLoadingStock

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Total de Entradas</h3>
        <p className="text-3xl font-bold text-blue-600">{entriesCount}</p>
        <p className="text-sm text-muted-foreground">Total registrado</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Total de Saídas</h3>
        <p className="text-3xl font-bold text-red-600">{exitsCount}</p>
        <p className="text-sm text-muted-foreground">Total registrado</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Estoque Atual</h3>
        <p className="text-3xl font-bold text-green-600">{currentStock}</p>
        <p className="text-sm text-muted-foreground">Peças em estoque</p>
      </div>
    </div>
  )
}
