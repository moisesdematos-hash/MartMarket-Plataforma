// ==============================================================================
// MARTMARKET GLOBAL TYPE DEFINITIONS
// ==============================================================================

export type UserRole = 
  | 'VISITOR' 
  | 'BUYER' 
  | 'CREATOR' 
  | 'AFFILIATE' 
  | 'CREATOR_AFFILIATE' 
  | 'SUPPORT' 
  | 'MODERATOR' 
  | 'FINANCE' 
  | 'ADMIN' 
  | 'SUPER_ADMIN';

export type SupportedLanguage = 'pt' | 'en' | 'fr' | 'es';
export type SupportedCurrency = 'AOA' | 'USD' | 'EUR' | 'BRL' | 'GBP' | 'ZAR';
export type ThemeMode = 'light' | 'dark' | 'system';

export type ProductType = 
  | 'ebook' 
  | 'course' 
  | 'video' 
  | 'audio' 
  | 'document' 
  | 'template' 
  | 'software' 
  | 'community'
  | 'mentorship'
  | 'service' 
  | 'custom';

export type OrderStatus = 
  | 'draft' 
  | 'pending' 
  | 'payment_pending' 
  | 'paid' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded' 
  | 'cancelled';

export type LedgerType = 
  | 'credit' 
  | 'debit' 
  | 'platform_fee' 
  | 'affiliate_commission' 
  | 'creator_revenue' 
  | 'refund' 
  | 'adjustment' 
  | 'withdrawal';

export type WithdrawalStatus = 
  | 'pending' 
  | 'approved' 
  | 'processing' 
  | 'paid' 
  | 'rejected' 
  | 'cancelled';

export interface UserProfile {
  id: string;
  kycStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  documentUrl?: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  country: string;
  language: SupportedLanguage;
  currency: SupportedCurrency;
  role: UserRole;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: Record<SupportedLanguage, string>;
  icon: string;
  sortOrder: number;
}

export interface ProductFile {
  id: string;
  productId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  version?: string;
  downloadCount: number;
  createdAt: string;
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  durationSeconds: number;
  attachmentUrl?: string;
  attachmentName?: string;
  isFreePreview: boolean;
  sortOrder: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  sortOrder: number;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  productId: string;
  creatorId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  certificateEnabled: boolean;
  modules: CourseModule[];
}

export interface Product {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  categoryId: string;
  categorySlug: string;
  productType: ProductType;
  coverImage: string;
  bannerImage?: string;
  status: 'draft' | 'published' | 'under_review' | 'suspended';
  isPublished: boolean;
  defaultPrice: number;
  currency: SupportedCurrency;
  refundDays: number;
  
  // Affiliate configuration
  affiliateEnabled: boolean;
  affiliateCommissionRate: number; // e.g. 40 (%)
  affiliateApprovalType: 'instant' | 'manual';
  isSponsored?: boolean;
  
  // Order Bump configuration
  bumpEnabled: boolean;
  bumpTitle?: string;
  bumpDescription?: string;
  bumpPrice?: number;
  
  // Delivery config
  webhookUrl?: string;
  downloadUrl?: string;
  features?: string[];
  
  files?: ProductFile[];
  course?: Course;
  
  totalSales: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  creatorId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  currentUses: number;
  minOrderAmount?: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerCountry: string;
  creatorId: string;
  productId: string;
  productTitle: string;
  productCoverImage: string;
  productType: ProductType;
  affiliateId?: string;
  
  subtotal: number;
  discount: number;
  platformFee: number;
  affiliateFee: number;
  creatorNet: number;
  total: number;
  currency: SupportedCurrency;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  
  couponCode?: string;
  bumpAdded: boolean;
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentDetails {
  provider: string;
  transactionId?: string;
  referenceNumber?: string;
  entityCode?: string; // Multicaixa Reference entity
  expressPhone?: string;
  instructions?: string;
  expiresAt?: string;
  paidAt?: string;
}

export interface UserWallet {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: SupportedCurrency;
  totalWithdrawn: number;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  userId: string;
  orderId?: string;
  type: LedgerType;
  amount: number;
  currency: SupportedCurrency;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface PayoutMethod {
  id: string;
  userId: string;
  methodType: 'angola_iban' | 'multicaixa_express' | 'sepa_iban' | 'wire_swift';
  bankName: string;
  accountHolder: string;
  ibanOrAccount: string;
  swiftBic?: string;
  phoneNumber?: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  payoutMethodId: string;
  payoutDetails: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: SupportedCurrency;
  status: WithdrawalStatus;
  adminNote?: string;
  processedAt?: string;
  createdAt: string;
}

export interface AffiliateLink {
  id: string;
  affiliateId: string;
  productId: string;
  code: string;
  clicksCount: number;
  conversionsCount: number;
  totalCommission: number;
  currency: SupportedCurrency;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'sale' | 'commission' | 'withdrawal' | 'security' | 'course' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId?: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  watchedSeconds: number;
  completedAt?: string;
}
