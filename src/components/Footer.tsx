import { Heart } from "lucide-react"
import Link from "next/link"

const Footer = () => {
    return (
        <footer className="py-6 sm:py-8 px-4 border-t">
            <div className="container mx-auto text-center text-muted-foreground text-xs sm:text-sm">
                <p className="flex flex-col sm:flex-row items-center justify-center gap-1 text-sm sm:text-base">
                    <span className="whitespace-nowrap">© 2025 EventForm+ feito com</span>
                    <Heart className="h-4 w-4 fill-current mx-1" />
                    <span className="whitespace-nowrap">
                        by{" "}
                        <Link 
                            href='https://portfolio.roversodev.com.br' 
                            className="font-bold text-[#333] hover:text-[#333]/80 dark:text-[#fafafa] dark:hover:text-[#fafafa]/80 transition-colors"
                        >
                            RoversoDev
                        </Link>
                    </span>
                    <span className="whitespace-nowrap">para melhor gestão.</span>
                    <span className="hidden sm:inline mx-1">—</span>
                    <span className="text-xs sm:text-sm mt-1 sm:mt-0">Todos os direitos reservados</span>
                </p>
            </div>
        </footer>
    )
}

export default Footer
