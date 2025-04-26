
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useLastRecord(activeSection: 'entry' | 'exit') {
  const { data: lastRecord, refetch: refetchLastRecord } = useQuery({
    queryKey: ['lastRecord', activeSection],
    queryFn: async () => {
      if (activeSection !== 'entry' && activeSection !== 'exit') return null;
      
      const table = activeSection === 'entry' ? 'product_entries' : 'product_exits'
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching last record:', error)
        return null
      }

      return data
    },
  })

  return { lastRecord, refetchLastRecord }
}
