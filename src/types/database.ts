export type RoleName = 
  | 'super_admin' 
  | 'ngo_owner' 
  | 'ngo_admin' 
  | 'content_manager' 
  | 'donation_manager' 
  | 'editor' 
  | 'viewer';

export interface NGO {
  id: string;
  slug: string;
  name: string;
  legal_name: string;
  tagline: string;
  short_description: string;
  full_description: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  status: 'active' | 'inactive' | 'maintenance';
  // White-label admin panel branding
  admin_logo_url?: string;
  admin_favicon_url?: string;
  admin_title?: string;
  admin_sidebar_color?: string;
  admin_primary_color?: string;
  admin_button_color?: string;
  custom_domain?: string;
  domains?: string[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface SiteDomain {
  id: string;
  ngo_id: string;
  domain: string;
  is_primary: boolean;
  verified: boolean;
  verification_token?: string;
  verification_type?: 'txt' | 'cname';
  verified_at?: string | null;
  dns_records?: Array<{
    type: 'CNAME' | 'TXT' | 'A';
    host: string;
    value: string;
    status: 'valid' | 'pending' | 'failed';
  }>;
  created_at: string;
  deleted_at?: string | null;
}

export interface SiteSettings {
  id: string;
  ngo_id: string;
  email: string;
  support_email: string;
  phone: string;
  alternate_phone?: string;
  whatsapp_number: string;
  registered_address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  google_maps_url?: string;
  google_maps_embed_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  twitter_url?: string;

  // Legal & Tax
  trust_reg_number: string;
  trust_reg_date: string;
  trust_reg_subregistrar: string;
  pan_number_masked: string;
  section_12a_urn: string;
  section_12a_order_date: string;
  section_12a_validity: string;
  section_80g_urn: string;
  section_80g_order_date: string;
  section_80g_validity: string;
  registration_disclaimer: string;

  // SEO Defaults
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image_url?: string;

  // Currency & Amounts
  currency: string;
  min_donation_amount: number;
  allow_anonymous_donations: boolean;

  deleted_at?: string | null;
}

export interface ImpactStat {
  label: string;
  value: string;
  description: string;
}

export interface HomepageContent {
  id: string;
  ngo_id: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_primary_text: string;
  hero_cta_secondary_text: string;
  hero_image_url: string;
  hero_badge_text: string;

  intro_title: string;
  intro_content: string;

  mission_title: string;
  mission_statement: string;
  mission_icon: string;

  vision_title: string;
  vision_statement: string;
  vision_icon: string;

  impact_stats: ImpactStat[];

  cta_banner_title: string;
  cta_banner_subtitle: string;
  cta_banner_button_text: string;

  deleted_at?: string | null;
}

export interface CustomPage {
  id: string;
  ngo_id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Activity {
  id: string;
  ngo_id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  full_content: string;
  featured_image_url: string;
  gallery_images: string[];
  location: string;
  activity_date: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  deleted_at?: string | null;
}

export interface TeamMember {
  id: string;
  ngo_id: string;
  name: string;
  role: string;
  category: 'trustee' | 'leadership' | 'team' | 'volunteer';
  bio: string;
  image_url: string;
  email?: string;
  linkedin_url?: string;
  display_order: number;
  is_published: boolean;
  deleted_at?: string | null;
}

export interface GalleryItem {
  id: string;
  ngo_id: string;
  title: string;
  caption?: string;
  category: string;
  image_url: string;
  thumbnail_url?: string;
  event_date?: string;
  alt_text?: string;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface DonationPurpose {
  id: string;
  ngo_id: string;
  name: string;
  description: string;
  suggested_amounts: number[];
  is_active: boolean;
  display_order: number;
  deleted_at?: string | null;
}

export interface DonationPaymentSettings {
  id: string;
  ngo_id: string;
  bank_account_name: string;
  bank_name: string;
  bank_account_number: string;
  bank_ifsc: string;
  bank_branch: string;
  upi_id: string;
  upi_payee_name: string;
  qr_code_url: string;
  enable_bank_transfer: boolean;
  enable_qr_code: boolean;
  enable_upi_app: boolean;
  instructions?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Donation {
  id: string;
  ngo_id: string;
  receipt_number: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  donor_pan_masked?: string;
  is_anonymous: boolean;
  amount: number;
  currency: string;
  purpose_id?: string;
  purpose_name: string;
  requires_80g: boolean;
  transaction_ref?: string;
  payment_status: 'created' | 'pending' | 'captured' | 'failed' | 'cancelled' | 'refunded' | 'unverified' | 'verified';
  payment_method?: string;
  notes?: string;
  receipt_url?: string;
  email_sent?: boolean;
  created_at: string;
  paid_at?: string | null;
  deleted_at?: string | null;
}

export interface ContactSubmission {
  id: string;
  ngo_id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'in_progress' | 'resolved';
  internal_notes?: string;
  created_at: string;
  deleted_at?: string | null;
}

export interface Role {
  id: string;
  name: RoleName;
  label: string;
  description: string;
  is_system: boolean;
  permissions: string[];
  created_at: string;
}

export interface Permission {
  id: string;
  code: string;
  category: string;
  description: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: RoleName;
  assigned_ngo_id?: string | null; // NULL for super_admin
  status: 'active' | 'suspended';
  permissions?: string[];
  password_hash?: string;
  password_salt?: string;
  last_login_at?: string | null;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
  // Runtime session impersonation metadata
  impersonating?: {
    originalUserId: string;
    originalEmail: string;
    originalRole: RoleName;
    targetNgoId: string;
    targetNgoName: string;
  };
}

export interface AuditLog {
  id: string;
  user_id?: string;
  user_email: string;
  ngo_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}
