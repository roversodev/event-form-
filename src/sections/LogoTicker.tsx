'use client';

import discotecaLogo from '@/assets/DISCOTECA-LOGO1-gray.png'
import illusionLogo from '@/assets/ILLUSION LOGOTIPO-gray.png'
import discotecaLogo2 from '@/assets/DISCOTECA-LOGO2-gray.png'
import discotecaLogo3 from '@/assets/DISCOTECA-LOGO1-gray.png'
import illusionLogo2 from '@/assets/ILLUSION LOGOTIPO-gray.png'
import discotecaLogo4 from'@/assets/DISCOTECA-LOGO2-gray.png'
import Image from 'next/image'
import {motion} from "framer-motion";

export const LogoTicker = () => {
  return (
    <div className='py-8 md:py-12'>
      <div className="container">
        <div className=" flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div className="flex gap-14 pr-14 flex-none items-center" animate={{
            translateX: "-50%",
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          }}
          >
            <Image src={discotecaLogo} alt="discoteca" className='logo-ticker' />
            <Image src={illusionLogo} alt="illusion" className='logo-ticker h-8' />
            <Image src={discotecaLogo2} alt="discoteca" className='logo-ticker' />
            <Image src={discotecaLogo3} alt="discoteca" className='logo-ticker' />
            <Image src={illusionLogo2} alt="illusion" className='logo-ticker h-8' />
            <Image src={discotecaLogo4} alt="discoteca" className='logo-ticker' />



            <Image src={discotecaLogo} alt="discoteca" className='logo-ticker' />
            <Image src={illusionLogo} alt="illusion" className='logo-ticker h-8' />
            <Image src={discotecaLogo2} alt="discoteca" className='logo-ticker' />
            <Image src={discotecaLogo3} alt="discoteca" className='logo-ticker' />
            <Image src={illusionLogo2} alt="illusion" className='logo-ticker h-8' />
            <Image src={discotecaLogo4} alt="discoteca" className='logo-ticker' />



            <Image src={discotecaLogo} alt="discoteca" className='logo-ticker' />
            <Image src={illusionLogo} alt="illusion" className='logo-ticker h-8' />
            <Image src={discotecaLogo2} alt="discoteca" className='logo-ticker' />
            <Image src={discotecaLogo3} alt="discoteca" className='logo-ticker' />
            <Image src={illusionLogo2} alt="illusion" className='logo-ticker h-8' />
            <Image src={discotecaLogo4} alt="discoteca" className='logo-ticker' />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
