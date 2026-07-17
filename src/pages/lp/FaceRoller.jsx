import LandingPage from '../../components/LandingPage';

const content = {
  handle: 'ice-roller-jade-face-roller-set',
  theme: 'pink',
  eyebrow: '💆 Viral Skincare Tool',
  headline: 'Depuff & glow in 3 minutes a day.',
  sub: 'The KIVO Ice + Jade Roller set cools, tightens, and sculpts tired skin — your morning ritual, upgraded.',
  benefits: [
    { emoji: '❄️', title: 'Instant Cooling', copy: 'The steel ice roller calms puffiness and morning under-eye bags fast.' },
    { emoji: '💎', title: 'Real Jade Stone', copy: 'Natural jade massages and boosts circulation for a healthy glow.' },
    { emoji: '✨', title: 'Better Absorption', copy: 'Rolls serums and creams deeper into the skin.' },
  ],
  features: [
    'Stainless steel ice roller + natural jade roller',
    'De-puffs, tightens & soothes skin',
    'Boosts circulation and product absorption',
    'Ergonomic no-slip handles',
    'Comes with a reusable storage pouch',
    'Cash on Delivery + 7-day returns',
  ],
  reviews: [
    { name: 'Sneha', text: 'My under-eyes have never looked better. The ice roller in the morning is addictive.' },
    { name: 'Meera', text: 'Feels spa-level. Jade roller after my night serum has genuinely improved my skin.' },
    { name: 'Kavya', text: 'Beautiful quality for the price. COD made it an easy yes.' },
  ],
  faqs: [
    { q: 'How do I use the ice roller?', a: 'Keep it in the freezer for 30 minutes, then roll gently across your face for 2–3 minutes. Wipe dry and store.' },
    { q: 'Is the jade stone genuine?', a: 'Yes, each roller uses natural jade. Slight variations in color and pattern are normal and confirm authenticity.' },
    { q: 'Can I pay Cash on Delivery?', a: 'Yes — pay in cash on arrival, or use Razorpay at checkout.' },
    { q: 'What is the return policy?', a: 'Not satisfied? Return within 7 days for a full refund.' },
  ],
};

export default function FaceRoller() {
  return <LandingPage content={content} />;
}
