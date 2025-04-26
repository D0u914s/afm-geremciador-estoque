
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <img
            src="/placeholder.svg"
            alt="Memorial Logo"
            className="w-32 h-32 mx-auto"
          />
          <CardTitle className="text-2xl font-bold text-blue-900">
            Gestão de Estoque Memorial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
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
