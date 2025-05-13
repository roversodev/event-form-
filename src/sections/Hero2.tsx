'use client';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Hero2 = () => {
    return (
        <section id="hero" className="w-full relative">
            <div className="relative flex flex-col items-center w-full px-6">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 -z-10 h-[600px] md:h-[800px] w-full [background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--purple)_100%)] rounded-b-xl"></div>
                </div>
                <div className="relative z-10 pt-32 max-w-3xl mx-auto h-full w-full flex flex-col gap-10 items-center justify-center">
                    <div className="group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                            <span className="text-xs">✨ Introduzindo EventFlow+ </span>
                            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                        </AnimatedShinyText>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-5">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center text-primary">
                            {"Transforme seus eventos em formulários impressionantes"
                                .split(" ")
                                .map((word, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                            ease: "easeInOut",
                                        }}
                                        className="mr-2 inline-block"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                        </h1>
                        <motion.p
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                duration: 0.3,
                                delay: 0.8,
                            }} className="text-base md:text-lg text-center text-muted-foreground font-medium text-balance leading-relaxed tracking-tight">
                            Com uma dashboard intuitiva. Personalize, gerencie inscrições e compartilhe seu flyer em uma única plataforma moderna e profissional.
                        </motion.p>
                    </div>
                    <motion.div
                    initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: 1,
                      }}
                    className="flex items-center gap-2.5 flex-wrap justify-center">
                        <Link href="/register" className="bg-secondary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-dark dark:text-white w-32 px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95">
                            Cadastre-se
                        </Link>
                        <Link href="/login" className="h-10 flex items-center justify-center w-32 px-5 text-sm font-normal tracking-wide text-primary rounded-full transition-all ease-out active:scale-95 bg-white dark:bg-background border border-[#E5E7EB] dark:border-[#27272A] hover:bg-white/80 dark:hover:bg-background/80">
                            Login
                        </Link>
                    </motion.div>
                </div>
            </div>
            <motion.div
            initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay: 1.2,
              }}
            className="relative px-6 mt-10">
                <HeroVideoDialog videoSrc={"/video/demo.mp4"} thumbnailSrc={"/dashboard.png"} />
            </motion.div>
        </section>
    )
}

export default Hero2
