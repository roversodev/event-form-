import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from './ui/button';

export function TextFormatter({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-wrap">
      {text.split('\n').map((line, i) => (
        <div key={i}>
          {line.split('*').map((segment, j) => 
            j % 2 === 1 ? 
              <strong key={j}>{segment}</strong> : 
              segment
          )}
        </div>
      ))}
    </div>
  );
}

export function TextAreaWithPreview({
  id,
  value,
  onChange,
  placeholder = "Digite sua descrição...\nUse *texto* para negrito\nPule linhas para formatar",
  rows = 8
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant={!showPreview ? "default" : "outline"}
          onClick={() => setShowPreview(false)}
          size="sm"
        >
          Editar
        </Button>
        <Button
          variant={showPreview ? "default" : "outline"}
          onClick={() => setShowPreview(true)}
          size="sm"
        >
          Visualizar
        </Button>
      </div>

      {showPreview ? (
        <div className="p-3 border rounded bg-muted/50">
          <TextFormatter text={value} />
        </div>
      ) : (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px]"
          placeholder={placeholder}
          rows={rows}
        />
      )}
    </div>
  );
}