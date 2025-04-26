
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Image } from "lucide-react"

interface PhotoUploadProps {
  photoFile: File | null
  photoPreview: string | null
  onPhotoChange: (file: File | null) => void
}

export function PhotoUpload({ photoFile, photoPreview, onPhotoChange }: PhotoUploadProps) {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      onPhotoChange(file)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="photo">Foto da Peça</Label>
      <Input 
        id="photo" 
        type="file" 
        accept="image/*"
        onChange={handlePhotoChange}
      />
      
      {photoPreview && (
        <div className="mt-2">
          <p className="text-sm mb-1">Prévia:</p>
          <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
            <img 
              src={photoPreview} 
              alt="Prévia da foto" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {!photoPreview && (
        <div className="mt-2 w-40 h-40 border rounded-lg flex items-center justify-center bg-muted/20">
          <Image className="w-10 h-10 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
