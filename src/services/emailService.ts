import emailjs from 'emailjs-com';
import { toast } from 'sonner';

interface EmailParams {
  to_name: string;
  to_email: string;
  subject: string;
  message: string;
  type?: 'urgent' | 'announcement' | 'personal' | 'welcome' | 'verification' | 'support';
}

export const sendEmail = async (params: EmailParams) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Check user preference in localStorage
  let settings: any = {};
  try {
    settings = JSON.parse(localStorage.getItem('cetep_settings') || '{}');
  } catch (e) {
    settings = {};
  }
  if (settings.emailNotif === false) {
    console.log('Skipping email send: user disabled notifications');
    return { success: true, skipped: true };
  }

  const isConfigured = 
    Boolean(serviceId && templateId && publicKey) &&
    !serviceId?.includes('your-') &&
    !templateId?.includes('your-') &&
    !publicKey?.includes('your-');

  if (!isConfigured) {
    console.log(`[Notificação/Simulação CETEP - E-mail para ${params.to_email}]: ${params.subject}`);
    toast.success(`Notificação gerada para ${params.to_email}!`, {
      description: `Assunto: ${params.subject}`
    });
    return { success: true, simulated: true };
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_name: params.to_name,
        to_email: params.to_email,
        subject: params.subject,
        message: params.message,
        type: params.type || 'announcement'
      },
      publicKey
    );

    if (response.status === 200) {
      toast.success(`E-mail enviado com sucesso para ${params.to_email}!`);
      return { success: true };
    }
    throw new Error('Falha no envio de e-mail');
  } catch (error: any) {
    console.warn('EmailJS notification fallback:', error?.text || error?.message || error);
    toast.info(`Notificação gerada para ${params.to_email}`, {
      description: `Assunto: ${params.subject}`
    });
    return { success: true, simulated: true };
  }
};

export const sendWelcomeEmail = async (name: string, email: string) => {
  return sendEmail({
    to_name: name,
    to_email: email,
    subject: 'Bem-vindo ao Portal Acadêmico CETEP!',
    message: `Olá ${name},\n\nSua conta no Portal Acadêmico CETEP foi ativada com sucesso!\nVocê já pode acessar seus dados, boletim, sala de aula e comunicados em tempo real.\n\nBons estudos!`,
    type: 'welcome'
  });
};

export const sendVerificationCodeEmail = async (name: string, email: string, code: string) => {
  return sendEmail({
    to_name: name,
    to_email: email,
    subject: `Seu Código de Verificação CETEP: ${code}`,
    message: `Olá ${name},\n\nSeu código de verificação para alteração de senha / validação de segurança é: ${code}\n\nEste código é válido por 15 minutos.`,
    type: 'verification'
  });
};

export const sendSupportNotificationEmail = async (studentName: string, studentEmail: string, subject: string, message: string) => {
  return sendEmail({
    to_name: 'Professor Enzo Medeiros',
    to_email: 'enzomedeirosdasilva6@gmail.com',
    subject: `[Suporte CETEP] Novo chamado de ${studentName}: ${subject}`,
    message: `Novo chamado de suporte recebido no Portal CETEP!\n\nAluno: ${studentName}\nE-mail do Aluno: ${studentEmail}\nAssunto: ${subject}\n\nMensagem:\n${message}\n\nResponda diretamente ou pelo painel do portal.`,
    type: 'support'
  });
};

export const sendContactFormEmail = async (data: { name: string; email: string; subject: string; message: string; matricula?: string }) => {
  // Persist help request locally for redundancy
  try {
    const helpMsg = {
      id: `ajuda_${Date.now()}`,
      name: data.name,
      email: data.email,
      matricula: data.matricula || '',
      subject: data.subject,
      message: data.message,
      to_email: 'enzomedeirosdasilva6@gmail.com',
      date: new Date().toISOString(),
      status: 'pendente'
    };
    const stored = JSON.parse(localStorage.getItem('cetep_mensagens_ajuda') || '[]');
    stored.unshift(helpMsg);
    localStorage.setItem('cetep_mensagens_ajuda', JSON.stringify(stored.slice(0, 50)));

    // Try persisting to Firestore if available
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await addDoc(collection(db, 'mensagens_ajuda'), {
        ...helpMsg,
        createdAt: new Date().toISOString()
      });
    } catch {
      // Offline or mock mode
    }
  } catch (err) {
    console.warn('Error saving help message locally:', err);
  }

  return sendEmail({
    to_name: 'Professor Enzo Medeiros (Coordenação CETEP)',
    to_email: 'enzomedeirosdasilva6@gmail.com',
    subject: `[Ajuda & Suporte CETEP] ${data.subject} - ${data.name}`,
    message: `Nova mensagem recebida na Central de Ajuda do CETEP:\n\nRemetente: ${data.name}\nE-mail do Remetente: ${data.email}${data.matricula ? `\nMatrícula: ${data.matricula}` : ''}\nAssunto: ${data.subject}\n\nMensagem:\n${data.message}\n\nEncaminhado diretamente para: enzomedeirosdasilva6@gmail.com`,
    type: 'support'
  });
};

