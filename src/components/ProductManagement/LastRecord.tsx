import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"

interface LastRecordProps {
  lastRecord: any
  activeSection: 'entry' | 'exit' | 'search' | 'qrcode' | 'ean' | 'ai' | 'parts' | 'suppliers' | 'dashboard'
  refetchLastRecord: () => void
}

export function LastRecord({ lastRecord, activeSection, refetchLastRecord }: LastRecordProps) {
  const isEntry = activeSection === 'entry'
  const title = isEntry ? 'Última Entrada' : 'Última Saída'

  if (!lastRecord) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refetchLastRecord}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Atualizar</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={refetchLastRecord}
          className="h-8 w-8"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Atualizar</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Data: {lastRecord.date}</p>
          <p className="text-xs text-muted-foreground">Peça: {lastRecord.part_number}</p>
          <p className="text-xs text-muted-foreground">Quantidade: {lastRecord.quantity}</p>
          
          {isEntry ? (
            <>
              <p className="text-xs text-muted-foreground">Fornecedor: {lastRecord.supplier}</p>
              <p className="text-xs text-muted-foreground">Nota Fiscal: {lastRecord.nota_fiscal}</p>
              <p className="text-xs text-muted-foreground">Conferente: {lastRecord.inspector}</p>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">Motivo: {lastRecord.reason}</p>
              <p className="text-xs text-muted-foreground">Responsável: {lastRecord.responsible}</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
