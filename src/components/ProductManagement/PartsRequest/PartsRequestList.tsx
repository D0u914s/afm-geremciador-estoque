
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { PartsRequest } from '@/types/product'

type PartsRequestListProps = {
  partsRequests: PartsRequest[]
  onUpdateStatus: (id: string, status: 'pending' | 'completed') => void
}

export function PartsRequestList({ partsRequests, onUpdateStatus }: PartsRequestListProps) {
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])

  const handleToggleRequestStatus = (requestId: string) => {
    const updatedStatus = selectedRequests.includes(requestId) ? 'pending' : 'completed'
    onUpdateStatus(requestId, updatedStatus)
    
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    )
  }

  const pendingRequests = partsRequests
    .filter(req => req.status === 'pending')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Requisições de Peças</h3>
      <div className="space-y-2">
        {pendingRequests.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Nenhuma requisição pendente
          </div>
        ) : (
          pendingRequests.map(request => (
            <div 
              key={request.id} 
              className="flex items-center space-x-4 p-3 border-b"
            >
              <Checkbox 
                checked={selectedRequests.includes(request.id)}
                onCheckedChange={() => handleToggleRequestStatus(request.id)}
              />
              <div className="flex-1">
                <p>
                  <strong>N° da Peça:</strong> {request.part_number} | 
                  <strong> Quantidade:</strong> {request.quantity}
                </p>
                <p>
                  <strong>Locação:</strong> {request.location} | 
                  <strong> Solicitante:</strong> {request.requester}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
