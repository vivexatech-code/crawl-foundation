import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { 
  NGO, 
  SiteDomain,
  SiteSettings, 
  HomepageContent, 
  CustomPage,
  Activity, 
  TeamMember, 
  GalleryItem, 
  DonationPurpose, 
  Donation, 
  ContactSubmission,
  Role,
  Permission,
  AdminUser,
  AuditLog
} from '../types/database';
import { 
  CRAWL_NGO_ID,
  VIKAS_NGO_ID,
  initialNgos, 
  initialDomains,
  initialRoles,
  initialPermissions,
  initialUsers,
  initialPages,
  initialAuditLogs,
  initialSiteSettings, 
  initialHomepageContent, 
  initialActivities, 
  initialTeamMembers, 
  initialGalleryItems, 
  initialDonationPurposes, 
  initialDonations, 
  initialContacts 
} from './data-store';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Shared file-persisted store for seamless cross-application synchronization
function getStoreFilePath(): string {
  const directPath = 'C:\\Projects\\shared-data\\store.json';
  if (fs.existsSync(directPath)) return directPath;
  return path.resolve(process.cwd(), '../shared-data/store.json');
}

function loadSharedData() {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.domains) parsed.domains = initialDomains;
      if (!parsed.roles) parsed.roles = initialRoles;
      if (!parsed.permissions) parsed.permissions = initialPermissions;
      if (!parsed.users) parsed.users = initialUsers;
      if (!parsed.pages) parsed.pages = initialPages;
      if (!parsed.auditLogs) parsed.auditLogs = initialAuditLogs;
      return parsed;
    }
  } catch (e) {
    // Fallback to in-memory defaults
  }
  return {
    ngos: initialNgos,
    domains: initialDomains,
    roles: initialRoles,
    permissions: initialPermissions,
    users: initialUsers,
    pages: initialPages,
    auditLogs: initialAuditLogs,
    siteSettings: initialSiteSettings,
    homepageContent: initialHomepageContent,
    activities: initialActivities,
    teamMembers: initialTeamMembers,
    galleryItems: initialGalleryItems,
    donationPurposes: initialDonationPurposes,
    donations: initialDonations,
    contacts: initialContacts
  };
}

function saveSharedData(data: any) {
  try {
    const filePath = getStoreFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed to save to shared-data/store.json:', e);
  }
}

// In-memory cache for fast hostname to NGO resolution (60s TTL)
const domainResolutionCache = new Map<string, { ngo: NGO; expires: number }>();

export const db = {
  // =========================================================================
  // NGOs & TENANTS
  // =========================================================================
  async getAllNgos(): Promise<NGO[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('ngos')
        .select('*')
        .is('deleted_at', null)
        .order('name');
      if (!error && data && data.length > 0) return data;
    }
    const store = loadSharedData();
    const list = store.ngos || initialNgos;
    return list.filter((n: NGO) => !n.deleted_at);
  },

  async getNgoBySlug(slug: string): Promise<NGO | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('ngos')
        .select('*')
        .eq('slug', slug)
        .is('deleted_at', null)
        .single();
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list = store.ngos || initialNgos;
    return list.find((n: NGO) => n.slug === slug && !n.deleted_at) || null;
  },

  async getNgoById(id: string): Promise<NGO | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('ngos')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .is('deleted_at', null)
        .maybeSingle();
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list = store.ngos || initialNgos;
    return list.find((n: NGO) => (n.id === id || n.slug === id) && !n.deleted_at) || null;
  },

  async createNgo(ngoData: Partial<NGO>): Promise<NGO> {
    const newId = ngoData.id || crypto.randomUUID();
    const now = new Date().toISOString();
    const newNgo: NGO = {
      id: newId,
      slug: ngoData.slug || `ngo-${Date.now()}`,
      name: ngoData.name || 'New Organization',
      legal_name: ngoData.legal_name || ngoData.name || 'New Organization Legal',
      tagline: ngoData.tagline || 'Working together for a better world',
      short_description: ngoData.short_description || '',
      full_description: ngoData.full_description || '',
      logo_url: ngoData.logo_url || '/images/brand/logo.jpg',
      favicon_url: ngoData.favicon_url || '/images/brand/logo.jpg',
      primary_color: ngoData.primary_color || '#0284c7',
      secondary_color: ngoData.secondary_color || '#ea580c',
      accent_color: ngoData.accent_color || '#10C9D4',
      font_family: ngoData.font_family || 'Manrope, Inter, sans-serif',
      status: ngoData.status || 'active',
      // White-label admin attributes
      admin_logo_url: ngoData.admin_logo_url || ngoData.logo_url || '/images/brand/logo.jpg',
      admin_favicon_url: ngoData.admin_favicon_url || ngoData.favicon_url || '/images/brand/logo.jpg',
      admin_title: ngoData.admin_title || `${ngoData.name || 'Organization'} Portal`,
      admin_sidebar_color: ngoData.admin_sidebar_color || '#172B4D',
      admin_primary_color: ngoData.admin_primary_color || ngoData.primary_color || '#0284c7',
      admin_button_color: ngoData.admin_button_color || ngoData.primary_color || '#0284c7',
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };

    if (supabase) {
      const { data, error } = await supabase.from('ngos').insert(newNgo).select().single();
      if (error) console.error('Supabase createNgo error:', error);
    }

    const store = loadSharedData();
    if (!store.ngos) store.ngos = [];
    store.ngos.push(newNgo);

    // Provision baseline site_settings
    if (!store.siteSettings) store.siteSettings = {};
    store.siteSettings[newId] = {
      id: crypto.randomUUID(),
      ngo_id: newId,
      email: `contact@${newNgo.slug}.org`,
      support_email: `support@${newNgo.slug}.org`,
      phone: '+91 98000 00000',
      whatsapp_number: '+91 98000 00000',
      registered_address: 'Registered Head Office Address',
      city: 'Dehradun',
      state: 'Uttarakhand',
      country: 'India',
      pincode: '248001',
      trust_reg_number: `REG-${Date.now()}`,
      trust_reg_date: new Date().toISOString().split('T')[0],
      trust_reg_subregistrar: 'Sub-Registrar Dehradun',
      pan_number_masked: 'XXXXX0000X',
      section_12a_urn: `12A-URN-${Date.now()}`,
      section_12a_order_date: new Date().toISOString().split('T')[0],
      section_12a_validity: 'Provisional (AY 2026-27 to 2028-29)',
      section_80g_urn: `80G-URN-${Date.now()}`,
      section_80g_order_date: new Date().toISOString().split('T')[0],
      section_80g_validity: 'Provisional (AY 2026-27 to 2028-29)',
      registration_disclaimer: 'Provisional registration under Section 12A & 80G.',
      currency: 'INR',
      min_donation_amount: 100,
      allow_anonymous_donations: true,
      meta_title: `${newNgo.name} | Official Website`,
      meta_description: newNgo.short_description || `${newNgo.name} charitable initiative.`
    };

    // Provision baseline homepage_content
    if (!store.homepageContent) store.homepageContent = {};
    store.homepageContent[newId] = {
      id: crypto.randomUUID(),
      ngo_id: newId,
      hero_headline: 'Creating Meaningful Community Change',
      hero_subheadline: newNgo.tagline || 'Dedicated to empowering lives through transparent social action.',
      hero_cta_primary_text: 'Support Our Mission',
      hero_cta_secondary_text: 'Explore Our Work',
      hero_image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      hero_badge_text: 'Verified Non-Profit',
      intro_title: `About ${newNgo.name}`,
      intro_content: newNgo.short_description || 'Working at the grassroots level to bring meaningful impact.',
      mission_title: 'Our Mission',
      mission_statement: 'To foster sustainable empowerment and dignity across underserved communities.',
      mission_icon: 'Target',
      vision_title: 'Our Vision',
      vision_statement: 'A compassionate society where every individual has access to opportunity and care.',
      vision_icon: 'Eye',
      impact_stats: [
        { label: 'Families Assisted', value: '1,000+', description: 'Direct community support' },
        { label: 'Outreach Drives', value: '25+', description: 'Grassroots programs completed' }
      ],
      cta_banner_title: 'Be Part of the Solution',
      cta_banner_subtitle: 'Your contribution creates immediate real-world impact.',
      cta_banner_button_text: 'Donate Now'
    };

    // Provision primary default domain record
    if (!store.domains) store.domains = [];
    store.domains.push({
      id: crypto.randomUUID(),
      ngo_id: newId,
      domain: `${newNgo.slug}.org`,
      is_primary: true,
      verified: true,
      verification_token: `ngo-verify-${crypto.randomUUID().slice(0, 8)}`,
      verification_type: 'txt',
      verified_at: now,
      created_at: now
    });

    saveSharedData(store);
    return newNgo;
  },

  async updateNgo(id: string, updates: Partial<NGO>): Promise<NGO | null> {
    const now = new Date().toISOString();
    const cleanUpdates = { ...updates, updated_at: now };

    if (supabase) {
      const { data, error } = await supabase
        .from('ngos')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();
      if (error) console.error('Supabase updateNgo error:', error);
      if (!error && data) {
        domainResolutionCache.clear();
      }
    }

    const store = loadSharedData();
    const idx = (store.ngos || []).findIndex((n: NGO) => n.id === id);
    if (idx !== -1) {
      store.ngos[idx] = { ...store.ngos[idx], ...cleanUpdates };
      saveSharedData(store);
      domainResolutionCache.clear();
      return store.ngos[idx];
    }
    return null;
  },

  async deleteNgo(id: string): Promise<boolean> {
    const now = new Date().toISOString();
    if (supabase) {
      await supabase.from('ngos').update({ deleted_at: now }).eq('id', id);
    }
    const store = loadSharedData();
    const idx = (store.ngos || []).findIndex((n: NGO) => n.id === id);
    if (idx !== -1) {
      store.ngos[idx].deleted_at = now;
      saveSharedData(store);
      domainResolutionCache.clear();
      return true;
    }
    return false;
  },

  // =========================================================================
  // DOMAIN MANAGEMENT & HOSTNAME RESOLUTION
  // =========================================================================
  async getDomains(ngoId?: string): Promise<SiteDomain[]> {
    if (supabase) {
      let q = supabase.from('site_domains').select('*').is('deleted_at', null).order('created_at', { ascending: false });
      if (ngoId) q = q.eq('ngo_id', ngoId);
      const { data, error } = await q;
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list: SiteDomain[] = store.domains || initialDomains;
    const active = list.filter((d: SiteDomain) => !d.deleted_at);
    return ngoId ? active.filter((d: SiteDomain) => d.ngo_id === ngoId) : active;
  },

  async getDomainByName(domain: string): Promise<SiteDomain | null> {
    const normalized = domain.toLowerCase().trim();
    if (supabase) {
      const { data, error } = await supabase
        .from('site_domains')
        .select('*')
        .eq('domain', normalized)
        .is('deleted_at', null)
        .single();
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list: SiteDomain[] = store.domains || initialDomains;
    return list.find((d: SiteDomain) => d.domain.toLowerCase() === normalized && !d.deleted_at) || null;
  },

  async createDomain(domainData: { ngo_id: string; domain: string; is_primary?: boolean }): Promise<SiteDomain> {
    const normalized = domainData.domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    const now = new Date().toISOString();
    const token = `ngo-verify-${crypto.randomUUID().slice(0, 10)}`;
    
    const newDomain: SiteDomain = {
      id: crypto.randomUUID(),
      ngo_id: domainData.ngo_id,
      domain: normalized,
      is_primary: domainData.is_primary ?? false,
      verified: false,
      verification_token: token,
      verification_type: 'txt',
      verified_at: null,
      dns_records: [
        { type: 'CNAME', host: '@', value: 'cname.ngoplatform.org', status: 'pending' },
        { type: 'TXT', host: '_ngo-challenge', value: token, status: 'pending' }
      ],
      created_at: now,
      deleted_at: null,
    };

    if (supabase) {
      const { data, error } = await supabase.from('site_domains').insert(newDomain).select().single();
      if (error) console.error('Supabase createDomain error:', error);
    }

    const store = loadSharedData();
    if (!store.domains) store.domains = [];
    
    // If setting as primary, unset other primary domains for this NGO
    if (newDomain.is_primary) {
      store.domains.forEach((d: SiteDomain) => {
        if (d.ngo_id === domainData.ngo_id) d.is_primary = false;
      });
    }
    
    store.domains.push(newDomain);
    saveSharedData(store);
    domainResolutionCache.clear();
    return newDomain;
  },

  async verifyDomain(id: string): Promise<SiteDomain | null> {
    const now = new Date().toISOString();
    const updates = { 
      verified: true, 
      verified_at: now,
      dns_records: [
        { type: 'CNAME' as const, host: '@', value: 'cname.ngoplatform.org', status: 'valid' as const },
        { type: 'TXT' as const, host: '_ngo-challenge', value: 'verified', status: 'valid' as const }
      ]
    };

    if (supabase) {
      const { data, error } = await supabase.from('site_domains').update(updates).eq('id', id).select().single();
      if (error) console.error('Supabase verifyDomain error:', error);
    }

    const store = loadSharedData();
    const idx = (store.domains || []).findIndex((d: SiteDomain) => d.id === id);
    if (idx !== -1) {
      store.domains[idx] = { ...store.domains[idx], ...updates };
      saveSharedData(store);
      domainResolutionCache.clear();
      return store.domains[idx];
    }
    return null;
  },

  async setPrimaryDomain(id: string, ngoId: string): Promise<boolean> {
    if (supabase) {
      await supabase.from('site_domains').update({ is_primary: false }).eq('ngo_id', ngoId);
      await supabase.from('site_domains').update({ is_primary: true, verified: true }).eq('id', id);
    }
    const store = loadSharedData();
    (store.domains || []).forEach((d: SiteDomain) => {
      if (d.ngo_id === ngoId) d.is_primary = (d.id === id);
    });
    saveSharedData(store);
    domainResolutionCache.clear();
    return true;
  },

  async deleteDomain(id: string): Promise<boolean> {
    const now = new Date().toISOString();
    if (supabase) {
      await supabase.from('site_domains').update({ deleted_at: now }).eq('id', id);
    }
    const store = loadSharedData();
    const idx = (store.domains || []).findIndex((d: SiteDomain) => d.id === id);
    if (idx !== -1) {
      store.domains[idx].deleted_at = now;
      saveSharedData(store);
      domainResolutionCache.clear();
      return true;
    }
    return false;
  },

  // High-performance domain resolver with TTL memory cache
  async resolveDomainToNgo(rawHost: string, querySlug?: string): Promise<NGO | null> {
    if (!rawHost) return null;
    
    // Normalize host: strip port and leading www.
    const host = rawHost.toLowerCase().trim().split(':')[0].replace(/^www\./, '');

    // Check memory cache
    const cached = domainResolutionCache.get(host);
    if (cached && cached.expires > Date.now()) {
      return cached.ngo;
    }

    // 1. Development/Localhost Resolution
    if (host === 'localhost' || host === '127.0.0.1') {
      if (querySlug) {
        const ngo = await db.getNgoBySlug(querySlug);
        if (ngo) {
          domainResolutionCache.set(host, { ngo, expires: Date.now() + 10000 });
          return ngo;
        }
      }
      // Check if localhost is mapped to an NGO in domains
      const localDom = await db.getDomainByName('localhost:3000') || await db.getDomainByName('localhost');
      if (localDom && localDom.verified) {
        const ngo = await db.getNgoById(localDom.ngo_id);
        if (ngo) return ngo;
      }
      // Fallback to default configured NGO
      const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_NGO_SLUG || 'the-crawl-foundation';
      return await db.getNgoBySlug(defaultSlug);
    }

    // 2. Custom Domain Resolution via site_domains
    const store = loadSharedData();
    const domains: SiteDomain[] = store.domains || initialDomains;
    
    // Exact or www match against verified domains
    const matchedDomain = domains.find(d => 
      !d.deleted_at && 
      d.verified && 
      (d.domain.toLowerCase() === host || d.domain.toLowerCase() === `www.${host}` || `www.${d.domain.toLowerCase()}` === host)
    );

    if (matchedDomain) {
      const ngo = await db.getNgoById(matchedDomain.ngo_id);
      if (ngo && ngo.status === 'active') {
        domainResolutionCache.set(host, { ngo, expires: Date.now() + 60000 });
        return ngo;
      }
    }

    // Unregistered, unverified or unknown domain -> Returns null (caller displays neutral 404 domain unclaimed)
    return null;
  },

  // =========================================================================
  // ROLES, PERMISSIONS & USERS (RBAC)
  // =========================================================================
  async getRoles(): Promise<Role[]> {
    const store = loadSharedData();
    return store.roles || initialRoles;
  },

  async getPermissions(): Promise<Permission[]> {
    const store = loadSharedData();
    return store.permissions || initialPermissions;
  },

  async getUsers(ngoId?: string): Promise<AdminUser[]> {
    const store = loadSharedData();
    const users: AdminUser[] = store.users || initialUsers;
    const active = users.filter(u => !u.deleted_at);
    if (!ngoId) return active;
    return active.filter(u => u.assigned_ngo_id === ngoId);
  },

  async getUserById(id: string): Promise<AdminUser | null> {
    const store = loadSharedData();
    const users: AdminUser[] = store.users || initialUsers;
    return users.find(u => u.id === id && !u.deleted_at) || null;
  },

  async getUserByEmail(email: string): Promise<AdminUser | null> {
    const norm = email.toLowerCase().trim();
    const store = loadSharedData();
    const users: AdminUser[] = store.users || initialUsers;
    return users.find(u => u.email.toLowerCase() === norm && !u.deleted_at) || null;
  },

  async createUser(userData: {
    email: string;
    full_name: string;
    role: any;
    assigned_ngo_id?: string | null;
    password?: string;
    permissions?: string[];
  }): Promise<AdminUser> {
    const salt = 'ngocms_secure_salt_2026';
    const pwd = userData.password || 'change_this_strong_password';
    const hash = crypto.pbkdf2Sync(pwd, salt, 10000, 32, 'sha256').toString('hex');
    const now = new Date().toISOString();

    const newUser: AdminUser = {
      id: crypto.randomUUID(),
      email: userData.email.toLowerCase().trim(),
      full_name: userData.full_name,
      role: userData.role,
      assigned_ngo_id: userData.assigned_ngo_id || null,
      status: 'active',
      password_hash: hash,
      password_salt: salt,
      permissions: userData.permissions || [],
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };

    const store = loadSharedData();
    if (!store.users) store.users = [];
    store.users.push(newUser);
    saveSharedData(store);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
    const now = new Date().toISOString();
    const store = loadSharedData();
    const idx = (store.users || []).findIndex((u: AdminUser) => u.id === id);
    if (idx !== -1) {
      if (updates.password_hash === undefined && updates.password_salt === undefined) {
        // no password change
      }
      store.users[idx] = { ...store.users[idx], ...updates, updated_at: now };
      saveSharedData(store);
      return store.users[idx];
    }
    return null;
  },

  async deleteUser(id: string): Promise<boolean> {
    const now = new Date().toISOString();
    const store = loadSharedData();
    const idx = (store.users || []).findIndex((u: AdminUser) => u.id === id);
    if (idx !== -1) {
      store.users[idx].deleted_at = now;
      saveSharedData(store);
      return true;
    }
    return false;
  },

  // =========================================================================
  // CUSTOM PAGES MANAGEMENT
  // =========================================================================
  async getPages(ngoId: string, onlyPublished: boolean = false): Promise<CustomPage[]> {
    const store = loadSharedData();
    const pages: CustomPage[] = store.pages || initialPages;
    return pages.filter(p => 
      p.ngo_id === ngoId && 
      !p.deleted_at && 
      (!onlyPublished || p.is_published)
    );
  },

  async getPageBySlug(ngoId: string, slug: string): Promise<CustomPage | null> {
    const store = loadSharedData();
    const pages: CustomPage[] = store.pages || initialPages;
    return pages.find(p => p.ngo_id === ngoId && p.slug === slug && !p.deleted_at) || null;
  },

  async createPage(pageData: Partial<CustomPage> & { ngo_id: string; title: string; slug: string; content: string }): Promise<CustomPage> {
    const now = new Date().toISOString();
    const newPage: CustomPage = {
      id: pageData.id || crypto.randomUUID(),
      ngo_id: pageData.ngo_id,
      slug: pageData.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-'),
      title: pageData.title,
      content: pageData.content,
      excerpt: pageData.excerpt || '',
      meta_title: pageData.meta_title || pageData.title,
      meta_description: pageData.meta_description || '',
      is_published: pageData.is_published ?? true,
      display_order: pageData.display_order ?? 1,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };

    const store = loadSharedData();
    if (!store.pages) store.pages = [];
    store.pages.push(newPage);
    saveSharedData(store);
    return newPage;
  },

  async updatePage(id: string, updates: Partial<CustomPage>): Promise<CustomPage | null> {
    const now = new Date().toISOString();
    const store = loadSharedData();
    const idx = (store.pages || []).findIndex((p: CustomPage) => p.id === id);
    if (idx !== -1) {
      store.pages[idx] = { ...store.pages[idx], ...updates, updated_at: now };
      saveSharedData(store);
      return store.pages[idx];
    }
    return null;
  },

  async deletePage(id: string): Promise<boolean> {
    const now = new Date().toISOString();
    const store = loadSharedData();
    const idx = (store.pages || []).findIndex((p: CustomPage) => p.id === id);
    if (idx !== -1) {
      store.pages[idx].deleted_at = now;
      saveSharedData(store);
      return true;
    }
    return false;
  },

  // =========================================================================
  // AUDIT LOGGING
  // =========================================================================
  async logAudit(entry: {
    user_id?: string;
    user_email: string;
    ngo_id?: string | null;
    action: string;
    entity_type: string;
    entity_id?: string;
    details?: Record<string, any>;
    ip_address?: string;
  }): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      user_id: entry.user_id,
      user_email: entry.user_email,
      ngo_id: entry.ngo_id || null,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      details: entry.details || {},
      ip_address: entry.ip_address || '127.0.0.1',
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        await supabase.from('audit_logs').insert(newLog);
      } catch (e) {
        // silent fallback to store
      }
    }

    const store = loadSharedData();
    if (!store.auditLogs) store.auditLogs = [];
    store.auditLogs.unshift(newLog);
    // Keep max 2000 log entries
    if (store.auditLogs.length > 2000) store.auditLogs.pop();
    saveSharedData(store);
    return newLog;
  },

  async getAuditLogs(ngoId?: string, limit: number = 50): Promise<AuditLog[]> {
    if (supabase) {
      try {
        let q = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(limit);
        if (ngoId) q = q.eq('ngo_id', ngoId);
        const { data, error } = await q;
        if (!error && data) return data;
      } catch (e) {}
    }
    const store = loadSharedData();
    const logs: AuditLog[] = store.auditLogs || initialAuditLogs;
    if (!ngoId) return logs.slice(0, limit);
    return logs.filter(l => l.ngo_id === ngoId).slice(0, limit);
  },

  // =========================================================================
  // SITE SETTINGS & HOMEPAGE CONTENT
  // =========================================================================
  async getSiteSettings(ngoId: string): Promise<SiteSettings> {
    if (supabase) {
      const { data, error } = await supabase.from('site_settings').select('*').eq('ngo_id', ngoId).is('deleted_at', null).single();
      if (!error && data) return data;
    }
    const store = loadSharedData();
    return store.siteSettings?.[ngoId] || initialSiteSettings[ngoId] || initialSiteSettings[CRAWL_NGO_ID];
  },

  async updateSiteSettings(ngoId: string, updates: Partial<SiteSettings>): Promise<SiteSettings | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('ngo_id', ngoId)
        .select()
        .single();
      if (!error && data) {
        const store = loadSharedData();
        store.siteSettings[ngoId] = { ...store.siteSettings[ngoId], ...updates };
        saveSharedData(store);
        return data;
      }
    }
    const store = loadSharedData();
    if (!store.siteSettings) store.siteSettings = {};
    store.siteSettings[ngoId] = { ...store.siteSettings[ngoId], ...updates };
    saveSharedData(store);
    return store.siteSettings[ngoId];
  },

  async getHomepageContent(ngoId: string): Promise<HomepageContent> {
    if (supabase) {
      const { data, error } = await supabase.from('homepage_content').select('*').eq('ngo_id', ngoId).is('deleted_at', null).single();
      if (!error && data) return data;
    }
    const store = loadSharedData();
    return store.homepageContent?.[ngoId] || initialHomepageContent[ngoId] || initialHomepageContent[CRAWL_NGO_ID];
  },

  async updateHomepageContent(ngoId: string, updates: Partial<HomepageContent>): Promise<HomepageContent | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('homepage_content')
        .update(updates)
        .eq('ngo_id', ngoId)
        .select()
        .single();
      if (!error && data) {
        const store = loadSharedData();
        store.homepageContent[ngoId] = { ...store.homepageContent[ngoId], ...updates };
        saveSharedData(store);
        return data;
      }
    }
    const store = loadSharedData();
    if (!store.homepageContent) store.homepageContent = {};
    store.homepageContent[ngoId] = { ...store.homepageContent[ngoId], ...updates };
    saveSharedData(store);
    return store.homepageContent[ngoId];
  },

  // =========================================================================
  // ACTIVITIES & PROJECTS
  // =========================================================================
  async getActivities(ngoId?: string): Promise<Activity[]> {
    if (supabase) {
      let q = supabase.from('activities').select('*').is('deleted_at', null).order('display_order', { ascending: true });
      if (ngoId) q = q.eq('ngo_id', ngoId);
      const { data, error } = await q;
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list = store.activities || initialActivities;
    const active = list.filter((a: Activity) => !a.deleted_at);
    return ngoId ? active.filter((a: Activity) => a.ngo_id === ngoId) : active;
  },

  async createActivity(activity: Partial<Activity>): Promise<Activity> {
    const newActivity: Activity = {
      id: activity.id || crypto.randomUUID(),
      ngo_id: activity.ngo_id || CRAWL_NGO_ID,
      title: activity.title || 'New Activity',
      slug: activity.slug || `act-${Date.now()}`,
      category: activity.category || 'General',
      short_description: activity.short_description || '',
      full_content: activity.full_content || '',
      featured_image_url: activity.featured_image_url || '/images/brand/logo.jpg',
      gallery_images: activity.gallery_images || [],
      location: activity.location || 'Dehradun, Uttarakhand',
      activity_date: activity.activity_date || new Date().toISOString().split('T')[0],
      status: activity.status || 'ongoing',
      is_featured: activity.is_featured ?? false,
      is_published: activity.is_published ?? true,
      display_order: activity.display_order || 99,
      deleted_at: null,
    };

    if (supabase) {
      const { data, error } = await supabase.from('activities').insert(newActivity).select().single();
      if (!error && data) {
        const store = loadSharedData();
        store.activities.push(data);
        saveSharedData(store);
        return data;
      }
    }
    const store = loadSharedData();
    store.activities.push(newActivity);
    saveSharedData(store);
    return newActivity;
  },

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | null> {
    if (supabase) {
      const { data, error } = await supabase.from('activities').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const store = loadSharedData();
        const idx = store.activities.findIndex((a: Activity) => a.id === id);
        if (idx !== -1) {
          store.activities[idx] = { ...store.activities[idx], ...updates };
          saveSharedData(store);
        }
        return data;
      }
    }
    const store = loadSharedData();
    const idx = store.activities.findIndex((a: Activity) => a.id === id);
    if (idx !== -1) {
      store.activities[idx] = { ...store.activities[idx], ...updates };
      saveSharedData(store);
      return store.activities[idx];
    }
    return null;
  },

  async deleteActivity(id: string): Promise<boolean> {
    const now = new Date().toISOString();
    if (supabase) {
      await supabase.from('activities').update({ deleted_at: now }).eq('id', id);
    }
    const store = loadSharedData();
    const idx = store.activities.findIndex((a: Activity) => a.id === id);
    if (idx !== -1) {
      store.activities[idx].deleted_at = now;
      saveSharedData(store);
      return true;
    }
    return false;
  },

  // =========================================================================
  // TEAM MEMBERS
  // =========================================================================
  async getTeamMembers(ngoId?: string): Promise<TeamMember[]> {
    if (supabase) {
      let q = supabase.from('team_members').select('*').is('deleted_at', null).order('display_order', { ascending: true });
      if (ngoId) q = q.eq('ngo_id', ngoId);
      const { data, error } = await q;
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list = store.teamMembers || initialTeamMembers;
    const active = list.filter((t: TeamMember) => !t.deleted_at);
    return ngoId ? active.filter((t: TeamMember) => t.ngo_id === ngoId) : active;
  },

  async createTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    const newMember: TeamMember = {
      id: member.id || crypto.randomUUID(),
      ngo_id: member.ngo_id || CRAWL_NGO_ID,
      name: member.name || 'Team Member',
      role: member.role || 'Volunteer',
      category: member.category || 'team',
      bio: member.bio || '',
      image_url: member.image_url || '/images/team/vimmy-kaul.jpg',
      email: member.email || '',
      linkedin_url: member.linkedin_url || '',
      display_order: member.display_order || 10,
      is_published: member.is_published ?? true,
      deleted_at: null,
    };
    if (supabase) {
      await supabase.from('team_members').insert(newMember);
    }
    const store = loadSharedData();
    store.teamMembers.push(newMember);
    saveSharedData(store);
    return newMember;
  },

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
    if (supabase) {
      await supabase.from('team_members').update(updates).eq('id', id);
    }
    const store = loadSharedData();
    const idx = store.teamMembers.findIndex((t: TeamMember) => t.id === id);
    if (idx !== -1) {
      store.teamMembers[idx] = { ...store.teamMembers[idx], ...updates };
      saveSharedData(store);
      return store.teamMembers[idx];
    }
    return null;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    const now = new Date().toISOString();
    if (supabase) {
      await supabase.from('team_members').update({ deleted_at: now }).eq('id', id);
    }
    const store = loadSharedData();
    const idx = store.teamMembers.findIndex((t: TeamMember) => t.id === id);
    if (idx !== -1) {
      store.teamMembers[idx].deleted_at = now;
      saveSharedData(store);
      return true;
    }
    return false;
  },

  // =========================================================================
  // GALLERY
  // =========================================================================
  async getGalleryItems(ngoId?: string): Promise<GalleryItem[]> {
    if (supabase) {
      let q = supabase.from('gallery').select('*').is('deleted_at', null).order('display_order', { ascending: true });
      if (ngoId) q = q.eq('ngo_id', ngoId);
      const { data, error } = await q;
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list = store.galleryItems || initialGalleryItems;
    const active = list.filter((g: GalleryItem) => !g.deleted_at);
    return ngoId ? active.filter((g: GalleryItem) => g.ngo_id === ngoId) : active;
  },

  async createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      id: item.id || crypto.randomUUID(),
      ngo_id: item.ngo_id || CRAWL_NGO_ID,
      title: item.title || 'Gallery Image',
      caption: item.caption || '',
      category: item.category || 'General',
      image_url: item.image_url || '',
      thumbnail_url: item.thumbnail_url || item.image_url || '',
      event_date: item.event_date || new Date().toISOString().split('T')[0],
      display_order: item.display_order || 10,
      is_featured: item.is_featured ?? false,
      is_published: item.is_published ?? true,
      deleted_at: null,
    };
    if (supabase) {
      await supabase.from('gallery').insert(newItem);
    }
    const store = loadSharedData();
    store.galleryItems.push(newItem);
    saveSharedData(store);
    return newItem;
  },

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
    if (supabase) {
      await supabase.from('gallery').update(updates).eq('id', id);
    }
    const store = loadSharedData();
    const idx = store.galleryItems.findIndex((g: GalleryItem) => g.id === id);
    if (idx !== -1) {
      store.galleryItems[idx] = { ...store.galleryItems[idx], ...updates };
      saveSharedData(store);
      return store.galleryItems[idx];
    }
    return null;
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const now = new Date().toISOString();
    if (supabase) {
      await supabase.from('gallery').update({ deleted_at: now }).eq('id', id);
    }
    const store = loadSharedData();
    const idx = store.galleryItems.findIndex((g: GalleryItem) => g.id === id);
    if (idx !== -1) {
      store.galleryItems[idx].deleted_at = now;
      saveSharedData(store);
      return true;
    }
    return false;
  },

  // =========================================================================
  // DONATION PURPOSES
  // =========================================================================
  async getDonationPurposes(ngoId?: string): Promise<DonationPurpose[]> {
    if (supabase) {
      let q = supabase.from('donation_purposes').select('*').is('deleted_at', null).order('display_order', { ascending: true });
      if (ngoId) q = q.eq('ngo_id', ngoId);
      const { data, error } = await q;
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list = store.donationPurposes || initialDonationPurposes;
    const active = list.filter((p: DonationPurpose) => !p.deleted_at);
    return ngoId ? active.filter((p: DonationPurpose) => p.ngo_id === ngoId) : active;
  },

  async createDonationPurpose(purpose: Partial<DonationPurpose>): Promise<DonationPurpose> {
    const newPurpose: DonationPurpose = {
      id: purpose.id || crypto.randomUUID(),
      ngo_id: purpose.ngo_id || CRAWL_NGO_ID,
      name: purpose.name || 'General Donation',
      description: purpose.description || 'Support core non-profit initiatives.',
      suggested_amounts: purpose.suggested_amounts || [500, 1000, 2500, 5000],
      is_active: purpose.is_active ?? true,
      display_order: purpose.display_order || 1,
      deleted_at: null,
    };
    if (supabase) {
      await supabase.from('donation_purposes').insert(newPurpose);
    }
    const store = loadSharedData();
    store.donationPurposes.push(newPurpose);
    saveSharedData(store);
    return newPurpose;
  },

  // =========================================================================
  // DONATIONS & LEDGER
  // =========================================================================
  async getDonations(ngoId?: string): Promise<Donation[]> {
    if (supabase) {
      let q = supabase.from('donations').select('*').is('deleted_at', null).order('created_at', { ascending: false });
      if (ngoId) q = q.eq('ngo_id', ngoId);
      const { data, error } = await q;
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list = store.donations || [];
    const active = list.filter((d: Donation) => !d.deleted_at);
    return ngoId ? active.filter((d: Donation) => d.ngo_id === ngoId) : active;
  },

  async getDonationById(id: string): Promise<Donation | null> {
    if (supabase) {
      const { data, error } = await supabase.from('donations').select('*').or(`id.eq.${id},receipt_number.eq.${id}`).is('deleted_at', null).single();
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list = store.donations || [];
    return list.find((d: Donation) => (d.id === id || d.receipt_number === id) && !d.deleted_at) || null;
  },

  async createDonation(donation: Partial<Donation>): Promise<Donation> {
    const receiptNum = donation.receipt_number || `TCF-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newDonation: Donation = {
      id: donation.id || crypto.randomUUID(),
      ngo_id: donation.ngo_id || CRAWL_NGO_ID,
      receipt_number: receiptNum,
      donor_name: donation.donor_name || 'Anonymous Donor',
      donor_email: donation.donor_email || '',
      donor_phone: donation.donor_phone || '',
      donor_pan_masked: donation.donor_pan_masked || '',
      is_anonymous: donation.is_anonymous ?? false,
      amount: donation.amount || 500,
      currency: donation.currency || 'INR',
      purpose_id: donation.purpose_id,
      purpose_name: donation.purpose_name || 'General Support',
      requires_80g: donation.requires_80g ?? false,
      razorpay_order_id: donation.razorpay_order_id,
      razorpay_payment_id: donation.razorpay_payment_id,
      razorpay_signature: donation.razorpay_signature,
      payment_status: donation.payment_status || 'created',
      payment_method: donation.payment_method || 'Online',
      notes: donation.notes || '',
      created_at: new Date().toISOString(),
      paid_at: donation.payment_status === 'captured' ? new Date().toISOString() : null,
      deleted_at: null,
    };

    if (supabase) {
      const { data, error } = await supabase.from('donations').insert(newDonation).select().single();
      if (!error && data) {
        const store = loadSharedData();
        store.donations.unshift(data);
        saveSharedData(store);
        return data;
      }
    }

    const store = loadSharedData();
    store.donations.unshift(newDonation);
    saveSharedData(store);
    return newDonation;
  },

  async updateDonationPayment(
    orderId: string, 
    paymentId: string, 
    signature: string, 
    status: 'captured' | 'failed',
    paymentMethod: string = 'Online'
  ): Promise<Donation | null> {
    const updates: any = {
      payment_status: status,
      payment_method: paymentMethod,
      paid_at: status === 'captured' ? new Date().toISOString() : null,
    };

    if (status === 'captured') {
      updates.razorpay_payment_id = paymentId;
      updates.razorpay_signature = signature;
    } else {
      updates.notes = `Payment failed / invalid signature. Attempted reference: ${paymentId}`;
    }

    if (supabase) {
      const { data, error } = await supabase.from('donations').update(updates).eq('razorpay_order_id', orderId).select().single();
      if (error) {
        console.error('Supabase updateDonationPayment error:', error);
      }
      if (!error && data) {
        const store = loadSharedData();
        const idx = store.donations.findIndex((d: Donation) => d.razorpay_order_id === orderId);
        if (idx !== -1) {
          store.donations[idx] = { ...store.donations[idx], ...updates };
          saveSharedData(store);
        }
        return data;
      }
    }

    const store = loadSharedData();
    const idx = store.donations.findIndex((d: Donation) => d.razorpay_order_id === orderId);
    if (idx !== -1) {
      store.donations[idx] = { ...store.donations[idx], ...updates };
      saveSharedData(store);
      return store.donations[idx];
    }
    return null;
  },

  // =========================================================================
  // CONTACT SUBMISSIONS
  // =========================================================================
  async getContacts(ngoId?: string): Promise<ContactSubmission[]> {
    if (supabase) {
      let q = supabase.from('contacts').select('*').is('deleted_at', null).order('created_at', { ascending: false });
      if (ngoId) q = q.eq('ngo_id', ngoId);
      const { data, error } = await q;
      if (!error && data) return data;
    }
    const store = loadSharedData();
    const list = store.contacts || [];
    const active = list.filter((c: ContactSubmission) => !c.deleted_at);
    return ngoId ? active.filter((c: ContactSubmission) => c.ngo_id === ngoId) : active;
  },

  async createContactSubmission(contact: Partial<ContactSubmission>): Promise<ContactSubmission> {
    const newSubmission: ContactSubmission = {
      id: contact.id || crypto.randomUUID(),
      ngo_id: contact.ngo_id || CRAWL_NGO_ID,
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      subject: contact.subject || '',
      message: contact.message || '',
      status: 'new',
      created_at: new Date().toISOString(),
      deleted_at: null,
    };

    if (supabase) {
      const { data, error } = await supabase.from('contacts').insert(newSubmission).select().single();
      if (!error && data) {
        const store = loadSharedData();
        store.contacts.unshift(data);
        saveSharedData(store);
        return data;
      }
    }

    const store = loadSharedData();
    store.contacts.unshift(newSubmission);
    saveSharedData(store);
    return newSubmission;
  },

  async createContact(contact: Partial<ContactSubmission>): Promise<ContactSubmission> {
    return this.createContactSubmission(contact);
  },

  async updateContactStatus(id: string, status: 'new' | 'read' | 'in_progress' | 'resolved', notes?: string): Promise<boolean> {
    const updates: any = { status };
    if (notes !== undefined) updates.internal_notes = notes;

    if (supabase) {
      await supabase.from('contacts').update(updates).eq('id', id);
    }
    const store = loadSharedData();
    const idx = store.contacts.findIndex((c: ContactSubmission) => c.id === id);
    if (idx !== -1) {
      store.contacts[idx] = { ...store.contacts[idx], ...updates };
      saveSharedData(store);
      return true;
    }
    return false;
  }
};
