'use client';
import { motion } from 'framer-motion';
import { Plus, Calendar, Users, CheckSquare, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { Bento } from '@/sections/Bento';
import Hero2 from '@/sections/Hero2';
import { LogoTicker } from '@/sections/LogoTicker';

const Index = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const features = [
    { 
      icon: <Plus className="h-6 w-6" />, 
      title: 'Formulários Personalizados', 
      description: 'Crie formulários exclusivos com sua identidade visual' 
    },
    { 
      icon: <Calendar className="h-6 w-6" />, 
      title: 'Gerenciamento de Eventos', 
      description: 'Organize todos os seus eventos em um só lugar' 
    },
    { 
      icon: <Users className="h-6 w-6" />, 
      title: 'Lista de Convidados', 
      description: 'Acompanhe confirmações e visualize dados em tempo real' 
    },
    { 
      icon: <CheckSquare className="h-6 w-6" />, 
      title: 'Check-in Simplificado', 
      description: 'Sistema rápido de check-in para o dia do evento' 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen ">
      
      <main className="flex-1 ">
        <Hero2 />

        <LogoTicker />

        <Bento />

      </main>
      
    </div>
  );
};

export default Index;