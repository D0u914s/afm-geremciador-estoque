
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { partsFormSchema, type PartsFormValues } from "./Parts/PartsFormSchema"
import { Loader2, Search, Trash2, Download, Image } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { uploadPartPhoto } from "./Parts/storage-utils"
import { useProductSearch } from "@/hooks/useProductSearch"

export function PartsRegistration() {
  const [searchPartNumber, setSearchPartNumber] = useState<string>("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const form = useForm<PartsFormValues>({
    resolver: zodResolver(partsFormSchema),
    defaultValues: {
      partNumber: "",
      partName: "",
      isOriginal: true,
      location: "",
    },
  })

  // Stock quantity search query using the improved hook with parameters
  const { 
    stockData, 
    isLoadingStock,
    refetch
  } = useProductSearch(searchPartNumber, "partNumber", "", "parts");

  const handleSearch = () => {
    if (!searchPartNumber) {
      toast.error("Digite um número de peça para pesquisar")
      return
    }
    refetch();
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match('image/(jpeg|jpg|png)')) {
        toast.error('Apenas imagens JPEG, JPG ou PNG são permitidas');
        return;
      }
      
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: PartsFormValues) {
    try {
      let photoUrl = null;
      
      // Upload photo if selected
      if (photoFile) {
        setIsUploading(true);
        try {
          photoUrl = await uploadPartPhoto(photoFile);
        } catch (error: any) {
          toast.error("Erro ao fazer upload da imagem: " + error.message);
          return;
        } finally {
          setIsUploading(false);
        }
      }
      
      // Use RPC or REST API instead of direct table access
      const { error } = await supabase.from('parts').insert({
        part_number: values.partNumber,
        part_name: values.partName,
        is_original: values.isOriginal,
        location: values.location || null,
        photo_url: photoUrl,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });
      
      if (error) throw error;

      toast.success("Peça cadastrada com sucesso!")
      form.reset()
      setPhotoFile(null)
      setPhotoPreview(null)
      
      // If we just added a part that matches the current search, refresh the search
      if (values.partNumber.includes(searchPartNumber) || searchPartNumber.includes(values.partNumber)) {
        refetch();
      }
    } catch (error: any) {
      toast.error("Erro ao cadastrar peça: " + error.message)
    }
  }

  const handleDeletePart = async (partId: string) => {
    if (!partId) return;
    
    try {
      // Check if there are entries or exits for this part
      const { data: entries, error: entriesError } = await supabase
        .from('product_entries')
        .select('id')
        .eq('part_number', stockData?.part_number)
        .limit(1);
      
      if (entriesError) throw entriesError;
      
      const { data: exits, error: exitsError } = await supabase
        .from('product_exits')
        .select('id')
        .eq('part_number', stockData?.part_number)
        .limit(1);
      
      if (exitsError) throw exitsError;
      
      if (entries && entries.length > 0 || exits && exits.length > 0) {
        toast.error("Não é possível excluir peça que possui entradas ou saídas registradas");
        return;
      }
      
      const { error } = await supabase
        .from('parts')
        .delete()
        .eq('id', partId);
      
      if (error) throw error;
      
      toast.success("Peça excluída com sucesso!");
      setSearchPartNumber("");
      refetch();
    } catch (error: any) {
      toast.error("Erro ao excluir peça: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Cadastro de Peças</h2>
      <p className="text-muted-foreground">
        Cadastre e gerencie informações sobre peças do estoque.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mb-6">
        <h3 className="text-xl font-semibold mb-4">Consulta de Estoque</h3>
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar pelo número da peça..."
              value={searchPartNumber}
              onChange={(e) => setSearchPartNumber(e.target.value)}
              className="pl-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoadingStock || !searchPartNumber}
            className="bg-blue-700 hover:bg-blue-800"
          >
            {isLoadingStock ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Consultar
          </Button>
        </div>

        {isLoadingStock && (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
          </div>
        )}

        {!isLoadingStock && stockData && stockData.part_number && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-md hover:shadow-lg transition-all transform hover:scale-105 duration-300">
              <h4 className="font-medium text-lg mb-4 text-blue-800">Informações para: {stockData.part_number}</h4>
              
              {/* Enlarged status cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-100 hover:bg-blue-200 transition-colors shadow-md transform hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-blue-800 font-medium mb-2">Total de Entradas</p>
                    <p className="text-3xl font-bold text-blue-700">{stockData.entries || 0}</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-100 hover:bg-red-200 transition-colors shadow-md transform hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-red-800 font-medium mb-2">Total de Saídas</p>
                    <p className="text-3xl font-bold text-red-700">{stockData.exits || 0}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-100 hover:bg-green-200 transition-colors shadow-md transform hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-green-800 font-medium mb-2">Estoque Atual</p>
                    <p className="text-3xl font-bold text-green-700">{stockData.stock || 0}</p>
                  </CardContent>
                </Card>
              </div>
              
              {stockData.part && (
                <div className="mt-4">
                  <p className="text-blue-800 font-medium">Nome: <span className="font-normal">{stockData.part.part_name}</span></p>
                  <p className="text-blue-800 font-medium">Localização: <span className="font-normal">{stockData.part.location || 'Não especificada'}</span></p>
                  <p className="text-blue-800 font-medium">Tipo: <span className="font-normal">{stockData.part.is_original ? 'Original' : 'Não original'}</span></p>
                  
                  <div className="mt-4 flex gap-2">
                    {stockData.part.id && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeletePart(stockData.part?.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir Peça
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Image card */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-all transform hover:scale-105 duration-300 flex flex-col items-center justify-center h-full">
              <h4 className="font-medium text-lg mb-4 text-gray-800 text-center">Imagem da Peça</h4>
              
              {stockData.part && stockData.part.photo_url ? (
                <div className="w-full h-64 overflow-hidden rounded-lg relative bg-white p-2 shadow-inner">
                  <img 
                    src={stockData.part.photo_url} 
                    alt={stockData.part.part_name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=640';
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <a 
                    href={stockData.part.photo_url} 
                    download 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 rounded-lg border border-dashed border-gray-300">
                  <Image className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">Nenhuma imagem disponível para esta peça</p>
                  <p className="text-gray-400 text-sm text-center mt-2">Cadastre uma imagem utilizando o formulário abaixo</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <FormField
            control={form.control}
            name="partNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da Peça</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Peça</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isOriginal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Peça Original</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Marque se a peça é original do fabricante.
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Opcional" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Imagem da Peça (PNG, JPG ou JPEG)</FormLabel>
            <Input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={handlePhotoChange}
              className="cursor-pointer"
            />
            
            {photoPreview && (
              <div className="mt-2">
                <p className="text-sm mb-1">Prévia da imagem:</p>
                <img 
                  src={photoPreview} 
                  alt="Prévia da imagem" 
                  className="w-40 h-40 object-contain border rounded-lg" 
                />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isUploading} 
            className="bg-blue-700 hover:bg-blue-800"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enviando imagem...
              </>
            ) : "Cadastrar Peça"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
