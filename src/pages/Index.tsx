import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <img 
        src="./assets/logo.png"
        alt="AFM Logo"
        className="w-64 h-64 mb-8"
      />
      <h1 className="text-4xl font-bold mb-8">AFM Gerenciador de Estoque</h1>
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