import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '../lib/config';

// Floating WhatsApp support button.
export default function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105"
    >
      <MessageCircle size={26} fill="white" />
    </a>
  );
}
