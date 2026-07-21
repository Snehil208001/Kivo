import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { MOCK_CHECKOUT_URL } from '../lib/cart';

// ISO 3166-2:IN subdivision codes Shopify expects for India.
const INDIAN_STATES = [
  { code: 'AN', name: 'Andaman and Nicobar Islands' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CH', name: 'Chandigarh' },
  { code: 'CT', name: 'Chhattisgarh' },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: 'DL', name: 'Delhi' },
  { code: 'GA', name: 'Goa' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'LA', name: 'Ladakh' },
  { code: 'LD', name: 'Lakshadweep' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  { code: 'OR', name: 'Odisha' },
  { code: 'PY', name: 'Puducherry' },
  { code: 'PB', name: 'Punjab' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TS', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'WB', name: 'West Bengal' },
];

const EMPTY = {
  fullName: '',
  phone: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  provinceCode: '',
  zip: '',
};

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

/** Normalize Indian mobile to E.164 (+91XXXXXXXXXX). */
function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91${digits.slice(1)}`;
  }
  return null;
}

function validate(form) {
  const errors = {};
  if (!form.fullName.trim() || form.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name';
  }
  if (!normalizePhone(form.phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email';
  }
  if (!form.address1.trim() || form.address1.trim().length < 5) {
    errors.address1 = 'Enter your street address';
  }
  if (!form.city.trim()) errors.city = 'Enter city';
  if (!form.provinceCode) errors.provinceCode = 'Select state';
  if (!/^\d{6}$/.test(form.zip.trim())) {
    errors.zip = 'Enter a 6-digit PIN code';
  }
  return errors;
}

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-accent/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary';

export default function CheckoutDetails() {
  const navigate = useNavigate();
  const cart = useCartStore((s) => s.cart);
  const loading = useCartStore((s) => s.loading);
  const hydrated = useCartStore((s) => s.hydrated);
  const prepareCheckout = useCartStore((s) => s.prepareCheckout);
  const closeCart = useCartStore((s) => s.closeCart);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  useEffect(() => {
    if (!hydrated) return;
    if (!cart?.totalQuantity) {
      navigate('/shop', { replace: true });
    }
  }, [hydrated, cart?.totalQuantity, navigate]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const { firstName, lastName } = splitName(form.fullName);
    const phone = normalizePhone(form.phone);

    try {
      const checkoutUrl = await prepareCheckout({
        email: form.email.trim(),
        phone,
        firstName,
        lastName,
        address1: form.address1.trim(),
        address2: form.address2.trim() || undefined,
        city: form.city.trim(),
        provinceCode: form.provinceCode,
        zip: form.zip.trim(),
        countryCode: 'IN',
      });

      if (!checkoutUrl || checkoutUrl === MOCK_CHECKOUT_URL) {
        alert(
          'Demo mode: this would open Shopify checkout with your address and phone prefilled.\n\n' +
            'Connect Shopify in .env to complete real COD / Razorpay payment.'
        );
        return;
      }
      window.location.href = checkoutUrl;
    } catch (err) {
      setSubmitError(err.message || 'Could not continue to payment. Please try again.');
    }
  }

  if (!hydrated || !cart?.totalQuantity) {
    return (
      <div className="container-page py-16 text-center text-sm text-accent/60">
        Loading checkout…
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl py-8 sm:py-12">
      <div className="mb-6">
        <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
          ← Back to shop
        </Link>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
          Delivery details
        </h1>
        <p className="mt-2 text-sm text-accent/60 sm:text-base">
          Phone is required so the delivery partner can reach you. You’ll confirm
          COD or Razorpay on the next secure Shopify page.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-card">
        <div className="flex items-center gap-2 text-sm text-accent/70">
          <Truck size={16} className="text-primary" />
          {cart.totalQuantity} item{cart.totalQuantity === 1 ? '' : 's'} in cart
        </div>
        <div className="text-right">
          <p className="text-xs text-accent/50">Subtotal</p>
          <p className="font-display text-lg font-extrabold text-accent">
            {cart.totalFormatted || cart.subtotalFormatted}
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"
        noValidate
      >
        <div>
          <label className="text-sm font-semibold text-accent" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => setField('fullName', e.target.value)}
            className={fieldClass}
            placeholder="As on the package"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-accent" htmlFor="phone">
              Mobile number
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-accent/50">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) =>
                  setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                }
                className={`${fieldClass} mt-0 pl-12`}
                placeholder="10-digit mobile"
                required
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-accent" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              className={fieldClass}
              placeholder="For order updates"
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-accent" htmlFor="address1">
            Address
          </label>
          <input
            id="address1"
            autoComplete="address-line1"
            value={form.address1}
            onChange={(e) => setField('address1', e.target.value)}
            className={fieldClass}
            placeholder="House no., street, landmark"
            required
          />
          {errors.address1 && (
            <p className="mt-1 text-xs text-red-600">{errors.address1}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-accent" htmlFor="address2">
            Apartment / area{' '}
            <span className="font-normal text-accent/40">(optional)</span>
          </label>
          <input
            id="address2"
            autoComplete="address-line2"
            value={form.address2}
            onChange={(e) => setField('address2', e.target.value)}
            className={fieldClass}
            placeholder="Flat, floor, colony"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="text-sm font-semibold text-accent" htmlFor="city">
              City
            </label>
            <input
              id="city"
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => setField('city', e.target.value)}
              className={fieldClass}
              required
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-600">{errors.city}</p>
            )}
          </div>
          <div>
            <label
              className="text-sm font-semibold text-accent"
              htmlFor="provinceCode"
            >
              State
            </label>
            <select
              id="provinceCode"
              autoComplete="address-level1"
              value={form.provinceCode}
              onChange={(e) => setField('provinceCode', e.target.value)}
              className={fieldClass}
              required
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.provinceCode && (
              <p className="mt-1 text-xs text-red-600">{errors.provinceCode}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-accent" htmlFor="zip">
              PIN code
            </label>
            <input
              id="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              value={form.zip}
              onChange={(e) =>
                setField('zip', e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              className={fieldClass}
              placeholder="6 digits"
              required
            />
            {errors.zip && (
              <p className="mt-1 text-xs text-red-600">{errors.zip}</p>
            )}
          </div>
        </div>

        <p className="rounded-xl bg-primary-light/60 px-3 py-2.5 text-xs text-accent/70">
          Country: <span className="font-semibold text-accent">India</span> · Delivery
          partner will call the mobile number you enter above.
        </p>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary btn-lg btn-block"
        >
          <ShieldCheck size={18} />
          {loading ? 'Preparing checkout…' : 'Continue to payment'}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>
    </div>
  );
}
