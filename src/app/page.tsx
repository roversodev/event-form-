import { Bento } from '@/sections/Bento';
import Hero2 from '@/sections/Hero2';
import { Pricing } from '@/sections/Pricing';
import { FAQ } from '@/sections/FAQ';
import { Testimonials } from '@/sections/Testimonials';
import CTA from '@/sections/CTASection';
import LogoCloud from '@/sections/LogoTicker';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero2 />
        <LogoCloud />
        <Bento />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
    </div>
  );
};

export default Index;