export const PACKAGE_LIMITS = {
  Primary: {
    listings: 5,
    analytics: false,
    prioritySupport: false,
    featured: false,
  },
  Secondary: {
    listings: 10,
    analytics: true,
    prioritySupport: true,
    featured: false,
  },
  Premium: {
    listings: Infinity,
    analytics: true,
    prioritySupport: true,
    featured: true,
  },
};