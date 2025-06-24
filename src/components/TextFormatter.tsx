import React from 'react';

interface TextFormatterProps {
  text: string;
}

export function TextFormatter({ text }: TextFormatterProps) {
  const formattedText = text.split('\n').map((line, i) => {
    // Processa negritos com *
    const parts = line.split(/(\*.*?\*)/g);
    
    return (
      <React.Fragment key={i}>
        {parts.map((part, j) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return <strong key={j}>{part.slice(1, -1)}</strong>;
          }
          return part;
        })}
        <br />
      </React.Fragment>
    );
  });

  return <div className="whitespace-pre-wrap">{formattedText}</div>;
}