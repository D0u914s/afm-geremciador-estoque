
import { supabase } from "@/integrations/supabase/client"

export async function uploadPartPhoto(photoFile: File) {
  try {
    // Validate file type
    if (!photoFile.type.match('image/(jpeg|jpg|png)')) {
      throw new Error('Apenas imagens JPEG, JPG ou PNG são permitidas');
    }
    
    const fileExt = photoFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${fileName}`
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('parts')
      .upload(filePath, photoFile)
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError.message)
      throw uploadError
    }
    
    // Get the public URL
    const { data } = supabase.storage.from('parts').getPublicUrl(filePath)
    return data.publicUrl
  } catch (error: any) {
    console.error("Error in uploadPartPhoto:", error.message)
    throw error
  }
}

export async function uploadProductPhoto(photoFile: File) {
  try {
    // Validate file type
    if (!photoFile.type.match('image/(jpeg|jpg|png)')) {
      throw new Error('Apenas imagens JPEG, JPG ou PNG são permitidas');
    }
    
    const fileExt = photoFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${fileName}`
    
    // Upload the file directly to the product_photos bucket
    const { error: uploadError } = await supabase.storage
      .from('product_photos')
      .upload(filePath, photoFile)
      
    if (uploadError) {
      console.error("Error uploading product photo:", uploadError.message)
      throw uploadError
    }
    
    // Get the public URL
    const { data } = supabase.storage.from('product_photos').getPublicUrl(filePath)
    return data.publicUrl
  } catch (error: any) {
    console.error("Error in uploadProductPhoto:", error.message)
    throw error
  }
}
