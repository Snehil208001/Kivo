import LandingPage from '../../components/LandingPage';

const content = {
  handle: 'eco-bundle',
  theme: 'lime',
  eyebrow: '🌱 Plastic-Free Starter Kit',
  headline: 'Ditch single-use plastic today.',
  sub: 'The KIVO Zero-Waste Kitchen Bundle replaces the plastic you throw away every week — one simple, beautiful kit.',
  benefits: [
    { emoji: '🎋', title: 'Bamboo & Steel', copy: 'Durable, natural materials built to last for years, not weeks.' },
    { emoji: '🌍', title: 'Cut Your Waste', copy: 'Replaces hundreds of single-use plastic items per year.' },
    { emoji: '📦', title: 'Plastic-Free Packaging', copy: 'Even the box is compostable. Zero guilt, all the way through.' },
  ],
  features: [
    'Bamboo cutlery & utensil set',
    'Reusable produce & grocery bags',
    'Beeswax food wraps (set of 3)',
    'Stainless steel straws + cleaning brush',
    'Fully compostable, plastic-free packaging',
    'Cash on Delivery + 7-day returns',
  ],
  reviews: [
    { name: 'Aditya', text: 'Replaced almost all our kitchen plastic in one order. Beeswax wraps are a game changer.' },
    { name: 'Nisha', text: 'Gifted one to my sister too. Quality is lovely and it actually cuts our waste.' },
    { name: 'Rohan', text: 'Great value bundle and the packaging really is plastic-free. Paid on delivery.' },
  ],
  faqs: [
    { q: 'How do I clean the beeswax wraps?', a: 'Rinse with cool water and mild soap, air dry, and reuse. Each wrap lasts up to a year.' },
    { q: 'Is everything really plastic-free?', a: 'Yes — the products and the packaging are all plastic-free and compostable or reusable.' },
    { q: 'Do you offer Cash on Delivery?', a: 'Yes, pay in cash on delivery, or use Razorpay at checkout.' },
    { q: 'Can I return the bundle?', a: 'Of course. If it isn\'t right for you, return within 7 days for a full refund.' },
  ],
};

export default function EcoBundle() {
  return <LandingPage content={content} />;
}
