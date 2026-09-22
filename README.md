<div align="center">

# 🌐 Hermex Storefront Website
### Customer Storefront, Faceted Filters & Real-Time SSE Order Tracker

[ **English** ] &nbsp;•&nbsp; [ [Українська](README.ua.md) ] &nbsp;•&nbsp; [ [System Overview](../overview/README.md) ] &nbsp;•&nbsp; [ [Visual Showcase](../overview/frontend-showcase.md) ]

<p align="center">
  Next.js 14.2 (:3000) &bull; Tailwind CSS &bull; Zustand 5 &bull; SSE Live Tracking
</p>

</div>

> **Hermex Website** is the consumer storefront for electronics and tech retail.  
> It features intelligent sidebar faceted filtering, client-side Zustand cart with automatic batch validation healing, checkout with idempotency keys, bilingual support (UA/EN), and a real-time order tracking timeline powered by Server-Sent Events (SSE).

---

## 📸 Visual Showcase & UI Gallery

Detailed component breakdowns and screenshots:  
👉 **[Hermex Frontend Showcase](../overview/frontend-showcase.md)**

---

## 🏛️ Application Structure

```text
src/
├── app/
│   ├── layout.tsx             # Root layout, fonts, providers
│   ├── page.tsx               # Storefront home, Hero banner, catalog
│   ├── products/[id]/page.tsx # Product detail view
│   ├── cart/page.tsx          # Fullscreen cart
│   ├── checkout/page.tsx      # Checkout form & contacts
│   └── orders/[id]/page.tsx   # Live SSE order status tracker
├── components/
│   ├── layout/
│   │   ├── navbar.tsx         # Navigation, search, i18n & auth
│   │   └── footer.tsx         # Footer, brands, trust badges
│   ├── catalog/
│   │   ├── product-card.tsx   # Product card with UAH pricing
│   │   └── sidebar-filters.tsx# Staged draft sidebar filters
│   ├── cart/
│   │   └── cart-drawer.tsx    # Slide-over cart with batch verification
│   └── order/
│       └── live-order-status.tsx # SSE connection to API Gateway
├── lib/
│   ├── api/                   # HTTP client for API Gateway (:4000)
│   ├── store/
│   │   ├── use-cart-store.ts  # Zustand cart store (localStorage)
│   │   └── use-user-store.ts  # User session & auth store
│   └── utils/
│       └── specs.ts           # Hardware specs parser
```

---

## ✨ Key Features

### 1. Sidebar Faceted Filters (`SidebarFilters`)
- **Isolated Scroll Container:** Independent scrolling prevents catalog layout stretching.
- **Staged Draft State:** Checkboxes update local draft state without triggering premature network fetches.
- **Interactive Apply Counter:** Dynamically shows matching product count: `Apply (9 items found)`.
- **Dynamic Facets:** Price slider, brands (Apple, Samsung, Asus, Dell, Sony...), and hardware specifications (CPU, RAM, SSD).

### 2. Shopping Cart Store (`useCartStore`) & Stale Data Healing
- Client-side first Zustand architecture with `localStorage` persistence and hydration guards.
- **Batch Validation (`POST /api/v1/cart/validate`):** Verifies current inventory and pricing upon opening the cart.
- Free express courier delivery progress bar upon reaching 2,000 UAH.

### 3. Checkout & Payment Gateway Handoff
- Customer contacts and shipping methods (Nova Poshta / Courier).
- Unique `X-Idempotency-Key` (UUIDv4) generation protecting against double charges.
- Seamless redirection to the isolated hosted payment portal on `/pay/:orderId`.

### 4. Live Order Tracker (Server-Sent Events)
- Real-time stream from `GET /api/v1/orders/:id/live`.
- Reactive timeline status transitions: `PENDING` ➔ `CONFIRMED` or `CANCELLED`.
- Automatic exponential backoff reconnects upon connection loss.

### 5. Internationalization (i18n)
- Runtime switching between Ukrainian (`UA`) and English (`EN`) with persistent preferences.

---

## ⚙️ Environment Variables (`.env.local`)

| Variable | Type | Default | Description |
| :--- | :---: | :---: | :--- |
| `NEXT_PUBLIC_API_URL` | string | `http://localhost:4000` | API Gateway base URL |
| `NEXT_PUBLIC_PAYMENT_PORTAL_URL`| string | `http://localhost:3001` | Payment Portal base URL |

---

## 🛠️ Run & Deployment

```bash
# Install dependencies
bun install

# Start development server on port 3000
bun dev

# Build production bundle
bun run build

# Start production server
bun start
```
