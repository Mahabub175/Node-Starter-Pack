import slugify from "slugify";

export const generateSlug = (input: string): string => {
  const baseSlug = slugify(input, {
    lower: true,
    strict: true,
    replacement: "-",
  });

  const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  return `${baseSlug}-${dateSuffix}`;
};
