import { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const QRCodeReader = () => {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
        rememberLastUsedCamera: true,
      }, false); // Added the missing third argument (verbose flag)

      scanner.render(success, error);

      function success(result: string) {
        scanner.clear();
        setScanResult(result);
        setIsScanning(false);
        toast({
          title: "QR Code detectado!",
          description: "O código foi lido com sucesso.",
        });
      }

      function error(err: string) {
        console.warn(err);
      }

      return () => {
        scanner.clear();
      };
    }
  }, [isScanning, toast]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          {!isScanning && !scanResult && (
            <Button 
              onClick={() => setIsScanning(true)}
              className="w-full"
            >
              Iniciar Scanner
            </Button>
          )}

          {isScanning && (
            <>
              <div id="reader" className="w-full"></div>
              <Button 
                variant="destructive"
                onClick={() => setIsScanning(false)}
                className="w-full"
              >
                Cancelar Scanner
              </Button>
            </>
          )}

          {scanResult && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Resultado:</h3>
                <p className="break-all">{scanResult}</p>
              </div>
              <Button 
                onClick={() => {
                  setScanResult('');
                  setIsScanning(true);
                }}
                className="w-full"
              >
                Escanear Novo Código
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};