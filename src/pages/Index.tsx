
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#042173] to-[#15457c] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <img
            src="/lovable-uploads/9b834f62-9bc6-4d31-9577-d690cc474fcd.png"
            alt="AFM Logo"
            className="w-32 h-32 mx-auto"
          />
          <CardTitle className="text-2xl font-bold text-[#042173]">
            Gestão de Estoque AFM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full bg-[#042173] hover:bg-[#15457c] text-[#f0fbfa] py-6 text-lg"
            onClick={() => console.log("Login clicked")}
          >
            Entrar no Sistema
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
