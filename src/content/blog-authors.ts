export type BlogAuthorProfile = {
  name: string;
  avatar: string;
  bio: string;
  isDefault?: boolean;
  aliases?: string[];
};

export const blogAuthorProfiles: BlogAuthorProfile[] = [
  {
    name: "David Norris",
    avatar: "/assets/david-norris-B7MVbvOm.jpg",
    bio: "Deputy GM of Strong Energy D/A/CH",
    isDefault: true,
    aliases: ["Strong Energy"]
  },
  {
    name: "Farideh M. Nezamabadi",
    avatar: "/assets/farideh-nezamabadi-DrisO523.jpg",
    bio: "Order Operation Management"
  },
  {
    name: "Jason Gao",
    avatar: "/assets/jason-gao-DwOvahh8.jpg",
    bio: "Product Engineer PV & Battery"
  },
  {
    name: "Michael Müller",
    avatar: "/assets/michael-mueller-BnLIIN3Z.jpg",
    bio: "Head of Marketing",
    aliases: ["Michael Mueller"]
  },
  {
    name: "Niklas Balakowski",
    avatar: "/assets/niklas-balakowski-DyTINIJV.jpg",
    bio: "Key Account Manager"
  },
  {
    name: "Nils Beck",
    avatar: "/assets/nils-beck-BQ8OoITI.jpg",
    bio: "Head of Technical Solutions"
  }
];

const defaultBlogAuthor = blogAuthorProfiles.find((author) => author.isDefault) || blogAuthorProfiles[0];

function normalizeAuthorName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getBlogAuthorProfile(authorName: string | null | undefined) {
  const normalized = normalizeAuthorName(authorName || "");
  if (!normalized) return defaultBlogAuthor;

  const profile = blogAuthorProfiles.find((author) => {
    const names = [author.name, ...(author.aliases || [])].map(normalizeAuthorName);
    return names.some((name) => normalized.includes(name) || name.includes(normalized));
  });

  return profile || null;
}
