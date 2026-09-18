-- ==============================================================================
-- MARTMARKET SUPABASE POSTGRESQL SCHEMA
-- Defines the scalable foundation of the marketplace with Row Level Security.
-- ==============================================================================

-- 1. USERS PROFILE
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  country TEXT DEFAULT 'AO',
  language TEXT DEFAULT 'pt',
  currency TEXT DEFAULT 'AOA',
  role TEXT DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'CREATOR', 'CREATOR_AFFILIATE', 'AFFILIATE', 'ADMIN')),
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone (for public creator pages)
CREATE POLICY "Profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile." ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Users can update own profile
CREATE POLICY "Users can update own profile." ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- 2. PRODUCTS
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('course', 'ebook', 'template', 'community', 'software')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT NOT NULL,
  cover_image TEXT,
  banner_image TEXT,
  category_id TEXT NOT NULL,
  webhook_url TEXT,
  download_url TEXT,
  features JSONB,
  
  default_price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AOA',
  
  is_published BOOLEAN DEFAULT false,
  refund_days INTEGER DEFAULT 7,
  
  affiliate_enabled BOOLEAN DEFAULT false,
  affiliate_commission_rate NUMERIC DEFAULT 0,
  
  total_sales INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can see published products
CREATE POLICY "Published products are viewable by everyone" ON products FOR SELECT USING (is_published = true);
-- Creators can see all their own products
CREATE POLICY "Creators can see their own products" ON products FOR SELECT USING (auth.uid() = creator_id);
-- Creators can insert products
CREATE POLICY "Creators can insert products" ON products FOR INSERT WITH CHECK (auth.uid() = creator_id);
-- Creators can update own products
CREATE POLICY "Creators can update own products" ON products FOR UPDATE USING (auth.uid() = creator_id);
-- Admins can update any product
CREATE POLICY "Admins can update any product" ON products FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- 3. ORDERS
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  buyer_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  creator_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  affiliate_id UUID REFERENCES public.user_profiles(id),
  
  amount_total NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  
  creator_net NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL,
  affiliate_commission NUMERIC DEFAULT 0,
  
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  payment_method TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Buyers can see their own orders
CREATE POLICY "Buyers can see their own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id);
-- Creators can see orders for their products
CREATE POLICY "Creators can see their product orders" ON orders FOR SELECT USING (auth.uid() = creator_id);
-- Affiliates can see orders they referred
CREATE POLICY "Affiliates can see referred orders" ON orders FOR SELECT USING (auth.uid() = affiliate_id);

-- 4. WALLET LEDGER
CREATE TABLE public.wallet_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sale', 'commission', 'withdrawal', 'fee', 'refund')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'available', 'processing', 'completed', 'cancelled')),
  reference_id UUID, -- Can link to order_id or withdrawal_id
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;

-- Users can see their own ledger entries
CREATE POLICY "Users can see own ledger entries" ON wallet_ledger FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own ledger entries (Withdrawal Requests only)
CREATE POLICY "Users can insert own ledger entries" ON wallet_ledger FOR INSERT WITH CHECK (auth.uid() = user_id AND type = 'withdrawal');

-- Admins can view and update ledger entries (To approve withdrawals)
CREATE POLICY "Admins can see all ledger entries" ON wallet_ledger FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Admins can update ledger entries" ON wallet_ledger FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ==============================================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Function to handle new user signup and create profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
