
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ActiveSection } from "@/types/product"
import { Button } from "@/components/ui/button"
import { KeyboardEvent, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchSectionProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterType: string
  setFilterType: (type: string) => void
  dateFilter: string
  setDateFilter: (date: string) => void
  activeSection: 'entry' | 'exit' | 'parts'
  setActiveSection: (section: 'entry' | 'exit' | 'parts') => void
  searchResults: any[]
  isLoading: boolean
  renderSearchResult: (result: any) => React.ReactNode
}

export function SearchSection({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  dateFilter,
  setDateFilter,
  activeSection,
  setActiveSection,
  searchResults,
  isLoading,
  renderSearchResult
}: SearchSectionProps) {

  const handleSearch = () => {
    console.log("Searching with term:", searchTerm, "filterType:", filterType, "dateFilter:", dateFilter, "section:", activeSection);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pesquisar Registros</h2>
      
      <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as 'entry' | 'exit' | 'parts')}>
        <TabsList className="mb-4">
          <TabsTrigger value="entry">Entradas</TabsTrigger>
          <TabsTrigger value="exit">Saídas</TabsTrigger>
          <TabsTrigger value="parts">Peças</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeSection} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partNumber">Número da Peça</SelectItem>
                <SelectItem value="invoiceNumber">Número da Nota</SelectItem>
                {activeSection === 'entry' && (
                  <SelectItem value="supplier">Fornecedor</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="bg-primary">
              Buscar
            </Button>
          </div>

          <div className="flex gap-4 items-center">
            <label htmlFor="dateFilter" className="text-sm font-medium">
              Filtrar por Data:
            </label>
            <Input
              id="dateFilter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[180px]"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4">
        {isLoading ? (
          <p className="text-center py-4">Carregando...</p>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map(renderSearchResult)}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {searchTerm ? "Nenhum resultado encontrado" : "Digite um termo para pesquisar"}
          </p>
        )}
      </div>
    </div>
  )
}
