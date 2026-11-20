# PAM'Z Hair Works

### A modern salon website and management platform

PAM'Z Hair Works is a salon web application designed to improve the customer experience and simplify everyday salon operations.

The platform brings together service discovery, customer accounts, appointment requests, product browsing and basic management functionality in one responsive application.

**Live Website:** https://pamz-hair-works.vercel.app/

---

## Project Overview

The application provides two main experiences:

- **Customers:** Explore salon services and products, create accounts, submit appointment requests and view appointment history.
- **Managers:** Access a management interface for viewing and managing appointments, products and services.

## Features

### Customer Experience
- Responsive salon website.
- Customer registration and authentication.
- Service catalogue connected to Supabase.
- Product catalogue.
- Appointment request form.
- 30% appointment deposit calculation.
- Customer appointment history.
- Shopping bag functionality.

### Management
- Dedicated manager login.
- Appointment management interface.
- Product management.
- Service management.

### Design
- Warm ivory, espresso, muted olive and soft rose colour palette.
- Responsive layouts for desktop and mobile.
- Clean and modern salon-focused interface.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| Vite | Development and build tooling |
| JavaScript | Application functionality |
| CSS | Styling and responsive layouts |
| Supabase | Authentication and database |
| PostgreSQL | Database management |
| Vercel | Deployment |

---

## Getting Started

### Prerequisites
- Node.js
- npm
- A Supabase project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/LEEMAGHALI/pamz-hair-works.git
   ```

2. Navigate into the project:

   ```bash
   cd pamz-hair-works
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create your local environment file using `.env.example` as a guide:

   ```bash
   cp .env.example .env.local
   ```

5. Configure your Supabase project URL and publishable key using the variable names specified in `.env.example`.

6. Start the development server:

   ```bash
   npm run dev
   ```

---

## Project Structure

```text
pamz-hair-works/
├── public/
│   └── images/
├── src/
│   ├── components/
│   ├── pages/
│   └── ...
├── supabase/
│   └── manager-setup.sql
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## Current Development Status

**Status: Development MVP**

The application has working core functionality, but some features require further development before production use.

Current limitations:

- Appointment requests are pending requests, not automatically confirmed bookings.
- Live availability checking and double-booking prevention are not yet implemented.
- Worldpay payment checkout and payment webhook verification are not implemented.
- Remaining-balance collection and refunds are not implemented.
- Shopping bag checkout, order creation, stock reservation and delivery pricing are not implemented.
- WhatsApp Business Platform messaging is not implemented.
- Some fallback service information is demonstration content and requires confirmation from the salon.
- Manager access requires manual assignment through the Supabase setup process.

Production deployment requires appropriate testing, security configuration and completion of the outstanding functionality.

---

## Future Improvements

- Real-time appointment availability.
- Secure online payment integration.
- Automated booking confirmations.
- Complete order and inventory management.
- WhatsApp Business integration.
- Enhanced manager analytics.

---

## Developer

**Halimatu Mohammed Gali**

Software Developer | Frontend • Backend • Full-Stack Development

- GitHub: [@LEEMAGHALI](https://github.com/LEEMAGHALI)
- Instagram: [@halima.builds](https://www.instagram.com/halima._builds)

---

*Building practical digital solutions for real-world businesses.*
