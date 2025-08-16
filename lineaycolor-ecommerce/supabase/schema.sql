-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('summer', 'evening', 'casual')),
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB NOT NULL,
  payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create inventory_transactions table for tracking stock changes
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  order_id UUID REFERENCES orders(id),
  quantity INTEGER NOT NULL,
  transaction_type VARCHAR(20) CHECK (transaction_type IN ('sale', 'restock', 'adjustment')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Insert sample products based on the original website
INSERT INTO products (name, description, price, category, images, sizes, colors, stock, featured) VALUES
('Summer Breeze Dress', 'Light and airy dress perfect for warm summer days', 79.99, 'summer', ARRAY['/images/summer-dress-1.jpg'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['White', 'Sky Blue', 'Coral'], 50, true),
('Beach Ready Romper', 'Stylish romper for your beach getaways', 59.99, 'summer', ARRAY['/images/summer-romper-1.jpg'], ARRAY['S', 'M', 'L'], ARRAY['Navy', 'Floral Print'], 30, true),
('Sunset Maxi Dress', 'Flowing maxi dress with vibrant sunset colors', 89.99, 'summer', ARRAY['/images/summer-maxi-1.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Sunset Gradient'], 25, false),

('Midnight Gala Gown', 'Elegant floor-length gown for special occasions', 299.99, 'evening', ARRAY['/images/evening-gown-1.jpg'], ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black', 'Midnight Blue', 'Burgundy'], 15, true),
('Cocktail Chic Dress', 'Sophisticated cocktail dress with modern cut', 179.99, 'evening', ARRAY['/images/evening-cocktail-1.jpg'], ARRAY['S', 'M', 'L'], ARRAY['Black', 'Emerald'], 20, true),
('Starlight Sequin Dress', 'Dazzling sequin dress that catches every light', 249.99, 'evening', ARRAY['/images/evening-sequin-1.jpg'], ARRAY['XS', 'S', 'M', 'L'], ARRAY['Silver', 'Gold'], 10, false),

('Weekend Comfort Tee', 'Soft organic cotton t-shirt for everyday wear', 39.99, 'casual', ARRAY['/images/casual-tee-1.jpg'], ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Black', 'Gray', 'Navy'], 100, true),
('Urban Denim Jacket', 'Classic denim jacket with modern fit', 89.99, 'casual', ARRAY['/images/casual-denim-1.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Light Wash', 'Dark Wash'], 40, true),
('Everyday Joggers', 'Comfortable joggers for work or play', 59.99, 'casual', ARRAY['/images/casual-joggers-1.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Heather Gray'], 60, false);