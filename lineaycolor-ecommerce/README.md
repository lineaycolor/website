# Lineaycolor E-commerce Platform

A modern, full-featured e-commerce platform for fashion retail built with Next.js, TypeScript, Supabase, and Stripe.

## Features

- **Product Catalog**: Browse products by category (Summer, Evening, Casual)
- **Product Details**: View product images, descriptions, sizes, and colors
- **Shopping Cart**: Add items, update quantities, persistent cart storage
- **Checkout Process**: Secure payment processing with Stripe
- **Inventory Management**: Real-time stock tracking
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Payments**: Stripe
- **Deployment**: Optimized for Vercel

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file based on `.env.local.example`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql`

5. Configure Stripe:
   - Create a Stripe account
   - Add webhook endpoint for `/api/webhooks/stripe`

6. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
lineaycolor-ecommerce/
├── app/
│   ├── api/          # API routes
│   ├── cart/         # Cart page
│   ├── checkout/     # Checkout flow
│   ├── components/   # Reusable components
│   ├── lib/          # Utilities and configurations
│   ├── products/     # Product pages
│   └── page.tsx      # Home page
├── public/           # Static assets
├── supabase/         # Database schema
└── package.json      # Dependencies
```

## API Endpoints

- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details
- `POST /api/checkout` - Create checkout session
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details

## Future Enhancements

- User authentication and accounts
- Order history and tracking
- Product reviews and ratings
- Advanced search and filtering
- Admin dashboard
- Email notifications
- Wishlist functionality

## License

MIT