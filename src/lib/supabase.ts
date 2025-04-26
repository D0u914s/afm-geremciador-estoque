import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função de teste de conexão
export async function testDatabaseConnection() {
  try {
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (testError) throw testError
    console.log('Conexão bem sucedida:', testData)
    return true
  } catch (error) {
    console.error('Erro na conexão:', error)
    return false
  }
}

// Interface para produtos
interface Product {
  id?: number
  name: string
  description?: string
  quantity: number
  price: number
  created_at?: string
}

// Funções CRUD
export async function insertProduct(product: Product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
  
  return { data, error }
}

export async function updateProduct(id: number, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  return { error }
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
  
  return { data, error }
}