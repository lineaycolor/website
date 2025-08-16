import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}));

describe('Hero Component', () => {
  it('renders the hero section with correct content', () => {
    render(<Hero />);
    
    // Check for main heading
    expect(screen.getByText('Elegance Redefined')).toBeInTheDocument();
    
    // Check for tagline
    expect(screen.getByText('Minimalist fashion that makes a statement')).toBeInTheDocument();
    
    // Check for CTA buttons
    expect(screen.getByText('Shop Collection')).toBeInTheDocument();
    expect(screen.getByText('Our Story')).toBeInTheDocument();
  });

  it('has correct section id for navigation', () => {
    const { container } = render(<Hero />);
    const heroSection = container.querySelector('#home');
    expect(heroSection).toBeInTheDocument();
  });

  it('renders with gradient background class', () => {
    const { container } = render(<Hero />);
    const gradientElement = container.querySelector('.gradient-bg');
    expect(gradientElement).toBeInTheDocument();
  });

  it('renders floating shapes', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('.shape-1')).toBeInTheDocument();
    expect(container.querySelector('.shape-2')).toBeInTheDocument();
    expect(container.querySelector('.shape-3')).toBeInTheDocument();
  });

  it('renders scroll indicator', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('.scroll-indicator')).toBeInTheDocument();
  });
});