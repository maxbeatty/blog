export const description =
  "Max Beatty is a product-minded software engineer building zero-to-one products, developer platforms, and financial systems.";

export const introduction = [
  "I'm a product-minded software engineer with 15+ years of experience building zero-to-one products and scaling them into production. I pair hands-on technical depth with engineering leadership to ship products, developer platforms, and complex financial systems.",
  "I'm currently the Engineering Lead at Pool, where I built the banking platform from the ground up and an OAuth-secured MCP platform that lets AI agents safely access financial data and move money. Before that, I was a founding engineer at Browserbase and a tech lead at Block, where I architected Square's Web Payments SDK and led Pay Kit for Cash App Pay. I also maintained dotenv for seven years.",
  "This site is an archive of my writing, projects, and links collected over the years. Older posts reflect their publication date; linked resources and technical advice may have changed since then.",
];

export const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://maxbeatty.com/#person",
  name: "Max Beatty",
  description,
  jobTitle: "Engineering Lead",
  worksFor: {
    "@type": "Organization",
    name: "Pool",
    url: "https://poolmoney.com/",
  },
  url: "https://maxbeatty.com/",
  image: "https://maxbeatty.com/profile.jpeg",
  sameAs: [
    "https://www.linkedin.com/in/maxbeatty/",
    "https://github.com/maxbeatty",
    "https://x.com/maxbeatty",
  ],
};

export function serializeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
