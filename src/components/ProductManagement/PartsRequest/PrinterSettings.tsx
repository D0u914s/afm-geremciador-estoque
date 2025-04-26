
import { useState } from 'react'
import { Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PrinterConfig } from '@/types/product'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export function PrinterSettings() {
  const [printers, setPrinters] = useState<PrinterConfig[]>(() => {
    const saved = localStorage.getItem('printerConfigs')
    return saved ? JSON.parse(saved) : []
  })
  
  const [newPrinter, setNewPrinter] = useState<PrinterConfig>({
    location: '',
    ipAddress: '',
    port: 9100,
    name: '',
    isDefault: false
  })

  const savePrinter = () => {
    if (newPrinter.location && newPrinter.ipAddress) {
      // If this is set as default, unset other defaults
      let updated = [...printers]
      if (newPrinter.isDefault) {
        updated = updated.map(p => ({ ...p, isDefault: false }))
      }
      
      // Add the new printer
      updated = [...updated, newPrinter]
      setPrinters(updated)
      localStorage.setItem('printerConfigs', JSON.stringify(updated))
      
      toast({
        title: 'Impressora adicionada',
        description: `Impressora ${newPrinter.name || newPrinter.ipAddress} configurada com sucesso.`
      })
      
      setNewPrinter({
        location: '',
        ipAddress: '',
        port: 9100,
        name: '',
        isDefault: false
      })
    } else {
      toast({
        title: 'Erro',
        description: 'Localização e endereço IP são obrigatórios.',
        variant: 'destructive'
      })
    }
  }

  const removePrinter = (index: number) => {
    const updated = printers.filter((_, i) => i !== index)
    setPrinters(updated)
    localStorage.setItem('printerConfigs', JSON.stringify(updated))
    
    toast({
      title: 'Impressora removida',
      description: 'Configuração de impressora removida com sucesso.'
    })
  }

  const testPrinter = (printer: PrinterConfig) => {
    try {
      const testContent = `
      ---------------------------------
      TESTE DE IMPRESSÃO
      ---------------------------------
      Impressora: ${printer.name || 'Não definido'}
      IP: ${printer.ipAddress}
      Porta: ${printer.port || 9100}
      Local: ${printer.location}
      Data: ${new Date().toLocaleDateString()}
      Hora: ${new Date().toLocaleTimeString()}
      ---------------------------------
      TESTE CONCLUÍDO COM SUCESSO
      ---------------------------------
      `
      
      // In a real implementation, we would send this to the backend
      // For now, we'll just show a success message
      toast({
        title: 'Teste de impressão',
        description: `Enviando teste para impressora ${printer.ipAddress}. Verifique se o documento foi impresso.`
      })
      
      console.log('Print test for', printer, 'content:', testContent)
      
      // Here's where you would integrate with a real printing backend
      sendPrintJob({
        printer,
        content: testContent,
        title: 'Teste de Impressão'
      })
    } catch (error) {
      console.error('Error testing printer:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao testar impressora. Verifique o console para mais detalhes.',
        variant: 'destructive'
      })
    }
  }
  
  // This function would connect to your backend printing service
  const sendPrintJob = (job: { printer: PrinterConfig, content: string, title?: string }) => {
    // In a production environment, this would send the data to a backend service
    // For now, we'll simulate it with a console log and toast message
    console.log('Sending print job:', job)
    
    // Simulate network request
    setTimeout(() => {
      toast({
        title: 'Impressão enviada',
        description: `Documento "${job.title || 'Sem título'}" enviado para ${job.printer.ipAddress}`
      })
    }, 1500)
  }

  const setAsDefault = (index: number) => {
    const updated = printers.map((p, i) => ({
      ...p,
      isDefault: i === index
    }))
    setPrinters(updated)
    localStorage.setItem('printerConfigs', JSON.stringify(updated))
    
    toast({
      title: 'Impressora padrão',
      description: `Impressora ${printers[index].name || printers[index].ipAddress} definida como padrão.`
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Configurações de Impressora">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuração de Impressoras</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="printerName">Nome (opcional)</Label>
                <Input
                  id="printerName"
                  placeholder="Ex: Impressora Recepção"
                  value={newPrinter.name}
                  onChange={(e) => setNewPrinter({ ...newPrinter, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="printerLocation">Localização</Label>
                <Input
                  id="printerLocation"
                  placeholder="Ex: 1° andar"
                  value={newPrinter.location}
                  onChange={(e) => setNewPrinter({ ...newPrinter, location: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="printerIP">Endereço IP</Label>
                <Input
                  id="printerIP"
                  placeholder="Ex: 192.168.1.100"
                  value={newPrinter.ipAddress}
                  onChange={(e) => setNewPrinter({ ...newPrinter, ipAddress: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="printerPort">Porta</Label>
                <Input
                  id="printerPort"
                  placeholder="Ex: 9100"
                  type="number"
                  value={newPrinter.port || 9100}
                  onChange={(e) => setNewPrinter({ ...newPrinter, port: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              <input
                id="isDefault"
                type="checkbox"
                className="h-4 w-4"
                checked={newPrinter.isDefault}
                onChange={(e) => setNewPrinter({ ...newPrinter, isDefault: e.target.checked })}
              />
              <Label htmlFor="isDefault">Definir como impressora padrão</Label>
            </div>
            
            <Button onClick={savePrinter} className="w-full mt-2">Adicionar Impressora</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Impressoras configuradas</h3>
            {printers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma impressora configurada.</p>
            ) : (
              <div className="space-y-2">
                {printers.map((printer, index) => (
                  <div key={index} className="flex flex-col gap-2 p-2 border rounded">
                    <div>
                      <p className="font-medium">{printer.name || printer.ipAddress}</p>
                      <p className="text-sm text-muted-foreground">
                        {printer.location} • {printer.ipAddress}:{printer.port || 9100}
                        {printer.isDefault && ' • Padrão'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => testPrinter(printer)}
                      >
                        Testar
                      </Button>
                      {!printer.isDefault && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => setAsDefault(index)}
                        >
                          Definir como padrão
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removePrinter(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
