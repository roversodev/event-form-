"use client";
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card"
import { useTheme } from "next-themes"

const pricingPlans = [
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
]

export const Pricing = () => {
    const { theme } = useTheme();

    return (
        <section className="py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-medium">
                        Escolha o plano ideal para você
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-4">
                        Planos flexíveis que crescem junto com seu evento
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <Card 
                        key={index}
                        className="p-0 max-w-sm w-full shadow-none border-none">
                            <MagicCard
                                gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                                gradientFrom="#9810fa"
                                gradientTo="#9810fa"
                            >
                                <CardHeader className="pt-8">
                                    <CardTitle className="text-2xl font-medium">{plan.name}</CardTitle>
                                    <CardDescription className="text-neutral-500 dark:text-neutral-400 mt-2">{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="mt-8">
                                        <span className="text-4xl font-bold">R$ {plan.price}</span>
                                        <span className="text-neutral-500 dark:text-neutral-400">/mês</span>
                                    </div>
                                    <ul className="mt-8 space-y-4">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center gap-2">
                                                <Check className="h-5 w-5 text-primary" />
                                                <span>{feature}</span>
                                            </li> 
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="p-8">
                                    <Button variant="outline" size="lg">
                                        Escolher
                                    </Button>
                                </CardFooter>
                            </MagicCard>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
