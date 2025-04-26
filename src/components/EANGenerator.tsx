import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JsBarcode from 'jsbarcode';

export const EANGenerator = () => {
  const [eanCode, setEanCode] = useState('');

  const generateEAN = () => {
    // Começar com o prefixo brasileiro "789"
    let code = '789';
    
    // Gerar 9 dígitos aleatórios (12 - 3 do prefixo)
    for (let i = 0; i < 9; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    
    // Calcular dígito verificador
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return code + checkDigit;
  };

  useEffect(() => {
    const newCode = generateEAN();
    setEanCode(newCode);
    
    const svg = document.getElementById('barcode');
    if (svg) {
      JsBarcode("#barcode", newCode, {
        format: "EAN13",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 20,
        margin: 10
      });
    }
  }, []);

  const regenerateCode = () => {
    const newCode = generateEAN();
    setEanCode(newCode);
    
    const svg = document.getElementById('barcode');
    if (svg) {
      JsBarcode("#barcode", newCode, {
        format: "EAN13",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 20,
        margin: 10
      });
    }
  };

  const downloadBarcode = () => {
    const svg = document.getElementById('barcode');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `ean13-${eanCode}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-center">
          <svg id="barcode"></svg>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={regenerateCode}
            className="w-full"
          >
            Generate New EAN-13
          </Button>
          
          <Button
            onClick={downloadBarcode}
            variant="outline"
            className="w-full"
          >
            Download Barcode
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};