export const handleSlug = (text) => {
  return text.toLowerCase().replace(/\W+/g, '-');
};
