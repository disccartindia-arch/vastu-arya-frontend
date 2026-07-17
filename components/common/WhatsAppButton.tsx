'use client';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a href="https://wa.me/919111036751?text=🙏 Namaste! I want to know more about Vastu Arya services." target="_blank" rel="noopener noreferrer" className="whatsapp-btn" title="Chat on WhatsApp">
      <MessageCircle size={26} className="text-white" fill="white" />
    </a>
  );
}
