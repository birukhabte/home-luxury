// Utility functions for generating and handling product slugs

export const generateProductSlug = (productName: string): string => {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing whitespace
};

export const getProductDetailUrl = (productName: string): string => {
  const slug = generateProductSlug(productName);
  return `/${slug}/sofa-detail`;
};