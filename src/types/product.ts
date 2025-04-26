
export type ProductEntry = {
  id: string
  created_at: string
  created_by: string
  date: string
  inspector: string
  nota_fiscal: string
  part_number: string
  quantity: number
  supplier: string
}

export type ProductExit = {
  id: string
  created_at: string
  created_by: string
  date: string
  part_number: string
  quantity: number
  reason: string
  responsible: string
  order_number?: string
}

export type PartsRequest = {
  id: string
  created_at: string
  part_number: string
  quantity: number
  location: 'terreo' | '1° andar' | '2° andar' | '3° andar'
  requester: string
  status: 'pending' | 'completed'
  completed_at?: string | null
}

export type ActiveSection = 'entry' | 'exit' | 'search' | 'qrcode' | 'ean' | 'ai' | 'dashboard' | 'tracking' | 'parts_request'

export type PrinterConfig = {
  location: string
  ipAddress: string
  port?: number
  name?: string
  isDefault?: boolean
}

export type PrintJob = {
  printer: PrinterConfig
  content: string
  copies?: number
  title?: string
}
