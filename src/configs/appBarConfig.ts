export interface NavItem {
    label: string;
    href: string;
    isExternal?: boolean;
}

const appBarConfig: NavItem[] = [
    {
        label: "Blogs",
        href: "/posts",
    },
    {
        label: "Projects",
        href: "/projects",
    },
    {
        label: "Explore",
        href: "/explore",
    },
    {
        label : "Contact",
        href : "contact"
    }
];

export default appBarConfig;