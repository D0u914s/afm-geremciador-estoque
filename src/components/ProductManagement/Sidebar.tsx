import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Search, 
  QrCode, 
  Barcode, 
  Bot,
  Package,
  LayoutDashboard,
  Truck
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface ProductSidebarProps {
  onSelectSection: (section: 'entry' | 'exit' | 'search' | 'qrcode' | 'ean' | 'ai' | 'dashboard' | 'tracking' | 'parts_request') => void
  activeSection: 'entry' | 'exit' | 'search' | 'qrcode' | 'ean' | 'ai' | 'dashboard' | 'tracking' | 'parts_request'
}

export function ProductSidebar({ onSelectSection, activeSection }: ProductSidebarProps) {
  return (
    <Sidebar className="bg-[#15457c] text-white border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white p-1 rounded-full flex items-center justify-center w-16 h-16 shadow-lg">
            <img 
              src="./assets/logo.png" 
              alt="AFM Logo" 
              className="w-14 h-14 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "./assets/placeholder.png";
              }}
            />
          </div>
          <h2 className="text-lg font-semibold text-white">Gestão de Estoque</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#15457c] text-white h-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => onSelectSection('dashboard')}
              isActive={activeSection === 'dashboard'}
              className="transition-all hover:translate-y-[-2px] hover:shadow-md text-white hover:bg-[#1a5694] data-[active=true]:bg-[#1a5694]"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => onSelectSection('entry')}
              isActive={activeSection === 'entry'}
              className="transition-all hover:translate-y-[-2px] hover:shadow-md text-white hover:bg-[#1a5694] data-[active=true]:bg-[#1a5694]"
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              <span>Entrada de Produtos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => onSelectSection('exit')}
              isActive={activeSection === 'exit'}
              className="transition-all hover:translate-y-[-2px] hover:shadow-md text-white hover:bg-[#1a5694] data-[active=true]:bg-[#1a5694]"
            >
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              <span>Saída de Produtos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => onSelectSection('search')}
              isActive={activeSection === 'search'}
              className="transition-all hover:translate-y-[-2px] hover:shadow-md text-white hover:bg-[#1a5694] data-[active=true]:bg-[#1a5694]"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Pesquisar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => onSelectSection('qrcode')}
              isActive={activeSection === 'qrcode'}
              className="transition-all hover:translate-y-[-2px] hover:shadow-md text-white hover:bg-[#1a5694] data-[active=true]:bg-[#1a5694]"
            >
              <QrCode className="mr-2 h-4 w-4" />
              <span>QR Code</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => onSelectSection('ean')}
              isActive={activeSection === 'ean'}
              className="transition-all hover:translate-y-[-2px] hover:shadow-md text-white hover:bg-[#1a5694] data-[active=true]:bg-[#1a5694]"
            >
              <Barcode className="mr-2 h-4 w-4" />
              <span>EAN-13</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => onSelectSection('ai')}
              isActive={activeSection === 'ai'}
              className="transition-all hover:translate-y-[-2px] hover:shadow-md text-white hover:bg-[#1a5694] data-[active=true]:bg-[#1a5694]"
            >
              <Bot className="mr-2 h-4 w-4" />
              <span>Assistente IA</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => onSelectSection('tracking')}
              isActive={activeSection === 'tracking'}
              className="transition-all hover:translate-y-[-2px] hover:shadow-md text-white hover:bg-[#1a5694] data-[active=true]:bg-[#1a5694]"
            >
              <Truck className="mr-2 h-4 w-4" />
              <span>Rastreios</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => onSelectSection('parts_request')}
              isActive={activeSection === 'parts_request'}
              className="transition-all hover:translate-y-[-2px] hover:shadow-md text-white hover:bg-[#1a5694] data-[active=true]:bg-[#1a5694]"
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Requisição de Peças</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
