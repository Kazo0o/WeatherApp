export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Weather App",
  description: "Analytical Weather App",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Weather",
      href: "/weather",
    },
    {
      label: "Analytics",
      href: "/analyse",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Weather",
      href: "/weather",
    },
    {
      label: "Analytics",
      href: "/analyse",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/Kazo0o",
    linkedin: "https://www.linkedin.com/in/kizito-thibile/",
    portfolio: "https://kizitothibile.netlify.app",
  },
};
