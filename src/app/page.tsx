'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Calendar, Users, CheckSquare, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

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
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Transforme seus eventos com formulários impressionantes
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Crie, personalize e gerencie formulários de eventos com uma experiência rica e animações fluidas.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-lg rounded-full"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <span>Começar agora</span>
                    <motion.div
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border"
                >
                  <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="bg-muted py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Como funciona o EventForm+</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((step) => (
                <motion.div 
                  key={step}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: step * 0.2 }}
                  className="bg-background p-6 rounded-xl shadow-sm border"
                >
                  <div className="bg-primary/10 text-primary font-bold h-12 w-12 flex items-center justify-center rounded-full mb-4">
                    {step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {step === 1 ? 'Crie seu formulário' : 
                     step === 2 ? 'Compartilhe com convidados' : 
                     'Gerencie as respostas'}
                  </h3>
                  <p className="text-muted-foreground">
                    {step === 1 ? 'Personalize com cores, fontes e campos específicos para seu evento.' : 
                     step === 2 ? 'Envie o link para seus convidados responderem facilmente.' : 
                     'Acompanhe em tempo real e use no dia do evento para check-in.'}
                  </p>
                </motion.div>
              ))}
            </div>
            
            {/* Seção do Vídeo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16 relative rounded-2xl overflow-hidden shadow-2xl border bg-card"
            >
              <div className="aspect-video relative">
                <div 
                  className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  onClick={() => {
                    setIsPlaying(true);
                    const video = document.querySelector('video');
                    if (video) {
                      video.play().catch(error => {
                        console.error('Erro ao reproduzir vídeo:', error);
                        toast.error('Erro ao reproduzir vídeo');
                        setIsPlaying(false);
                      });
                    }
                  }}
                >
                  <Button 
                    size="lg" 
                    variant="ghost" 
                    className="rounded-full w-16 h-16 bg-white/10 hover:bg-white/20 hover:scale-110 transition-transform"
                  >
                    <Play className="h-8 w-8 text-white" />
                  </Button>
                </div>
                
                <video
                  className="w-full h-full object-cover"
                  src="/video/demo.mp4"
                  poster="/video/thumbnail.jpg"
                  controls={isPlaying}
                  playsInline
                  preload="metadata"
                  controlsList="nodownload"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onClick={(e) => {
                    if (!isPlaying) {
                      e.preventDefault();
                      setIsPlaying(true);
                      const video = e.currentTarget;
                      video.play().catch(() => setIsPlaying(false));
                    }
                  }}
                >
                  <source src="/video/demo.mp4" type="video/mp4" />
                  <source src="/video/demo.webm" type="video/webm" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
    </div>
  );
};

export default Index;