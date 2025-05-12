'use client';
import React from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import * as variant from '@/lib/motionVariants';



export function Bento() {
  const features = [
    {
      title: "Dashboard em Tempo Real",
      description:
        "Monitore as métricas do seu evento através de um painel intuitivo com análises em tempo real para tomar decisões baseadas em dados.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Formulários Personalizados",
      description:
        "Crie formulários de inscrição únicos e personalizados com sua marca, cores e campos específicos para cada tipo de evento.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Check-in Digital",
      description:
        "Sistema de check-in digital eficiente e rápido. Controle a presença dos participantes e gere relatórios em tempo real.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Gestão Completa",
      description:
        "Gerencie inscrições, envie comunicados, controle presenças e tenha insights valiosos sobre seus eventos em uma única plataforma.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <motion.div
      variants={variant.staggerContainer}
      initial="start"
      whileInView='end'
      className="px-8">
        <motion.h4
        variants={variant.fadeInUp}
        className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Repleto de diversos de recursos
        </motion.h4>

        <motion.p
        variants={variant.fadeInLeft}
        className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          Gerencie seus eventos com facilidade através de recursos como formulários personalizados, 
          controle de inscrições, e análise de dados em tempo real.
        </motion.p>
      </motion.div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
    variants={variant.fadeInUp}
    initial="start"
    whileInView='end'
    className={cn(`p-4 sm:p-8 relative overflow-hidden h-full`, className)}>
      {children}
    </motion.div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2">
      <div className="w-full p-5 mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full rounded-xl">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          <div className="relative w-full max-h-[400px] overflow-hidden rounded-lg">
            <img
              src="/localhost.jpeg"
              alt="Dashboard do EventFlow+"
              width={800}
              height={800}
              className="w-full object-cover object-center rounded-lg"
            />
            {/* Gradiente superior */}
            <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/20 dark:from-black/20 to-transparent" />
            {/* Gradiente inferior */}
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white/20 dark:from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full p-4">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-6 space-y-4">
        {/* Card de Check-in */}
        <div className="flex items-center space-x-4 border-b pb-4 dark:border-neutral-800">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-sm">João Silva</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">ID: #12345</p>
          </div>
          <div className="ml-auto">
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              Confirmado
            </div>
          </div>
        </div>

        {/* QR Code Simulado */}
        <div className="aspect-square w-full max-w-[200px] mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
          <div className="w-full h-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded flex items-center justify-center">
            <div className="grid grid-cols-4 gap-1 p-2 transform rotate-45">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-sm bg-primary"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Status de Check-in */}
        <div className="flex items-center justify-between text-sm pt-4 border-t dark:border-neutral-800">
          <span className="text-neutral-600 dark:text-neutral-400">Status</span>
          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
            <span>Check-in realizado</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Efeito de Hover/Interação */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export const SkeletonTwo = () => {
  return (
    <div className="relative flex flex-col items-start p-8 gap-4 h-full overflow-hidden">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-6 space-y-4">
        {/* Cabeçalho do Formulário */}
        <div className="flex items-center gap-2 pb-4 border-b dark:border-neutral-800">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Inscrição para Evento</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Formulário Personalizado</p>
          </div>
        </div>

        {/* Campos do Formulário */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Nome Completo</label>
            <div className="h-9 w-full rounded-md border border-input bg-background px-3"></div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <div className="h-9 w-full rounded-md border border-input bg-background px-3"></div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Tipo de Ingresso</label>
            <div className="flex gap-2">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full border border-primary bg-background"></div>
                <span className="text-sm ml-2">VIP</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full border border-primary bg-background"></div>
                <span className="text-sm ml-2">Regular</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Preferências</label>
            <div className="flex gap-2">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded border border-input bg-background"></div>
                <span className="text-sm ml-2">Vegetariano</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded border border-input bg-background"></div>
                <span className="text-sm ml-2">Vegano</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Envio */}
        <div className="pt-4 border-t dark:border-neutral-800">
          <div className="h-9 w-full rounded-md bg-primary text-white flex items-center justify-center text-sm font-medium">
            Enviar Inscrição
          </div>
        </div>
      </div>

      {/* Gradientes decorativos */}
      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full p-4">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-6 space-y-4">
        {/* Cabeçalho do Dashboard */}
        <div className="flex items-center justify-between pb-4 border-b dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Visão Geral</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Gestão do Evento</p>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Inscritos</p>
            <p className="text-lg font-semibold text-primary">247</p>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Check-ins</p>
            <p className="text-lg font-semibold text-primary">183</p>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Receita</p>
            <p className="text-lg font-semibold text-primary">R$ 12.350</p>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Satisfação</p>
            <p className="text-lg font-semibold text-primary">98%</p>
          </div>
        </div>

        {/* Lista de Ações */}
        <div className="space-y-2 pt-4 border-t dark:border-neutral-800">
          <div className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-md">
            <span className="text-sm">Enviar lembretes</span>
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-md">
            <span className="text-sm">Gerar relatórios</span>
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.639, 0.196, 0.749],
      glowColor: [0.2, 0.2, 0.2],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
