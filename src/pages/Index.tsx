import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <img 
        src="/lovable-uploads/d3d7ca62-0c1c-4ce7-bbc1-2484ae580fbe.png"
        alt="Memorial Peças Grupos Logo"
        className="w-64 h-64 mb-8"
      />
      <h1 className="text-4xl font-bold mb-8">Gestão de Estoque Memorial</h1>
      <div className="space-y-4">
        <Link to="/auth">
          <Button size="lg">
            Entrar no Sistema
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;