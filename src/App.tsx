/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.CORE.SRC.APP.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = App.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/App.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { BrowserRouter } from 'react-router-dom';
import CustomerSite from './apps/CustomerSite';
import { ProductExperienceProvider } from './context/ProductExperienceContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ProductExperienceProvider>
        <CartProvider>
          <CustomerSite />
        </CartProvider>
      </ProductExperienceProvider>
    </BrowserRouter>
  );
}

export default App;
