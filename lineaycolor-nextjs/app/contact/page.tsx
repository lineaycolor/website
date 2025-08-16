export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-8">
          Get in Touch
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
          <div>
            <h2 className="text-2xl font-serif mb-4">Contact Information</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Email:</strong> hello@lineaycolor.com
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Address:</strong><br />
                123 Fashion Avenue<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-serif mb-4">Business Hours</h2>
            <div className="space-y-2 text-gray-600">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-serif mb-2">Customer Service</h3>
              <p className="text-gray-600">
                For questions about orders, returns, or general inquiries, 
                please email support@lineaycolor.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}