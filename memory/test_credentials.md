# Test Credentials — Vastu Arya (local pod only)

These credentials exist **only** on the local test MongoDB used for the Phase E
end-to-end test run. Production databases are untouched.

## Customer user

- **Email:** `e1test@example.com`
- **Password:** `testpass123`
- **Role:** `user`
- Local Mongo DB: `vastuarya_e1_test` (Mongo URL `mongodb://localhost:27017/vastuarya_e1_test`)

## Sample verified Razorpay booking (created during E2E)

- **Booking ID:** `BK1784093080029677`
- **Service:** Home Vastu
- **Amount:** ₹11
- **Razorpay payment_id:** `pay_e1_001`
- **Razorpay order_id:** `order_test`
- **paymentStatus / bookingStatus:** `verified` / `confirmed`

## Admin credentials

Verified working against production Render backend
(`https://vastu-arya-backend-1.onrender.com/api`) on 2026-02-17.

- **Email:** `Vastuarya@Admin.com`
- **Password:** `Admin@2407@`
- **Role:** `admin`
- **Sample real booking for scheduling tests:** `BK1784229269322795`
  (Mongo `_id`: `6a592d95bb74b4ff39a7892b`) — service *Book Appointment*,
  paymentStatus `verified`, bookingStatus `confirmed`.

## Admin default (fallback, from seed.ts)

```
ADMIN_EMAIL      = Vastuarya@Admin.com
ADMIN_PASSWORD   = Admin@2407@
```

## Emergent LLM key

Bundled in `.env` as `EMERGENT_LLM_KEY=sk-emergent-002E481429f5aDdAeC` (Emergent
Universal Key, injected via `emergent_integrations_manager` at build time).
This key enables text + vision AI. Do NOT commit it to a public git repo; the
`.env` file is git-ignored.

## How to reset

```bash
# From /app/backend:
mongosh --quiet vastuarya_e1_test --eval 'db.dropDatabase()'
```

This wipes only the local test DB; production Mongo Atlas is unaffected.
