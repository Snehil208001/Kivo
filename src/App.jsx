import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useCartStore } from './store/cartStore';

import Layout from './components/Layout';
import CartSidebar from './components/CartSidebar';

import Home from './pages/Home';
import Shop from './pages/Shop';
import CollectionPage from './pages/CollectionPage';
import Product from './pages/Product';
import NotFound from './pages/NotFound';

// Landing pages (no navbar / footer — conversion focused).
import SpinMop from './pages/lp/SpinMop';
import FaceRoller from './pages/lp/FaceRoller';
import EcoBundle from './pages/lp/EcoBundle';

export default function App() {
  const hydrate = useCartStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Routes>
        {/* Standard storefront with chrome */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections/:handle" element={<CollectionPage />} />
          <Route path="/products/:handle" element={<Product />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Ad landing pages — standalone, no shared chrome */}
        <Route path="/lp/spin-mop" element={<SpinMop />} />
        <Route path="/lp/face-roller" element={<FaceRoller />} />
        <Route path="/lp/eco-bundle" element={<EcoBundle />} />
      </Routes>

      {/* Cart sidebar is global so it works on every route, including LPs. */}
      <CartSidebar />
    </>
  );
}
