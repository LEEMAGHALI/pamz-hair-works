# Pamz Hair Works application

## Install and run
1. Extract this folder.
2. Open it in VS Code.
3. In the terminal, run `npm install`.
4. Create `.env.local` in the project root using `.env.example` as a guide.
5. Add your Supabase project URL and publishable key.
6. Run `npm run dev`.

## Business information and media added from the previous Pamz website
- Address: 12 St Andrews Court, Shopping Arcade, Bolton, Lancashire, BL1 1LD
- Phone / WhatsApp: +44 7368 420613
- Email: pamzhairworks@gmail.com
- Opening hours: Monday–Saturday, 9:00am–5:00pm; Sunday closed
- Instagram: https://www.instagram.com/phworkz
- Facebook: https://www.facebook.com/share/14hhxfp5Pq5/?mibextid=wwXIfr
- TikTok: https://www.tiktok.com/@pamzhairworks
- Brand logo, salon interior photographs, reception photo, service imagery and Atomy product imagery have been copied into `public/images/`.

## Included
- Responsive UK salon website in warm ivory, espresso, muted olive and soft rose
- Services and product catalogues connected to Supabase (with temporary fallback demo content)
- Customer registration and login
- Appointment request form with a 30% deposit calculation
- Customer appointment history
- Local shopping bag
- Basic manager view for appointments, products and services

## Important: development MVP, not production-ready
- Appointment requests are not confirmed bookings. The form creates a pending request only.
- The preferred time picker does not check live availability or prevent double-booking. Do not accept live public bookings until server-side slot locking and overlap protection are added.
- Worldpay payment checkout, signed webhook verification, refunds and remaining-balance collection are not implemented.
- Cart checkout, order creation, stock reservation and delivery pricing are not implemented.
- WhatsApp Business Platform messages and approved templates are not implemented.
- The fallback service names, prices and durations in `src/App.jsx` are development examples and must be confirmed by the salon before launch. Product cards currently show enquiry-only pricing until the manager adds confirmed product prices in Supabase.
- Manager access must be assigned manually using `supabase/manager-setup.sql` after registration. Do not expose a service-role key in the browser.
- Configure Supabase Auth email confirmation and redirect URLs before launch.
