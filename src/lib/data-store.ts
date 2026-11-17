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

export const CRAWL_NGO_ID = 'c1a23b45-6789-4abc-def0-123456789abc';
export const VIKAS_NGO_ID = 'd2b34c56-7890-4bcd-efa1-234567890def';

// Authentic Seed State
export const initialNgos: NGO[] = [
  {
    id: CRAWL_NGO_ID,
    slug: 'the-crawl-foundation',
    name: 'The Crawl Foundation',
    legal_name: 'THE CRAWL FOUNDATION',
    tagline: 'Together, We Can Create a Better Tomorrow',
    short_description: 'A registered charitable trust in Dehradun dedicated to healthcare, child education, women empowerment, and uplifting underserved communities with compassion and transparency.',
    full_description: 'The Crawl Foundation was established on 1st June 2023 in Dehradun, Uttarakhand as a dedicated Healthcare and Educational Charitable Trust. Governed by a committed Board of Trustees, the foundation focuses on child welfare, education access, basic healthcare assistance, and poor relief. Operating under provisional registrations under Section 12A and Section 80G of the Income Tax Act, 1961.',
    logo_url: '/images/brand/logo.jpg',
    favicon_url: '/images/brand/logo.jpg',
    primary_color: '#0284c7',   // Ocean Cyan / Blue from official logo
    secondary_color: '#ea580c', // Sunset Orange from official logo
    accent_color: '#7c3aed',    // Royal Purple from official logo
    font_family: 'Inter, sans-serif',
    status: 'active',
    // White-Label Admin Branding
    admin_logo_url: '/images/brand/logo.jpg',
    admin_favicon_url: '/images/brand/logo.jpg',
    admin_title: 'The Crawl Foundation Portal',
    admin_sidebar_color: '#172B4D',
    admin_primary_color: '#087FC1',
    admin_button_color: '#087FC1',
  },
  {
    id: VIKAS_NGO_ID,
    slug: 'vikas-youth-foundation',
    name: 'Vikas Youth Foundation',
    legal_name: 'VIKAS YOUTH WELFARE SOCIETY',
    tagline: 'Empowering Youth Through Skills & Livelihood',
    short_description: 'Dedicated to vocational skill training, rural livelihood generation, and sustainable community empowerment across Himalayan villages.',
    full_description: 'Vikas Youth Foundation focuses on empowering underprivileged youth through digital literacy, hands-on vocational courses, and self-employment initiatives.',
    logo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    favicon_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    primary_color: '#059669', // Emerald Green
    secondary_color: '#d97706', // Warm Amber
    accent_color: '#2563eb', // Royal Blue
    font_family: 'Inter, sans-serif',
    status: 'active',
    // White-Label Admin Branding
    admin_logo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    admin_favicon_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    admin_title: 'Vikas Youth Portal',
    admin_sidebar_color: '#064e3b',
    admin_primary_color: '#059669',
    admin_button_color: '#059669',
  }
];

export const initialSiteSettings: Record<string, SiteSettings> = {
  [CRAWL_NGO_ID]: {
    id: 's1-crawl-settings',
    ngo_id: CRAWL_NGO_ID,
    email: 'contact@thecrawlfoundation.org',
    support_email: 'support@thecrawlfoundation.org',
    phone: '+91 98970 12345',
    whatsapp_number: '+91 98970 12345',
    registered_address: '144/11, Neshvilla Road S.O, Dehradun, Uttarakhand – 248001, India',
    city: 'Dehradun',
    state: 'Uttarakhand',
    country: 'India',
    pincode: '248001',
    google_maps_url: 'https://maps.google.com/?q=144/11+Neshvilla+Road+Dehradun+Uttarakhand+248001',
    google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.8347101831267!2d78.03848727618585!3d30.327248805216335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929944c66432f%3A0xea21415fa9611f75!2sNeshvilla%20Rd%2C%20Dehradun%2C%20Uttarakhand%20248001!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin',
    facebook_url: 'https://facebook.com/thecrawlfoundation',
    instagram_url: 'https://instagram.com/thecrawlfoundation',
    youtube_url: 'https://youtube.com',
    linkedin_url: 'https://linkedin.com/company/thecrawlfoundation',
    trust_reg_number: 'Deed No. 878 / 2023 (Book 4)',
    trust_reg_date: '2023-06-01',
    trust_reg_subregistrar: 'Sub-Registrar IV, Dehradun, Uttarakhand',
    pan_number_masked: 'AAVFT****R',
    section_12a_urn: 'AAVFT8621RE20251',
    section_12a_order_date: '2025-04-18',
    section_12a_validity: 'Provisional Approval from AY 2026-27 to AY 2028-29',
    section_80g_urn: 'AAVFT8621RF20251',
    section_80g_order_date: '2025-04-18',
    section_80g_validity: 'Provisional Approval from AY 2026-27 to AY 2028-29',
    registration_disclaimer: 'The Crawl Foundation holds provisional registration under Section 12A (URN: AAVFT8621RE20251) and provisional approval under Section 80G (URN: AAVFT8621RF20251) granted on 18-04-2025 by the Income Tax Department for AY 2026-27 to AY 2028-29. In compliance with statutory guidelines, tax deduction eligibility is subject to applicable provisions of the Income Tax Act, 1961.',
    currency: 'INR',
    min_donation_amount: 100,
    allow_anonymous_donations: true,
  },
  [VIKAS_NGO_ID]: {
    id: 's2-vikas-settings',
    ngo_id: VIKAS_NGO_ID,
    email: 'info@vikasyouth.org',
    support_email: 'help@vikasyouth.org',
    phone: '+91 94120 54321',
    whatsapp_number: '+91 94120 54321',
    registered_address: 'Plot 45, Rajpur Road, Dehradun, Uttarakhand – 248009, India',
    city: 'Dehradun',
    state: 'Uttarakhand',
    country: 'India',
    pincode: '248009',
    google_maps_url: 'https://maps.google.com/?q=Rajpur+Road+Dehradun',
    trust_reg_number: 'Society Reg. 450/2021',
    trust_reg_date: '2021-04-12',
    trust_reg_subregistrar: 'Registrar of Societies, Dehradun',
    pan_number_masked: 'AAATV****B',
    section_12a_urn: 'AAATV1234AE20221',
    section_12a_order_date: '2022-05-10',
    section_12a_validity: 'Provisional Approval for AY 2024-25 to 2026-27',
    section_80g_urn: 'AAATV1234AF20221',
    section_80g_order_date: '2022-05-10',
    section_80g_validity: 'Provisional Approval for AY 2024-25 to 2026-27',
    registration_disclaimer: 'Vikas Youth Welfare Society is registered under Societies Registration Act 1860.',
    currency: 'INR',
    min_donation_amount: 100,
    allow_anonymous_donations: true,
  }
};

export const initialHomepageContent: Record<string, HomepageContent> = {
  [CRAWL_NGO_ID]: {
    id: 'hp-crawl',
    ngo_id: CRAWL_NGO_ID,
    hero_headline: 'Together, We Can Create a Better Tomorrow.',
    hero_subheadline: 'Every small act of kindness can create a meaningful difference. Join The Crawl Foundation in building a better future through compassion, care and community support.',
    hero_cta_primary_text: 'Donate Now',
    hero_cta_secondary_text: 'Explore Our Work',
    hero_image_url: '/images/activity/children-drive.jpg',
    hero_badge_text: 'Registered Charitable Trust • Dehradun, Uttarakhand',
    intro_title: 'Committed to Meaningful Grassroots Transformation',
    intro_content: 'The Crawl Foundation is a registered charitable trust in Dehradun working directly on the ground to provide educational support, healthcare assistance, and essential relief to children and vulnerable families in underserved settlements.',
    mission_title: 'Our Mission',
    mission_statement: 'To empower underprivileged children with foundational education, provide accessible healthcare support, extend compassionate relief to the impoverished, and foster self-reliant communities free from discrimination.',
    mission_icon: 'Target',
    vision_title: 'Our Vision',
    vision_statement: 'A society where every child enjoys the right to education, every vulnerable family has access to healthcare and dignity, and grassroots compassion fuels sustainable social change.',
    vision_icon: 'Compass',
    impact_stats: [
      { label: 'Children Supported', value: '150+', description: 'Enrolled in learning and nutrition drives' },
      { label: 'Community Drives', value: '12+', description: 'Conducted in Dehradun settlements' },
      { label: 'Relief Kits Distributed', value: '500+', description: 'Stationery packs and winter warmth kits' },
      { label: 'Provisional Approvals', value: '12A & 80G', description: 'Registered with Income Tax Department' }
    ],
    cta_banner_title: 'Your Contribution Can Change a Life.',
    cta_banner_subtitle: 'Support child education, healthcare drives, and immediate relief kits. Transparently accounted and directly deployed on the ground in Dehradun.',
    cta_banner_button_text: 'Make a Donation'
  },
  [VIKAS_NGO_ID]: {
    id: 'hp-vikas',
    ngo_id: VIKAS_NGO_ID,
    hero_headline: 'Building Skills, Transforming Youth Livelihoods.',
    hero_subheadline: 'Empowering young people with vocational education, digital skills, and employment support across the Himalayan region.',
    hero_cta_primary_text: 'Support A Student',
    hero_cta_secondary_text: 'Our Programs',
    hero_image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    hero_badge_text: 'Skill Development & Youth Empowerment',
    intro_title: 'Bridging the Opportunity Gap',
    intro_content: 'Vikas Youth Foundation equips underserved young minds with market-relevant skills, soft skills, and entrepreneurial training.',
    mission_title: 'Our Mission',
    mission_statement: 'To foster economic independence and livelihood security for youth through high-impact skills training and mentorship.',
    mission_icon: 'Target',
    vision_title: 'Our Vision',
    vision_statement: 'An inclusive world where every young individual has the skill, confidence, and opportunity to earn a dignified livelihood.',
    vision_icon: 'Compass',
    impact_stats: [
      { label: 'Youth Trained', value: '350+', description: 'Graduated in vocational courses' },
      { label: 'Job Placements', value: '82%', description: 'Employment assistance rate' },
      { label: 'Learning Centers', value: '3', description: 'Active centers in Uttarakhand' }
    ],
    cta_banner_title: 'Sponsor a Youth Vocational Scholarship',
    cta_banner_subtitle: 'Help a deserving youngster acquire livelihood skills and break the cycle of poverty.',
    cta_banner_button_text: 'Contribute Now'
  }
};

export const initialDonationPurposes: DonationPurpose[] = [
  {
    id: 'dp-1',
    ngo_id: CRAWL_NGO_ID,
    name: 'Child Education & Learning Kits',
    description: 'Provides notebooks, stationery, school uniforms, and mentorship coaching to underprivileged children in Dehradun.',
    suggested_amounts: [250, 500, 1000, 2500, 5000],
    is_active: true,
    display_order: 1
  },
  {
    id: 'dp-2',
    ngo_id: CRAWL_NGO_ID,
    name: 'Healthcare & Medical Relief',
    description: 'Subsidized health checkups, medicine aid, and critical illness support for needy children and vulnerable families.',
    suggested_amounts: [500, 1000, 2500, 5000, 10000],
    is_active: true,
    display_order: 2
  },
  {
    id: 'dp-3',
    ngo_id: CRAWL_NGO_ID,
    name: 'Nutritional Meals & Essential Relief',
    description: 'Wholesome nutritious snacks and dry ration packets for children and destitute households.',
    suggested_amounts: [100, 300, 750, 1500, 3000],
    is_active: true,
    display_order: 3
  },
  {
    id: 'dp-4',
    ngo_id: CRAWL_NGO_ID,
    name: 'General Charitable Corpus Fund',
    description: 'Enables The Crawl Foundation to direct resources swiftly wherever urgent humanitarian intervention is required.',
    suggested_amounts: [500, 1000, 2500, 5000, 10000],
    is_active: true,
    display_order: 4
  }
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    ngo_id: CRAWL_NGO_ID,
    title: 'Slum Children Learning & Nutrition Outreach Drive',
    slug: 'slum-children-learning-nutrition-drive',
    category: 'Education & Welfare',
    short_description: 'On-ground interactive learning sessions, foundational literacy coaching, and nutritious meal packets for children in Dehradun clusters.',
    full_content: 'Our team and volunteers organized an interactive grassroots educational session directly in a community settlement in Dehradun. Mrs. Vimmy Kaul, Founder Trustee & Associate President, personally guided the children through basic reading exercises, numbers, and personal hygiene practices. Each child received notebook packs, drawing materials, and healthy snacks, spreading smiles and encouraging regular school attendance.',
    featured_image_url: '/images/activity/children-drive.jpg',
    gallery_images: ['/images/activity/children-drive.jpg'],
    location: 'Dehradun Settlement Clusters, Uttarakhand',
    activity_date: '2024-02-15',
    status: 'completed',
    is_featured: true,
    is_published: true,
    display_order: 1
  },
  {
    id: 'act-2',
    ngo_id: CRAWL_NGO_ID,
    title: 'Underprivileged Family Healthcare & Medicine Assistance',
    slug: 'underprivileged-family-healthcare-assistance',
    category: 'Healthcare Support',
    short_description: 'Facilitating medical consultations, essential diagnostic tests, and prescribed medicines for families lacking access to healthcare.',
    full_content: 'In accordance with our Trust Deed objectives for medical relief, The Crawl Foundation coordinates medical checkups and provides prescription medicines to needy children and elderly family members. We partner with local healthcare professionals to ensure preventive health awareness and early treatment of seasonal ailments.',
    featured_image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    gallery_images: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'],
    location: 'Neshvilla Road & Surrounding Areas, Dehradun',
    activity_date: '2024-03-10',
    status: 'ongoing',
    is_featured: true,
    is_published: true,
    display_order: 2
  },
  {
    id: 'act-3',
    ngo_id: CRAWL_NGO_ID,
    title: 'Winter Warmth & Ration Kit Distribution',
    slug: 'winter-warmth-ration-kit-distribution',
    category: 'Poor Relief',
    short_description: 'Seasonal winter relief drive distributing heavy blankets, warm jackets, and essential grocery kits to vulnerable households.',
    full_content: 'During the harsh winter months in Uttarakhand, low-income families without adequate shelter face severe conditions. The Crawl Foundation launched an immediate relief drive distributing heavy thermal blankets, woolens, and monthly ration provisions to protect vulnerable children and senior citizens.',
    featured_image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    gallery_images: ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'],
    location: 'Dehradun Suburbs, Uttarakhand',
    activity_date: '2023-12-20',
    status: 'completed',
    is_featured: false,
    is_published: true,
    display_order: 3
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    ngo_id: CRAWL_NGO_ID,
    name: 'Mr. Ritesh Butola',
    role: 'Founder Trustee & President / Settlor',
    category: 'trustee',
    bio: 'Permanent Settlor and President of The Crawl Foundation. Driving transparent governance, statutory compliance, and strategic vision for community welfare in Dehradun and across Uttarakhand.',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    email: 'president@thecrawlfoundation.org',
    display_order: 1,
    is_published: true
  },
  {
    id: 'tm-2',
    ngo_id: CRAWL_NGO_ID,
    name: 'Mrs. Vimmy Kaul',
    role: 'Founder Trustee & Associate President / Co-Founder',
    category: 'trustee',
    bio: 'Co-Founder and Associate President. Spearheading grassroots operations, child learning initiatives, nutrition programs, and community volunteer mobilization directly on the ground.',
    image_url: '/images/team/vimmy-kaul.jpg',
    email: 'vimmy@thecrawlfoundation.org',
    display_order: 2,
    is_published: true
  },
  {
    id: 'tm-3',
    ngo_id: CRAWL_NGO_ID,
    name: 'Ms. Vartika Butola',
    role: 'Founder Trustee & Associate President / Co-Founder',
    category: 'trustee',
    bio: 'Co-Founder and Associate President. Guiding organizational partnerships, education curriculum design, and social outreach projects.',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'vartika@thecrawlfoundation.org',
    display_order: 3,
    is_published: true
  }
];

export const initialGalleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    ngo_id: CRAWL_NGO_ID,
    title: 'Community Outreach & Education Drive',
    caption: 'The Crawl Foundation team and Mrs. Vimmy Kaul with children during an interactive on-ground learning and nutrition session.',
    category: 'Community Drives',
    image_url: '/images/activity/children-drive.jpg',
    event_date: '2024-02-15',
    is_featured: true,
    is_published: true,
    display_order: 1
  },
  {
    id: 'gal-2',
    ngo_id: CRAWL_NGO_ID,
    title: 'Mrs. Vimmy Kaul, Co-Founder',
    caption: 'Founder Trustee & Associate President leading grassroots operations in Dehradun.',
    category: 'Leadership',
    image_url: '/images/team/vimmy-kaul.jpg',
    event_date: '2023-06-01',
    is_featured: true,
    is_published: true,
    display_order: 2
  },
  {
    id: 'gal-3',
    ngo_id: CRAWL_NGO_ID,
    title: 'Nutritional Meal & Snack Distribution',
    caption: 'Ensuring children in underserved communities receive wholesome nutrition alongside learning materials.',
    category: 'Relief & Nutrition',
    image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    event_date: '2024-01-20',
    is_featured: true,
    is_published: true,
    display_order: 3
  },
  {
    id: 'gal-4',
    ngo_id: CRAWL_NGO_ID,
    title: 'Pediatric Health Assistance',
    caption: 'Facilitating essential medical checkups and prescribed medical care for low-income families.',
    category: 'Healthcare Support',
    image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    event_date: '2024-03-05',
    is_featured: true,
    is_published: true,
    display_order: 4
  }
];

export const initialDonations: Donation[] = [];

export const initialContacts: ContactSubmission[] = [];

export const initialDomains: SiteDomain[] = [
  {
    id: 'dom-crawl-01',
    ngo_id: CRAWL_NGO_ID,
    domain: 'thecrawlfoundation.org',
    is_primary: true,
    verified: true,
    verification_token: 'ngo-verify-crawl-01',
    verification_type: 'txt',
    verified_at: '2023-06-01T00:00:00.000Z',
    dns_records: [
      { type: 'CNAME', host: '@', value: 'cname.ngoplatform.org', status: 'valid' },
      { type: 'TXT', host: '_ngo-challenge', value: 'ngo-verify-crawl-01', status: 'valid' }
    ],
    created_at: '2023-06-01T00:00:00.000Z'
  },
  {
    id: 'dom-crawl-local',
    ngo_id: CRAWL_NGO_ID,
    domain: 'localhost:3000',
    is_primary: false,
    verified: true,
    verification_token: 'ngo-verify-local-01',
    verification_type: 'txt',
    verified_at: '2023-06-01T00:00:00.000Z',
    created_at: '2023-06-01T00:00:00.000Z'
  },
  {
    id: 'dom-vikas-01',
    ngo_id: VIKAS_NGO_ID,
    domain: 'vikasyouth.org',
    is_primary: true,
    verified: true,
    verification_token: 'ngo-verify-vikas-01',
    verification_type: 'txt',
    verified_at: '2024-01-01T00:00:00.000Z',
    dns_records: [
      { type: 'CNAME', host: '@', value: 'cname.ngoplatform.org', status: 'valid' },
      { type: 'TXT', host: '_ngo-challenge', value: 'ngo-verify-vikas-01', status: 'valid' }
    ],
    created_at: '2024-01-01T00:00:00.000Z'
  }
];

export const initialRoles: Role[] = [
  {
    id: 'role-super-admin',
    name: 'super_admin',
    label: 'Super Administrator',
    description: 'Complete platform-level access to all NGOs, domains, users, analytics, and settings.',
    is_system: true,
    permissions: ['*'],
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'role-ngo-owner',
    name: 'ngo_owner',
    label: 'NGO Owner',
    description: 'Full control over the assigned NGO website, team users, domains, settings, and donations.',
    is_system: true,
    permissions: [
      'ngos:read', 'ngos:write', 'domains:read', 'domains:manage', 
      'users:read', 'users:manage', 'content:read', 'content:write', 
      'content:publish', 'content:delete', 'donations:read', 
      'donations:export', 'donations:manage', 'contacts:read', 
      'contacts:manage', 'audit:read'
    ],
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'role-ngo-admin',
    name: 'ngo_admin',
    label: 'NGO Administrator',
    description: 'Operational management of NGO content, activities, team, gallery, donations, and inquiries.',
    is_system: true,
    permissions: [
      'ngos:read', 'domains:read', 'content:read', 'content:write', 
      'content:publish', 'content:delete', 'donations:read', 
      'donations:export', 'donations:manage', 'contacts:read', 
      'contacts:manage'
    ],
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'role-content-manager',
    name: 'content_manager',
    label: 'Content Manager',
    description: 'Manage pages, activities, gallery, banners, and team. No access to financial records or domain settings.',
    is_system: true,
    permissions: [
      'ngos:read', 'content:read', 'content:write', 'content:publish', 
      'content:delete', 'contacts:read'
    ],
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'role-donation-manager',
    name: 'donation_manager',
    label: 'Donation Manager',
    description: 'View donations, donor tax details, export financial records, manage donation purposes.',
    is_system: true,
    permissions: [
      'ngos:read', 'donations:read', 'donations:export', 'donations:manage'
    ],
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'role-editor',
    name: 'editor',
    label: 'Editor',
    description: 'Create and edit draft content and activities without delete or publish rights.',
    is_system: true,
    permissions: ['ngos:read', 'content:read', 'content:write'],
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'role-viewer',
    name: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to NGO content, metrics, and basic reports.',
    is_system: true,
    permissions: ['ngos:read', 'content:read', 'donations:read', 'contacts:read'],
    created_at: '2023-01-01T00:00:00.000Z'
  }
];

export const initialPermissions: Permission[] = [
  { id: 'p-1', code: 'platform:manage', category: 'platform', description: 'Manage platform settings, all NGOs, and global configurations', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-2', code: 'ngos:read', category: 'ngos', description: 'View NGO details and profiles', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-3', code: 'ngos:write', category: 'ngos', description: 'Create or edit NGO profile and branding', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-4', code: 'ngos:delete', category: 'ngos', description: 'Deactivate or soft-delete NGO accounts', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-5', code: 'domains:read', category: 'domains', description: 'View connected domains and DNS instructions', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-6', code: 'domains:manage', category: 'domains', description: 'Add, verify, or remove custom domains', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-7', code: 'users:read', category: 'users', description: 'View admin users and team profiles', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-8', code: 'users:manage', category: 'users', description: 'Create, update, or revoke user permissions', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-9', code: 'content:read', category: 'content', description: 'View website pages and drafts', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-10', code: 'content:write', category: 'content', description: 'Edit website content, activities, team, and gallery', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-11', code: 'content:publish', category: 'content', description: 'Publish or unpublish website content and activities', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-12', code: 'content:delete', category: 'content', description: 'Delete website content items', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-13', code: 'donations:read', category: 'donations', description: 'View donation records, amounts, and donor receipts', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-14', code: 'donations:export', category: 'donations', description: 'Export donor lists and financial records to CSV', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-15', code: 'donations:manage', category: 'donations', description: 'Manage donation purposes and presets', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-16', code: 'contacts:read', category: 'contacts', description: 'View incoming contact form submissions', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-17', code: 'contacts:manage', category: 'contacts', description: 'Reply to, update status of, or archive contact messages', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 'p-18', code: 'audit:read', category: 'audit', description: 'View audit activity logs', created_at: '2023-01-01T00:00:00.000Z' }
];

const DEFAULT_PASSWORD_SALT = 'ngocms_secure_salt_2026';
const DEFAULT_PASSWORD_HASH = '32cfc5937fb54d133c78179efab9ca4852f442a5e18dfc6767816ec8292c3d6e'; // "change_this_strong_password"

export const initialUsers: AdminUser[] = [
  {
    id: 'usr-superadmin-001',
    email: 'admin@ngocms.org',
    full_name: 'Platform Super Administrator',
    role: 'super_admin',
    assigned_ngo_id: null,
    status: 'active',
    password_hash: DEFAULT_PASSWORD_HASH,
    password_salt: DEFAULT_PASSWORD_SALT,
    permissions: ['*'],
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-crawl-owner-001',
    email: 'owner@thecrawlfoundation.org',
    full_name: 'Vimmy Kaul (Trustee)',
    role: 'ngo_owner',
    assigned_ngo_id: CRAWL_NGO_ID,
    status: 'active',
    password_hash: DEFAULT_PASSWORD_HASH,
    password_salt: DEFAULT_PASSWORD_SALT,
    permissions: ['ngos:read', 'ngos:write', 'domains:read', 'domains:manage', 'users:read', 'users:manage', 'content:read', 'content:write', 'content:publish', 'content:delete', 'donations:read', 'donations:export', 'donations:manage', 'contacts:read', 'contacts:manage', 'audit:read'],
    created_at: '2023-06-01T00:00:00.000Z'
  },
  {
    id: 'usr-crawl-content-001',
    email: 'content@thecrawlfoundation.org',
    full_name: 'Rohan Sharma (Communications)',
    role: 'content_manager',
    assigned_ngo_id: CRAWL_NGO_ID,
    status: 'active',
    password_hash: DEFAULT_PASSWORD_HASH,
    password_salt: DEFAULT_PASSWORD_SALT,
    permissions: ['ngos:read', 'content:read', 'content:write', 'content:publish', 'content:delete', 'contacts:read'],
    created_at: '2023-06-01T00:00:00.000Z'
  },
  {
    id: 'usr-crawl-donation-001',
    email: 'donations@thecrawlfoundation.org',
    full_name: 'Pooja Verma (Accounts)',
    role: 'donation_manager',
    assigned_ngo_id: CRAWL_NGO_ID,
    status: 'active',
    password_hash: DEFAULT_PASSWORD_HASH,
    password_salt: DEFAULT_PASSWORD_SALT,
    permissions: ['ngos:read', 'donations:read', 'donations:export', 'donations:manage'],
    created_at: '2023-06-01T00:00:00.000Z'
  },
  {
    id: 'usr-vikas-admin-001',
    email: 'admin@vikasyouth.org',
    full_name: 'Amit Negi (Director)',
    role: 'ngo_owner',
    assigned_ngo_id: VIKAS_NGO_ID,
    status: 'active',
    password_hash: DEFAULT_PASSWORD_HASH,
    password_salt: DEFAULT_PASSWORD_SALT,
    permissions: ['ngos:read', 'ngos:write', 'domains:read', 'domains:manage', 'users:read', 'users:manage', 'content:read', 'content:write', 'content:publish', 'content:delete', 'donations:read', 'donations:export', 'donations:manage', 'contacts:read', 'contacts:manage', 'audit:read'],
    created_at: '2024-01-01T00:00:00.000Z'
  }
];

export const initialPages: CustomPage[] = [
  {
    id: 'page-crawl-volunteer',
    ngo_id: CRAWL_NGO_ID,
    slug: 'volunteer',
    title: 'Volunteer with The Crawl Foundation',
    content: 'Join our grassroots movement in Dehradun. As a volunteer, you can participate in educational mentorship, nutrition drives, and community health camps across Uttarakhand. Contact our volunteer coordinator at contact@thecrawlfoundation.org to get involved.',
    excerpt: 'Make a direct difference by offering your skills and time in healthcare, education, and women empowerment.',
    meta_title: 'Volunteer Opportunities | The Crawl Foundation Dehradun',
    meta_description: 'Join hands with The Crawl Foundation as a volunteer in healthcare and child education initiatives in Dehradun.',
    is_published: true,
    display_order: 1,
    created_at: '2023-06-01T00:00:00.000Z'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit-init-001',
    user_email: 'admin@ngocms.org',
    action: 'PLATFORM_INITIALIZED',
    entity_type: 'platform',
    entity_id: 'root',
    details: { platform: 'Centralized Multi-Tenant White-Label NGO Engine' },
    created_at: '2026-11-17T00:00:00.000Z'
  }
];

