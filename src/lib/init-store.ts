import fs from 'fs';
import path from 'path';
import {
  initialNgos,
  initialSiteSettings,
  initialHomepageContent,
  initialActivities,
  initialTeamMembers,
  initialGalleryItems,
  initialDonationPurposes,
  initialDonations,
  initialContacts
} from './data-store';

const dataDir = path.resolve(process.cwd(), '../shared-data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const storePath = path.join(dataDir, 'store.json');

const initialData = {
  ngos: initialNgos,
  siteSettings: initialSiteSettings,
  homepageContent: initialHomepageContent,
  activities: initialActivities,
  teamMembers: initialTeamMembers,
  galleryItems: initialGalleryItems,
  donationPurposes: initialDonationPurposes,
  donations: initialDonations,
  contacts: initialContacts
};

fs.writeFileSync(storePath, JSON.stringify(initialData, null, 2), 'utf-8');
console.log('Successfully initialized shared-data/store.json at ' + storePath);
