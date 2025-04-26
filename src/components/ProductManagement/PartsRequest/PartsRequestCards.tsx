
import { PartsRequest } from '@/types/product'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, FileText, ClockIcon, Loader2 } from 'lucide-react'

type PartsRequestCardsProps = {
  partsRequests: PartsRequest[]
  isLoading: boolean
  pendingCount?: number
}

export function PartsRequestCards({ partsRequests, isLoading, pendingCount = 0 }: PartsRequestCardsProps) {
  // Get the 5 most recent requests
  const recentRequests = partsRequests?.slice(0, 5) || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Carregando...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (partsRequests.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Nenhuma requisição de peça encontrada. Crie uma requisição usando o formulário acima.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Requisições Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <li key={request.id} className="text-sm border-b pb-1 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{request.part_number}</span>
                    <span className="text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>{request.quantity} unidades</span>
                    <span className={`${
                      request.status === 'completed' ? 'text-green-500' : 'text-amber-500'
                    }`}>
                      {request.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">Nenhuma requisição encontrada</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {pendingCount > 0 ? (
              <ClockIcon className="h-5 w-5 mr-2 text-amber-500" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            )}
            Status das Requisições
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-24">
            {pendingCount > 0 ? (
              <>
                <p className="text-3xl font-bold text-amber-500">{pendingCount}</p>
                <p className="text-muted-foreground">
                  {pendingCount === 1
                    ? "Requisição pendente"
                    : "Requisições pendentes"}
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-green-500">0</p>
                <p className="text-muted-foreground">Nenhuma requisição pendente</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
