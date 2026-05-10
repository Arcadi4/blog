const emptyItem = { name: "\n", href: "" };

const menuItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Projects", href: "/projects" },
  { name: "Friend Links", href: "/links" },
  { name: "Tags", href: "/tags" },
  { name: "All Posts", href: "/all" },
];

const menuItemsErrorPage = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Projects", href: "/projects" },
  { name: "Friend Links", href: "/links" },
  emptyItem,
  { name: "Home", href: "/" },
  emptyItem,
  { name: "Tags", href: "/tags" },
  { name: "All Posts", href: "/all" },
];

const socialMediaItems = [
  { name: "GitHub", href: "https://github.com/arcadi4" },
  { name: "Bilibili", href: "https://space.bilibili.com/499244418" },
  { name: "Twitter", href: "https://x.com/_4rcadia" },
];

type LinkItem = {
  name: string;
  href: string;
};

export {
  emptyItem,
  menuItems,
  menuItemsErrorPage,
  socialMediaItems,
  type LinkItem,
};
