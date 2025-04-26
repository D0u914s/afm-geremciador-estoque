import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ProductSidebar } from "@/components/ProductManagement/Sidebar"
import { ProductEntryForm } from "@/components/ProductManagement/ProductEntryForm"
import { ProductExitForm } from "@/components/ProductManagement/ProductExitForm"
import { QRCodeGenerator } from "@/components/QRCodeGenerator"
import { EANGenerator } from "@/components/EANGenerator"
import { AIAssistant } from "@/components/ProductManagement/AIAssistant"
import { Header } from "@/components/ProductManagement/Header"
import { SearchSection } from "@/components/ProductManagement/SearchSection"
import { LastRecord } from "@/components/ProductManagement/LastRecord"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Dashboard } from "@/components/ProductManagement/Dashboard"
import { ProductEntry, ProductExit, ActiveSection } from "@/types/product"
import { useLastRecord } from "@/hooks/useLastRecord"
import { useProductSearch } from "@/hooks/useProductSearch"
import { TrackingSection } from "@/components/ProductManagement/TrackingSection"
import { PartsRequestSection } from "@/components/ProductManagement/PartsRequestSection"

const ProductManagement = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('entry')
  const navigate = useNavigate()

  const sectionForLastRecord = (activeSection === 'entry' || activeSection === 'exit') 
    ? activeSection 
    : 'entry'
  
  const { lastRecord, refetchLastRecord } = useLastRecord(sectionForLastRecord)
  const { 
    searchTerm, 
    setSearchTerm, 
    filterType, 
    setFilterType, 
    dateFilter, 
    setDateFilter, 
    activeSection: searchActiveSection, 
    setActiveSection: setSearchActiveSection,
    searchResults, 
    isLoading,
    refetch: refetchSearch
  } = useProductSearch('', 'partNumber', '', 'entry');

  const handleSelectSection = (section: ActiveSection) => {
    setActiveSection(section)
    if (section === 'entry' || section === 'exit') {
      setSearchActiveSection(section)
    }
    if (section === 'search') {
      setFilterType('partNumber')
    }
  }

  const renderSearchResult = (result: ProductEntry | ProductExit) => {
    const isEntry = 'supplier' in result
    
    return (
      <div key={result.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white">
        <p><strong>ID:</strong> {result.id}</p>
        <p><strong>Data:</strong> {result.date}</p>
        <p><strong>N° da Peça:</strong> {result.part_number}</p>
        <p><strong>Quantidade:</strong> {result.quantity}</p>
        
        {isEntry ? (
          <>
            <p><strong>Fornecedor:</strong> {(result as ProductEntry).supplier}</p>
            <p><strong>N° da Nota:</strong> {(result as ProductEntry).nota_fiscal}</p>
            <p><strong>Conferente:</strong> {(result as ProductEntry).inspector}</p>
          </>
        ) : (
          <>
            <p><strong>Motivo:</strong> {(result as ProductExit).reason}</p>
            <p><strong>Responsável:</strong> {(result as ProductExit).responsible}</p>
          </>
        )}
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'entry':
        return <ProductEntryForm />
      case 'exit':
        return <ProductExitForm />
      case 'search':
        return (
          <SearchSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            activeSection={searchActiveSection}
            setActiveSection={setSearchActiveSection}
            searchResults={searchResults}
            isLoading={isLoading}
            renderSearchResult={renderSearchResult}
          />
        )
      case 'qrcode':
        return <QRCodeGenerator />
      case 'ean':
        return <EANGenerator />
      case 'ai':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Assistente IA</h2>
            <p className="text-muted-foreground">
              Use o assistente IA para ajudar com dúvidas sobre produtos, gestão de estoque
              e outras questões relacionadas ao gerenciamento de produtos.
            </p>
            <AIAssistant />
          </div>
        )
      case 'tracking':
        return <TrackingSection />
      case 'dashboard':
        return <Dashboard />
      case 'parts_request':
        return <PartsRequestSection />
      default:
        return <ProductEntryForm />
    }
  }

  const showLastRecord = activeSection === 'entry' || activeSection === 'exit'

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <ProductSidebar 
          onSelectSection={handleSelectSection}
          activeSection={activeSection}
        />
        <SidebarInset>
          <div className="flex-1 p-4">
            <div className="max-w-2xl mx-auto">
              <Header navigate={navigate} activeSection={activeSection} />
              
              <div className="mb-6">
                {renderContent()}
              </div>

              {showLastRecord && (
                <LastRecord 
                  lastRecord={lastRecord}
                  activeSection={sectionForLastRecord}
                  refetchLastRecord={refetchLastRecord}
                />
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default ProductManagement
