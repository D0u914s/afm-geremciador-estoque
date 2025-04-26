
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PrinterConfig, PartsRequest, PrintJob } from '@/types/product'
import { toast } from '@/hooks/use-toast'
import { Printer } from 'lucide-react'  // Changed from FilePrinter to Printer

type PartsRequestFormProps = {
  onSubmit: (request: Omit<PartsRequest, 'id' | 'created_at' | 'status' | 'completed_at'>) => void
}

const LOCATIONS = ['terreo', '1° andar', '2° andar', '3° andar'] as const

export function PartsRequestForm({ onSubmit }: PartsRequestFormProps) {
  const [partNumber, setPartNumber] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [location, setLocation] = useState<PartsRequest['location']>('terreo')
  const [requester, setRequester] = useState('')
  const [isPrinting, setIsPrinting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!partNumber || quantity <= 0 || !location || !requester) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    // Create the request object
    const requestData = {
      part_number: partNumber,
      quantity,
      location,
      requester
    }

    // Submit the request
    onSubmit(requestData)

    // Print the request
    try {
      setIsPrinting(true)
      await printRequest(requestData)
      setIsPrinting(false)
    } catch (error) {
      console.error('Error printing:', error)
      setIsPrinting(false)
    }

    // Reset form
    setPartNumber('')
    setQuantity(0)
    setLocation('terreo')
    setRequester('')
  }
  
  const printRequest = async (request: Omit<PartsRequest, 'id' | 'created_at' | 'status' | 'completed_at'>) => {
    // Get printers from local storage
    const printers = JSON.parse(localStorage.getItem('printerConfigs') || '[]') as PrinterConfig[]
    
    // Find printer for the location or get the default
    let printer = printers.find(p => p.location === request.location)
    if (!printer) {
      printer = printers.find(p => p.isDefault)
    }
    
    if (!printer) {
      toast({
        title: "Impressora não encontrada",
        description: `Não há impressora configurada para ${request.location}. Configure uma impressora para este local.`,
        variant: "destructive"
      })
      return
    }
    
    // Format the content for printing
    const currentDate = new Date()
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
    
    const content = `
    ---------------------------------
    REQUISIÇÃO DE PEÇAS
    ---------------------------------
    Data: ${formattedDate}
    Local: ${request.location}
    Solicitante: ${request.requester}
    
    N° da Peça: ${request.part_number}
    Quantidade: ${request.quantity}
    ---------------------------------
    Status: Pendente
    ---------------------------------
    `
    
    // Create the print job
    const printJob: PrintJob = {
      printer,
      content,
      title: `Requisição de Peça ${request.part_number}`,
      copies: 1
    }
    
    // Send to printer
    return sendToPrinter(printJob)
  }
  
  const sendToPrinter = async (job: PrintJob) => {
    // In a real implementation, this would send the job to a backend service
    // For demonstration, we'll simulate it with a delayed promise
    
    console.log('Print job:', job)
    
    // Simulate network request
    return new Promise<void>(resolve => {
      setTimeout(() => {
        toast({
          title: "Requisição impressa",
          description: `Documento enviado para impressora ${job.printer.name || job.printer.ipAddress}`,
        })
        resolve()
      }, 1500)
    })
    
    // In a real implementation, you would have code like this:
    // const response = await fetch('/api/print', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(job)
    // })
    // 
    // if (!response.ok) {
    //   const error = await response.text()
    //   throw new Error(`Falha ao imprimir: ${error}`)
    // }
    // 
    // return response.json()
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow">
      <Input 
        placeholder="N° da Peça" 
        value={partNumber}
        onChange={(e) => setPartNumber(e.target.value)}
        required
      />
      <Input 
        type="number" 
        placeholder="Quantidade" 
        value={quantity || ''}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min={1}
        required
      />
      <Select 
        value={location} 
        onValueChange={(value) => setLocation(value as PartsRequest['location'])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione o setor" />
        </SelectTrigger>
        <SelectContent>
          {LOCATIONS.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input 
        placeholder="Solicitante" 
        value={requester}
        onChange={(e) => setRequester(e.target.value)}
        required
      />
      <Button 
        type="submit" 
        className="col-span-2 flex items-center gap-2"
        disabled={isPrinting}
      >
        <Printer size={16} />  {/* Replaced FilePrinter with Printer */}
        {isPrinting ? "Enviando para impressão..." : "Enviar Requisição"}
      </Button>
    </form>
  )
}
