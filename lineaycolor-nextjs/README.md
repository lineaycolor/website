# Lineaycolor - Next.js Fashion E-commerce Platform

A modern, high-performance fashion e-commerce website built with Next.js 14, TypeScript, and Tailwind CSS. This project is a complete migration from a static HTML/CSS/JS website to a full-featured React-based application.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Stunning Animations**: Gradient backgrounds and smooth transitions using Framer Motion
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Performance Optimized**: Image optimization with Next.js Image component
- **SEO Ready**: Full meta tag support and structured data
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Playfair Display & Raleway (Google Fonts)

## 📁 Project Structure

```
lineaycolor-nextjs/
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Home page
│   ├── globals.css      # Global styles and animations
│   ├── about/           # About page
│   └── contact/         # Contact page
├── components/          # React components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── sections/       # Page sections (Hero, Collections, Newsletter)
│   └── ui/             # Reusable UI components
├── public/             # Static assets
│   └── images/         # Product and hero images
└── hooks/              # Custom React hooks
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd lineaycolor-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Key Components

### Layout Components
- **Header**: Fixed navigation with mobile menu support
- **Footer**: Social links and copyright information

### Section Components
- **Hero**: Animated gradient background with floating shapes
- **Collections**: Product grid with hover effects
- **Newsletter**: Email subscription with form validation

## 🚦 Migration Notes

This project was migrated from a static HTML website with three variations:
1. Classic minimalist design (index.html)
2. Modern gradient design (index-v2.html)
3. Enhanced accessibility version (index-improved.html)

The Next.js version combines the best features from all three:
- Gradient animations from v2
- Accessibility features from improved version
- Clean aesthetic from the original

## 🔧 Configuration

### Tailwind Config
Custom colors, fonts, and animations are defined in `tailwind.config.ts`.

### Environment Variables
No environment variables are required for basic operation.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Future Enhancements

- E-commerce functionality (cart, checkout)
- User authentication
- Product detail pages
- Search and filtering
- Progressive Web App features
- Analytics integration

## 📄 License

This project is proprietary to Lineaycolor.

## 🤝 Contributing

Please contact the development team before making any contributions.

---

Built with ❤️ using Next.js and modern web technologies.
