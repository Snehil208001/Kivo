import LandingPage from '../../components/LandingPage';

const content = {
  handle: 'spin-mop',
  theme: 'primary',
  eyebrow: '🧽 #1 Bestselling Mop',
  headline: 'Clean floors in half the time.',
  sub: 'The KIVO 360° Spin Mop wrings itself dry — no bending, no wet hands, no mess. Just glide and go.',
  benefits: [
    { emoji: '💪', title: 'Hands-Free Wringing', copy: 'One pedal push wrings the mop dry or damp. Zero touching dirty water.' },
    { emoji: '🌀', title: '360° Spin Reach', copy: 'Gets under furniture and into corners a flat mop never could.' },
    { emoji: '♻️', title: 'Reusable Heads', copy: 'Machine-washable microfiber heads last for months.' },
  ],
  features: [
    'Self-wringing bucket with foot pedal',
    '2 microfiber mop heads included',
    'Picks up 99% of dust, hair & grime',
    'Telescopic stainless steel handle',
    'Safe on tile, wood, marble & laminate',
    'Cash on Delivery + 7-day returns',
  ],
  reviews: [
    { name: 'Priya', text: 'My back thanks me every day. Mopping used to be a chore, now it takes 5 minutes.' },
    { name: 'Rahul', text: 'The self-wringing bucket is genius. Floors dry streak-free and fast.' },
    { name: 'Anjali', text: 'Ordered with COD, arrived next day. Build quality is way better than I expected.' },
  ],
  faqs: [
    { q: 'Does it work on wooden floors?', a: 'Yes — the microfiber heads are safe on wood, tile, marble, and laminate. Wring to damp for wooden surfaces.' },
    { q: 'Is Cash on Delivery available?', a: 'Absolutely. Pay in cash when your order arrives. We also support Razorpay at checkout.' },
    { q: 'What if I don\'t like it?', a: 'Return it within 7 days for a full refund, no questions asked.' },
    { q: 'How fast is shipping?', a: 'We dispatch within 24 hours and most orders arrive in 2–4 days.' },
  ],
};

export default function SpinMop() {
  return <LandingPage content={content} />;
}
