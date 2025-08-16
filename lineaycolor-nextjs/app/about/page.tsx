export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-8">
          Our Story
        </h1>
        <div className="max-w-3xl">
          <p className="text-lg text-gray-600 mb-6">
            Lineaycolor was born from a simple belief: fashion should be timeless, sustainable, and accessible. 
            Founded in 2020, we set out to create a brand that challenges the fast fashion industry while 
            celebrating minimalist design.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Our collections are carefully curated, focusing on quality over quantity. Each piece is designed 
            to be a staple in your wardrobe, transcending seasonal trends and lasting for years to come.
          </p>
          <p className="text-lg text-gray-600">
            We believe in transparency, ethical production, and the power of simplicity. Join us in redefining 
            what fashion means in the modern world.
          </p>
        </div>
      </div>
    </div>
  );
}