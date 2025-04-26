
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { PartsRequest } from '@/types/product'
import { PartsRequestForm } from './PartsRequest/PartsRequestForm'
import { PartsRequestCards } from './PartsRequest/PartsRequestCards'
import { PartsRequestList } from './PartsRequest/PartsRequestList'
import { PrinterSettings } from './PartsRequest/PrinterSettings'
import { toast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PartsRequestSection() {
  const queryClient = useQueryClient()
  const [locationFilter, setLocationFilter] = useState<PartsRequest['location'] | 'all'>('all')

  const { data: partsRequests, isLoading } = useQuery({
    queryKey: ['partsRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parts_requests')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as PartsRequest[] || []
    }
  })

  const createPartRequestMutation = useMutation({
    mutationFn: async (newRequest: Omit<PartsRequest, 'id' | 'created_at' | 'status' | 'completed_at'>) => {
      const { data, error } = await supabase
        .from('parts_requests')
        .insert({
          ...newRequest,
          status: 'pending'
        })
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partsRequests'] })
      toast({
        title: 'Requisição de Peças',
        description: 'Requisição criada com sucesso!'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: `Falha ao criar requisição: ${error.message}`,
        variant: 'destructive'
      })
    }
  })

  const updatePartRequestMutation = useMutation({
    mutationFn: async (updatedRequest: { id: string, status: 'pending' | 'completed' }) => {
      const { data, error } = await supabase
        .from('parts_requests')
        .update({ 
          status: updatedRequest.status,
          completed_at: updatedRequest.status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', updatedRequest.id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partsRequests'] })
      toast({
        title: 'Requisição de Peças',
        description: 'Status da requisição atualizado com sucesso!'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: `Falha ao atualizar requisição: ${error.message}`,
        variant: 'destructive'
      })
    }
  })

  // Filter parts requests by location
  const filteredPartsRequests = locationFilter === 'all'
    ? partsRequests
    : partsRequests?.filter(request => request.location === locationFilter)

  // Get the count of pending requests
  const pendingRequestsCount = partsRequests?.filter(r => r.status === 'pending').length || 0

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Requisição de Peças</h2>
        <PrinterSettings />
      </div>
      
      <PartsRequestForm 
        onSubmit={(request) => createPartRequestMutation.mutate(request)}
      />
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filtrar por setor:</h3>
        <Tabs 
          defaultValue="all" 
          value={locationFilter}
          onValueChange={(value) => setLocationFilter(value as PartsRequest['location'] | 'all')}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="terreo">Térreo</TabsTrigger>
            <TabsTrigger value="1° andar">1° andar</TabsTrigger>
            <TabsTrigger value="2° andar">2° andar</TabsTrigger>
            <TabsTrigger value="3° andar">3° andar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <PartsRequestCards 
        partsRequests={filteredPartsRequests || []}
        isLoading={isLoading}
        pendingCount={pendingRequestsCount}
      />
      
      <PartsRequestList
        partsRequests={filteredPartsRequests || []} 
        onUpdateStatus={(id, status) => updatePartRequestMutation.mutate({ id, status })}
      />
    </div>
  )
}
