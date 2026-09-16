-- ==============================================================================
-- MARTMARKET ENTERPRISE POSTGRESQL / SUPABASE MIGRATION SCRIPT
-- COMPLETE ECOSYSTEM SCHEMA WITH RLS, LEDGER, RBAC, AND ATOMIC PROCEDURES
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role_enum AS ENUM (
  'VISITOR', 'BUYER', 'CREATOR', 'AFFILIATE', 'CREATOR_AFFILIATE', 
  'SUPPORT', 'MODERATOR', 'FINANCE', 'ADMIN', 'SUPER_ADMIN'
);

CREATE TYPE product_type_enum AS ENUM (
  'ebook', 'course', 'video', 'audio', 'document', 'template', 'software', 'community', 'custom'
);

CREATE TYPE order_status_enum AS ENUM (
  'draft', 'pending', 'payment_pending', 'paid', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
);

CREATE TYPE payment_status_enum AS ENUM (
  'pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'
);

CREATE TYPE ledger_type_enum AS ENUM (
  'credit', 'debit', 'platform_fee', 'affiliate_commission', 'creator_revenue', 'refund', 'adjustment', 'withdrawal'
);

CREATE TYPE withdrawal_status_enum AS ENUM (
  'pending', 'approved', 'processing', 'paid', 'rejected', 'cancelled'
);

-- 2. PROFILES & RBAC
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  country TEXT DEFAULT 'AO',
  language TEXT DEFAULT 'pt',
  currency TEXT DEFAULT 'AOA',
  role user_role_enum DEFAULT 'CREATOR_AFFILIATE',
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_pt TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_es TEXT NOT NULL,
  icon TEXT DEFAULT 'Layers',
  sort_order INT DEFAULT 0
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  category_id UUID REFERENCES public.product_categories(id),
  product_type product_type_enum DEFAULT 'course',
  cover_image TEXT,
  banner_image TEXT,
  status TEXT DEFAULT 'published',
  is_published BOOLEAN DEFAULT TRUE,
  default_price NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'AOA',
  refund_days INT DEFAULT 7,
  
  -- Affiliate settings
  affiliate_enabled BOOLEAN DEFAULT TRUE,
  affiliate_commission_rate NUMERIC(5, 2) DEFAULT 40.00, -- e.g. 40%
  affiliate_approval_type TEXT DEFAULT 'instant', -- instant or manual
  
  -- Order Bump settings
  bump_enabled BOOLEAN DEFAULT FALSE,
  bump_title TEXT,
  bump_description TEXT,
  bump_price NUMERIC(14, 2) DEFAULT 0.00,
  
  total_sales INT DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCT DIGITAL FILES
CREATE TABLE IF NOT EXISTS public.product_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  version TEXT DEFAULT '1.0',
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COURSES & LMS STRUCTURE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID UNIQUE NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  certificate_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_seconds INT DEFAULT 0,
  attachment_url TEXT,
  attachment_name TEXT,
  is_free_preview BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  certificate_url TEXT,
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  watched_seconds INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 7. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
  discount_value NUMERIC(10, 2) NOT NULL,
  max_uses INT DEFAULT 100,
  current_uses INT DEFAULT 0,
  min_order_amount NUMERIC(10, 2) DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, code)
);

-- 8. ORDERS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  buyer_country TEXT DEFAULT 'AO',
  creator_id UUID NOT NULL REFERENCES public.profiles(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  affiliate_id UUID REFERENCES public.profiles(id),
  
  subtotal NUMERIC(14, 2) NOT NULL,
  discount NUMERIC(14, 2) DEFAULT 0.00,
  platform_fee NUMERIC(14, 2) DEFAULT 0.00,
  affiliate_fee NUMERIC(14, 2) DEFAULT 0.00,
  creator_net NUMERIC(14, 2) NOT NULL,
  total NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AOA',
  
  coupon_code TEXT,
  bump_added BOOLEAN DEFAULT FALSE,
  payment_method TEXT NOT NULL, -- 'multicaixa_express', 'bank_reference', 'unitel_money', 'card', 'wire'
  payment_status payment_status_enum DEFAULT 'pending',
  order_status order_status_enum DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PAYMENTS & IDEMPOTENCY
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_provider TEXT NOT NULL,
  provider_transaction_id TEXT,
  amount NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL,
  status payment_status_enum DEFAULT 'pending',
  payment_details JSONB DEFAULT '{}'::jsonb,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PRODUCT ACCESS GRANTED TO BUYERS
CREATE TABLE IF NOT EXISTS public.product_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  status TEXT DEFAULT 'active',
  access_granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 11. FINANCIAL WALLET & DOUBLE-ENTRY LEDGER
CREATE TABLE IF NOT EXISTS public.user_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  available_balance NUMERIC(14, 2) DEFAULT 0.00,
  pending_balance NUMERIC(14, 2) DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'AOA',
  total_withdrawn NUMERIC(14, 2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financial_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  type ledger_type_enum NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL,
  balance_after NUMERIC(14, 2) NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAYOUT METHODS & WITHDRAWALS
CREATE TABLE IF NOT EXISTS public.payout_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL, -- 'angola_iban', 'multicaixa_express', 'sepa_iban', 'wire_swift'
  bank_name TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  iban_or_account TEXT NOT NULL,
  swift_bic TEXT,
  phone_number TEXT,
  is_default BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payout_method_id UUID REFERENCES public.payout_methods(id),
  amount NUMERIC(14, 2) NOT NULL,
  fee NUMERIC(14, 2) DEFAULT 0.00,
  net_amount NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AOA',
  status withdrawal_status_enum DEFAULT 'pending',
  admin_note TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AFFILIATE LINKS & TRACKING
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  custom_slug TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  clicks_count INT DEFAULT 0,
  conversions_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(affiliate_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_link_id UUID NOT NULL REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  visitor_ip_hash TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  commission_amount NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. REVIEWS
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'sale', 'commission', 'withdrawal', 'security', 'course'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Public can read published products, creator can CRUD
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "Creators can manage their products" ON public.products FOR ALL USING (auth.uid() = creator_id);

-- Orders: Buyer and Creator can view their orders
CREATE POLICY "Users can view their own purchases" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Creators can view sales for their products" ON public.orders FOR SELECT USING (auth.uid() = creator_id);

-- Product Access: Enrolled buyers can view
CREATE POLICY "Buyers can view their product access" ON public.product_access FOR SELECT USING (auth.uid() = user_id);

-- Wallets & Ledger: Private to user
CREATE POLICY "Users can view their wallet" ON public.user_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their financial ledger" ON public.financial_ledger FOR SELECT USING (auth.uid() = user_id);

-- Withdrawals: User can manage own requests
CREATE POLICY "Users can view and create withdrawals" ON public.withdrawals FOR ALL USING (auth.uid() = user_id);

-- Notifications: User can view and update own notifications
CREATE POLICY "Users can view their notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
