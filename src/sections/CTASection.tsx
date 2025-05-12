import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function CTA({ }) {
    return (
        <section id="cta" className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
            <div className="w-full">
                <div
                    className="h-[400px] md:h-[400px] overflow-hidden shadow-xl w-full border border-border rounded-xl bg-purple-600 relative z-20">
                    <Image alt="CTA fundo" decoding="async" data-nimg="fill"
                        className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
                        width={1000}
                        height={1000}
                        src="/cta-bg.webp" />
                    <div className="absolute inset-0 -top-32 md:-top-40 flex flex-col items-center justify-center">
                        <h1
                            className="text-white text-4xl md:text-7xl font-medium tracking-tighter max-w-xs md:max-w-xl text-center">
                            Automatize. Simplifique.
                        </h1>
                        <div className="absolute bottom-10 flex flex-col items-center justify-center gap-2">
                            <Link href="/login">
                                <Button size="lg">
                                    Começe agora gratuitamente
                                </Button>
                            </Link>
                            <span className="text-white text-sm">
                                Cancele a qualquer momento, sem perguntas
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
