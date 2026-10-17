export const description =
  "Max Beatty is a software engineering leader in San Francisco who designs and builds products for the web and mobile.";

export const introduction = [
  "I'm an engineering leader based in San Francisco. I enjoy wearing many hats to design and build products for the web and mobile from scratch.",
  "This is my personal website and archive of writing, projects, and links collected over the years. My work spans JavaScript, developer tools, payments, and product engineering, including Pool, Cash App Pay, Square's Web Payments SDK, and dotenv.",
  "Browse the articles for technical notes and things I've found interesting, explore the projects for work I've contributed to, or visit the about page for more about me. Older posts reflect their publication date; linked resources and technical advice may have changed since then.",
];

export const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://maxbeatty.com/#person",
  name: "Max Beatty",
  description,
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
