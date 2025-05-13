import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider"
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur"
import discotecaLogo from '@/assets/DISCOTECA-LOGO1-gray.png'
import illusionLogo from '@/assets/ILLUSION LOGOTIPO-gray.png'
import discotecaLogo2 from '@/assets/DISCOTECA-LOGO2-gray.png'

export default function LogoCloud() {
  return (
    <section className="bg-background overflow-hidden py-16">
      <div className="group relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:max-w-44 md:border-r md:pr-6">
            <p className="text-end text-sm">Confiado pelas melhores festas</p>
          </div>
          <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
              <div className="flex items-center">
                <img
                  className="mx-auto logo-ticker dark:invert"
                  src={discotecaLogo.src}
                  alt="Discoteca Logo"
                  height="20"
                  width="auto"
                />
              </div>

              <div className="flex items-center">
                <img
                  className="mx-auto logo-ticker h-8 dark:invert"
                  src={illusionLogo.src}
                  alt="Illusion Logo"
                  height="16"
                  width="auto"
                />
              </div>

              <div className="flex items-center">
                <img
                  className="mx-auto logo-ticker dark:invert"
                  src={discotecaLogo2.src}
                  alt="Discoteca logo"
                  height="16"
                  width="auto"
                />
              </div>

              <div className="flex items-center">
                <img
                  className="mx-auto logo-ticker dark:invert"
                  src={discotecaLogo.src}
                  alt="Discoteca Logo"
                  height="20"
                  width="auto"
                />
              </div>

              <div className="flex items-center">
                <img
                  className="mx-auto logo-ticker h-8 dark:invert"
                  src={illusionLogo.src}
                  alt="Illusion Logo"
                  height="16"
                  width="auto"
                />
              </div>

              <div className="flex items-center">
                <img
                  className="mx-auto logo-ticker dark:invert"
                  src={discotecaLogo2.src}
                  alt="Discoteca logo"
                  height="16"
                  width="auto"
                />
              </div>
            </InfiniteSlider>

            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
