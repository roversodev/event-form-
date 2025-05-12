'use client';

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSupabase } from "@/providers/SupabaseProvider";

const plans = [
  {
    name: "Básico",
    description: "Para quem está começando",
    price: 0,
    features: [
      "Até 1 formulário",
      "Página do evento personalizada",
      "Suporte por email",
      "Exportação em excel",
      "Check-in dos participantes",
    ]
  },
  {
    name: "Profissional",
    description: "Para quem organiza diversos eventos",
    price: 49,
    features: [
      "Tudo do BÁSICO",
      "Até 5 formulários",
      "Suporte prioritário",
      "Exportação em excel",
      "Dashboard com insights",
    ]
  },
  {
    name: "Enterprise",
    description: "Para quem está em grande escala",
    price: 97,
    features: [
      "Tudo do PRO",
      "Fomulários ilimitados",
      "Treinamento completo",
      "Suporte 24/7",
      "API access",
    ]
  }
];

export default function PricingPage() {
  const router = useRouter();
  const supabase = useSupabase();

  const handleSubscribe = async (planName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      if (planName === 'Básico') {
        toast.info('Você já está no plano básico!');
        return;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          userId: session.user.id,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error('Erro ao processar assinatura');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Escolha seu plano</h1>
        <p className="text-muted-foreground">
          Planos flexíveis para atender suas necessidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-xl p-6 bg-card flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-muted-foreground mb-4">{plan.description}</p>
            <div className="text-3xl font-bold mb-6">
              {plan.price === 0 ? (
                "Grátis"
              ) : (
                <>
                  R$ {plan.price}
                  <span className="text-muted-foreground text-sm font-normal">
                    /mês
                  </span>
                </>
              )}
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSubscribe(plan.name)}
              variant={plan.name === "Profissional" ? "default" : "outline"}
              className="w-full"
            >
              {plan.price === 0 ? "Começar Grátis" : "Assinar Agora"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}