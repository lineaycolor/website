import Link from "next/link";

export default function Footer() {
  const socialLinks = [
    { href: "https://twitter.com", label: "Twitter", icon: "𝕏" },
    { href: "https://instagram.com", label: "Instagram", icon: "📷" },
    { href: "https://facebook.com", label: "Facebook", icon: "f" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm tracking-wider opacity-80">
            © {currentYear} Lineaycolor. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label={link.label}
              >
                <span className="text-sm font-medium">{link.icon}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}