import emailjs from 'emailjs-com';
import { toast } from 'sonner';

// To use this, the user needs to provide these environment variables
// VITE_EMAILJS_SERVICE_ID
// VITE_EMAILJS_TEMPLATE_ID
// VITE_EMAILJS_PUBLIC_KEY

interface EmailParams {
  to_name: string;
  to_email: string;
  subject: string;
  message: string;
  type?: 'urgent' | 'announcement' | 'personal';
}

export const sendEmail = async (params: EmailParams) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Check user preference in localStorage (simple way to sync with Settings)
  const settings = JSON.parse(localStorage.getItem('cetep_settings') || '{}');
  if (settings.emailNotif === false) {
    console.log('Skipping email send: user disabled notifications');
    return { success: true, skipped: true };
  }

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS not configured. Please add VITE_EMAILJS_... keys in Settings menu.');
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
      return { success: true };
    }
    throw new Error('Failed to send email');
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};
