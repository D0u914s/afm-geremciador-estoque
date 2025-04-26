import { useState, ChangeEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export const QRCodeGenerator = () => {
  const [qrData, setQrData] = useState('');
  const [qrType, setQrType] = useState('text');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('.qr-code-svg');
    if (svg) {
      // Get the SVG data
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

      // Create a canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on canvas
        ctx?.drawImage(img, 0, 0);
        
        // Convert to PNG and download
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      img.src = URL.createObjectURL(svgBlob);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <div className="space-y-4">
              <Label htmlFor="text-input">Enter Text</Label>
              <Input
                id="text-input"
                placeholder="Enter text for QR Code"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="url">
            <div className="space-y-4">
              <Label htmlFor="url-input">Enter URL</Label>
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="image">
            <div className="space-y-4">
              <Label htmlFor="image-input">Upload Image</Label>
              <Input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-center">
          {qrData && (
            <QRCodeSVG
              value={qrData}
              size={200}
              level="H"
              includeMargin
              className="border p-2 rounded qr-code-svg"
            />
          )}
        </div>

        {qrData && (
          <Button
            className="w-full mt-4"
            onClick={downloadQRCode}
          >
            Download QR Code
          </Button>
        )}
      </CardContent>
    </Card>
  );
};