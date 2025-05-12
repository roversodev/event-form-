import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

export const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-5xl font-medium text-center mb-24">
          O que nossos clientes dizem
        </h2>
        
        <MarqueeDemo />
      </div>
    </section>
  )
}

const reviews = [
  {
    name: "Vitor Sampaio",
    username: "@vitorsampaio",
    body: "Incrível como essa plataforma facilitou toda a organização dos meus eventos. Recomendo muito!",
    img: "https://avatar.vercel.sh/vitorsampaio",
  },
  {
    name: "Gabriel Brasa",
    username: "@gabrielbrasa",
    body: "Economizei muito tempo usando essa ferramenta. A interface é intuitiva e as funcionalidades são excelentes.",
    img: "https://avatar.vercel.sh/gabrielbrasa",
  },
  {
    name: "Lucas Gomes",
    username: "@lucasgomes",
    body: "Melhor plataforma para organização de eventos que já utilizei. Simplificou demais meu trabalho!",
    img: "https://avatar.vercel.sh/lucasgomes",
  },
  {
    name: "Vitor Roverso",
    username: "@vitorroverso",
    body: "Fantástico! Consegui automatizar vários processos que antes eram manuais. Super recomendo!",
    img: "https://avatar.vercel.sh/vitorroverso",
  },
  {
    name: "Theo Lara",
    username: "@theolara",
    body: "A plataforma revolucionou a forma como organizo meus eventos. Muito prática e eficiente!",
    img: "https://avatar.vercel.sh/theolara",
  },
  {
    name: "Rafael Ferrari",
    username: "@rafaelferrari",
    body: "Excelente ferramenta! Ajudou muito na gestão dos meus eventos e no controle de todos os detalhes.",
    img: "https://avatar.vercel.sh/rafaelferrari",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:hover:bg-gray-50/[.10]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}