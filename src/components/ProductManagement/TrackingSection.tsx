
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

type TrackingRecord = {
  id: string;
  date: string;
  transport: string;
  sale_location: string;
  customer: string;
  order_number: string;
  tracking_code: string;
  tracking_link?: string;
  order_value: number;
  nota_fiscal: string;
}

export function TrackingSection() {
  const [newTracking, setNewTracking] = useState<Partial<TrackingRecord>>({});

  const { data: trackingRecords, isLoading, refetch } = useQuery<TrackingRecord[]>({
    queryKey: ['tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracking')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tracking records:', error);
        return [];
      }

      return data || [];
    }
  });

  const handleInputChange = (field: keyof TrackingRecord, value: string) => {
    setNewTracking(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof TrackingRecord)[] = [
      'date', 'transport', 'sale_location', 'customer', 
      'order_number', 'tracking_code', 'order_value', 'nota_fiscal'
    ];

    const missingFields = requiredFields.filter(field => !newTracking[field]);
    if (missingFields.length > 0) {
      toast.error(`Por favor, preencha todos os campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    const { error } = await supabase
      .from('tracking')
      .insert(newTracking);

    if (error) {
      toast.error('Erro ao salvar rastreamento');
      console.error('Error inserting tracking record:', error);
    } else {
      toast.success('Rastreamento salvo com sucesso');
      setNewTracking({});
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Rastreamento de Pedidos</h2>
      
      <Tabs defaultValue="new">
        <TabsList className="mb-4">
          <TabsTrigger value="new">Novo Rastreamento</TabsTrigger>
          <TabsTrigger value="list">Lista de Rastreamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Data</label>
              <Input 
                type="date" 
                value={newTracking.date || ''} 
                onChange={(e) => handleInputChange('date', e.target.value)} 
              />
            </div>
            <div>
              <label>Transporte</label>
              <Input 
                value={newTracking.transport || ''} 
                onChange={(e) => handleInputChange('transport', e.target.value)} 
                placeholder="Nome da transportadora" 
              />
            </div>
            <div>
              <label>Local de Venda</label>
              <Input 
                value={newTracking.sale_location || ''} 
                onChange={(e) => handleInputChange('sale_location', e.target.value)} 
                placeholder="Local da venda" 
              />
            </div>
            <div>
              <label>Cliente</label>
              <Input 
                value={newTracking.customer || ''} 
                onChange={(e) => handleInputChange('customer', e.target.value)} 
                placeholder="Nome do cliente" 
              />
            </div>
            <div>
              <label>Número do Pedido</label>
              <Input 
                value={newTracking.order_number || ''} 
                onChange={(e) => handleInputChange('order_number', e.target.value)} 
                placeholder="Número do pedido" 
              />
            </div>
            <div>
              <label>Código de Rastreio</label>
              <Input 
                value={newTracking.tracking_code || ''} 
                onChange={(e) => handleInputChange('tracking_code', e.target.value)} 
                placeholder="Código de rastreio" 
              />
            </div>
            <div>
              <label>Link de Rastreio (Opcional)</label>
              <Input 
                value={newTracking.tracking_link || ''} 
                onChange={(e) => handleInputChange('tracking_link', e.target.value)} 
                placeholder="Link de rastreio" 
              />
            </div>
            <div>
              <label>Valor do Pedido</label>
              <Input 
                type="number" 
                value={newTracking.order_value || ''} 
                onChange={(e) => handleInputChange('order_value', e.target.value)} 
                placeholder="Valor do pedido" 
              />
            </div>
            <div>
              <label>Nota Fiscal</label>
              <Input 
                value={newTracking.nota_fiscal || ''} 
                onChange={(e) => handleInputChange('nota_fiscal', e.target.value)} 
                placeholder="Número da nota fiscal" 
              />
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">Salvar Rastreamento</Button>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          {isLoading ? (
            <p>Carregando rastreamentos...</p>
          ) : trackingRecords && trackingRecords.length > 0 ? (
            trackingRecords.map(record => (
              <div key={record.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="grid grid-cols-2 gap-2">
                  <p><strong>Data:</strong> {format(new Date(record.date), 'dd/MM/yyyy')}</p>
                  <p><strong>Transporte:</strong> {record.transport}</p>
                  <p><strong>Local de Venda:</strong> {record.sale_location}</p>
                  <p><strong>Cliente:</strong> {record.customer}</p>
                  <p><strong>Número do Pedido:</strong> {record.order_number}</p>
                  <p><strong>Código de Rastreio:</strong> {record.tracking_code}</p>
                  {record.tracking_link && (
                    <p>
                      <strong>Link de Rastreio:</strong> 
                      <a 
                        href={record.tracking_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                      >
                        Rastrear
                      </a>
                    </p>
                  )}
                  <p><strong>Valor do Pedido:</strong> R$ {record.order_value.toFixed(2)}</p>
                  <p><strong>Nota Fiscal:</strong> {record.nota_fiscal}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Nenhum rastreamento encontrado</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
