export const generateSlug = (string: string) => {
  const slug = string
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();

  return slug;
};
