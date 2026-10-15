export interface SiteConfig {
  name: string;
  adminName: string;
  shortName: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    keywords: string[];
    defaultImage: string;
  };
  contact: {
    email: string;
    phone: string;
    address: {
      line1: string;
      line2: string;
    };
    serviceAreas: string[];
    workingHours?: string;
  };
  cloudinary?: {
    cloudName: string;
    uploadPreset: string;
  };
  payment?: {
    methods: string[];
    currency: string;
    upiId?: string;
  };
  tax?: {
    rate: number;
    defaultRate?: number;
  };
}
