import { Heart, Twitter, Github, Linkedin } from "lucide-react"
import Link from "next/link"
import LogoEF from "./LogoEF"

const Footer = () => {
    return (
        <footer className="border-t bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-12">
                {/* Grid Principal */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Coluna 1: Logo e Descrição */}
                    <div className="space-y-4">
                        <LogoEF />
                        <p className="text-sm text-muted-foreground">
                            Transformando a maneira como você gerencia seus eventos, um formulário por vez.
                        </p>
                    </div>

                    {/* Coluna 2: Links Rápidos */}
                    <div>
                        <h4 className="font-semibold mb-4">Links Rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                                    Planos
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/new-event" className="text-muted-foreground hover:text-primary transition-colors">
                                    Criar Evento
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 3: Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                                    Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                                    Termos de Uso
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 4: Redes Sociais */}
                    <div>
                        <h4 className="font-semibold mb-4">Redes Sociais</h4>
                        <div className="flex space-x-4">
                            <Link 
                                href="https://github.com/roversodev" 
                                className="text-muted-foreground hover:text-primary transition-colors"
                                target="_blank"
                            >
                                <Github className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Linha Divisória com Gradiente */}
                <div className="h-px bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent my-8" />

                {/* Copyright e Créditos */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
                    <p className="flex items-center gap-1 mb-4 sm:mb-0">
                        <span>© 2025 EventFlow+</span>
                        <span className="inline-flex items-center">
                            feito com <Heart className="h-4 w-4 fill-primary mx-1" /> por
                        </span>
                        <Link 
                            href="https://portfolio.roversodev.com.br"
                            className="font-medium text-foreground hover:text-primary transition-colors"
                            target="_blank"
                        >
                            RoversoDev
                        </Link>
                    </p>
                    <p className="text-xs">
                        Todos os direitos reservados
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
