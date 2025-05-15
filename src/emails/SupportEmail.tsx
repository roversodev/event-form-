import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface SupportEmailProps {
  userEmail: string;
  subject: string;
  message: string;
}

export const SupportEmail: React.FC<SupportEmailProps> = ({
  userEmail,
  subject,
  message,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Nova mensagem de suporte do EventForm+</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>EventForm+</Text>
          <Text style={paragraph}>Nova mensagem de suporte recebida:</Text>
          
          <Text style={paragraph}>
            <strong>De:</strong> {userEmail}
          </Text>
          
          <Text style={paragraph}>
            <strong>Assunto:</strong> {subject}
          </Text>
          
          <Section style={messageSection}>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Section style={btnContainer}>
            <Button 
              style={button} 
              href="https://eventform.roversodev.com.br"
            >
              Acessar EventForm+
            </Button>
          </Section>

          <Text style={paragraph}>
            Atenciosamente,
            <br />
            Equipe EventForm+
          </Text>

          <Hr style={hr} />
          
          <Text style={footer}>
            Este e-mail foi enviado através do sistema de suporte do EventForm+.
            Para responder, simplesmente responda a este e-mail.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#7c3aed',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#525f7f',
};

const messageSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const messageText = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#242424',
  whiteSpace: 'pre-wrap' as const,
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#7c3aed',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 32px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};

export default SupportEmail;