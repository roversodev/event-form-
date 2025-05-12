import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    id: 'item-1',
    question: 'Como começar a usar o EventFlow+?',
    answer: 'Basta criar uma conta gratuita e você já pode começar a criar seu primeiro evento.'
  },
  {
    id: 'item-2',
    question: 'Quanto custa usar o EventFlow+?',
    answer: 'Oferecemos um plano gratuito com recursos essenciais. Para funcionalidades avançadas, temos planos premium a partir de R$49/mês.'
  },
  {
    id: 'item-3',
    question: 'Posso personalizar os formulários?',
    answer: 'Sim! O EventFlow+ oferece total flexibilidade para personalizar seus formulários e páginas de evento com sua marca.'
  },
  {
    id: 'item-4',
    question: 'Vocês oferecem suporte técnico?',
    answer: 'Sim! Nosso time de suporte está disponível 24/7 para ajudar você com qualquer dúvida ou problema técnico.'
  }
]

export const FAQ = () => {
  return (
    <section className="py-20 px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl lg:text-5xl font-medium text-center">
          Perguntas Frequentes
        </h2>
        
        <Accordion type="single" collapsible className="mt-16">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}