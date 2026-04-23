'use client';
import { MessageCircle } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export default function WhatsAppButton() {
  const { lang } = useUIStore();
  return (
    <a
      href="https://wa.me/919999999999?text=🙏 Namaste! I want to know more about Vastu Arya services."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={26} className="text-white" fill="white" />
    </a>
  );
}
