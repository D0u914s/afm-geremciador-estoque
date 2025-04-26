
import { Home, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

interface HeaderProps {
  navigate: (path: string) => void
  activeSection: 'entry' | 'exit' | 'search' | 'qrcode' | 'ean' | 'ai' | 'parts' | 'suppliers' | 'dashboard'
}

type DateFilter = "today" | "yesterday" | "7days" | "15days" | "30days" | "90days" | "custom"

export function Header({ navigate, activeSection }: HeaderProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>("today")
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  
  const getDateRange = (): { start: string, end: string } => {
    const today = new Date()
    const end = format(today, 'yyyy-MM-dd')
    
    switch (dateFilter) {
      case "today":
        return { start: end, end }
      case "yesterday":
        return { 
          start: format(subDays(today, 1), 'yyyy-MM-dd'), 
          end: format(subDays(today, 1), 'yyyy-MM-dd') 
        }
      case "7days":
        return { start: format(subDays(today, 7), 'yyyy-MM-dd'), end }
      case "15days":
        return { start: format(subDays(today, 15), 'yyyy-MM-dd'), end }
      case "30days":
        return { start: format(subDays(today, 30), 'yyyy-MM-dd'), end }
      case "90days":
        return { start: format(subDays(today, 90), 'yyyy-MM-dd'), end }
      case "custom":
        return { start: startDate, end: endDate }
      default:
        return { start: end, end }
    }
  }

  const handleDownloadCSV = async () => {
    // Só permitir download para telas de entrada e saída
    if (activeSection !== 'entry' && activeSection !== 'exit') {
      toast.error('Download disponível apenas para entrada e saída de produtos')
      return
    }
    
    const table = activeSection === 'entry' ? 'product_entries' : 'product_exits'
    const dateField = activeSection === 'entry' ? 'date' : 'date'
    const { start, end } = getDateRange()
    
    let query = supabase
      .from(table)
      .select('*')
      .gte(dateField, start)
      .lte(dateField, end)
      .order('created_at', { ascending: false })
    
    const { data, error } = await query

    if (error) {
      toast.error('Erro ao baixar dados')
      console.error('Erro ao baixar dados:', error)
      return
    }

    if (!data || data.length === 0) {
      toast.error('Não há dados para exportar no período selecionado')
      return
    }

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(item => Object.values(item).join(','))
    const csvContent = [headers, ...rows].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    // Format the filename with a readable date range
    const dateRangeStr = start === end 
      ? format(new Date(start), 'dd-MM-yyyy', { locale: ptBR })
      : `${format(new Date(start), 'dd-MM-yyyy', { locale: ptBR })}_a_${format(new Date(end), 'dd-MM-yyyy', { locale: ptBR })}`
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${table}_${dateRangeStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success(`Download iniciado: ${data.length} registros`)
  }

  // Personalizar o título baseado na seção ativa
  const getPageTitle = () => {
    switch(activeSection) {
      case 'dashboard': return 'Dashboard';
      case 'parts': return 'Cadastro de Peças';
      case 'suppliers': return 'Cadastro de Fornecedores';
      case 'entry': return 'Entrada de Produtos';
      case 'exit': return 'Saída de Produtos';
      case 'search': return 'Pesquisar Produtos';
      case 'qrcode': return 'Gerador de QR Code';
      case 'ean': return 'Gerador de EAN-13';
      case 'ai': return 'Assistente IA';
      default: return 'Gestão de Estoque';
    }
  }

  // Formatar o texto do período selecionado
  const getDateFilterText = (): string => {
    switch (dateFilter) {
      case "today": return "Hoje";
      case "yesterday": return "Ontem";
      case "7days": return "Últimos 7 dias";
      case "15days": return "Últimos 15 dias";
      case "30days": return "Últimos 30 dias";
      case "90days": return "Últimos 90 dias";
      case "custom": 
        if (startDate === endDate) {
          return format(new Date(startDate), 'dd/MM/yyyy', { locale: ptBR });
        }
        return `${format(new Date(startDate), 'dd/MM/yyyy', { locale: ptBR })} a ${format(new Date(endDate), 'dd/MM/yyyy', { locale: ptBR })}`;
      default: return "Selecione o período";
    }
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Voltar ao menu inicial</span>
        </Button>
        <h1 className="text-xl font-bold">{getPageTitle()}</h1>
      </div>
      
      {(activeSection === 'entry' || activeSection === 'exit') && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Baixar CSV:</span> {getDateFilterText()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Período para download</h4>
              
              <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="15days">Últimos 15 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90days">Últimos 90 dias</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
              
              {dateFilter === "custom" && (
                <div className="space-y-2">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm">Data inicial</label>
                    <Input 
                      type="date" 
                      value={startDate} 
                      max={endDate}
                      onChange={(e) => setStartDate(e.target.value)} 
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm">Data final</label>
                    <Input 
                      type="date" 
                      value={endDate} 
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)} 
                    />
                  </div>
                </div>
              )}
              
              <Button onClick={handleDownloadCSV} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar CSV
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
