'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ThankYou() {
  const searchParams = useSearchParams();
  const primaryColor = searchParams.get('primary') || '#000000';
  const accentColor = searchParams.get('accent') || '#ffffff';
  const eventTitle = searchParams.get('title') || 'Evento';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card rounded-2xl shadow-lg p-12 max-w-lg w-full text-center space-y-8"
      >
        {/* Efeito de borda gradiente */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-20 size-full"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
            filter: 'blur(2px)',
            zIndex: 0 
          }}
        />

        {/* Conteúdo */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
            className="mb-8"
          >
            <div className="relative">
              <CheckCircle2 
                className="w-24 h-24 mx-auto"
                style={{ color: primaryColor }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              Inscrição Confirmada!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Obrigado por se inscrever no evento<br/>
              <span className="font-semibold" style={{ color: primaryColor }}>
                {eventTitle}
              </span>
            </p>

            <Link href="/" className="block">
              <Button 
                className="w-full text-white font-medium text-lg py-6 shadow-lg transition-all hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                }}
              >
                Voltar para a Página Inicial
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}