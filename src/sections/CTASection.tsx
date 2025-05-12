import { Button } from "@/components/ui/button";
import Glow from "@/components/ui/glow";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
    href: string;
    text: string;
    variant?: string;
    icon?: ReactNode;
    iconRight?: ReactNode;
}

interface CTAProps {
    title?: string;
    buttons?: CTAButtonProps[] | false;
    className?: string;
}

export default function CTA({
    title = "Comece a criar agora",
    buttons = [
        {
            href: "/dashboard",
            text: "Começar Grátis",
            variant: "default",
        },
    ],
    className,
}: CTAProps) {
    return (
        <section className={cn("group relative overflow-hidden py-32", className)}>
            <div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
                <h2 className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
                    {title}
                </h2>
                {buttons !== false && buttons.length > 0 && (
                    <div className="flex justify-center gap-4">
                        {buttons.map((button, index) => (
                            <Button
                                key={index}
                                variant={(button.variant as "default" | "link" | "destructive" | "outline" | "secondary" | "ghost") || "default"}
                                size="lg"
                                asChild
                            >
                                <a href={button.href}>
                                    {button.icon}
                                    {button.text}
                                    {button.iconRight}
                                </a>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            <div className="absolute top-0 left-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
                <Glow variant="bottom" />
            </div>
        </section>
    );
}
