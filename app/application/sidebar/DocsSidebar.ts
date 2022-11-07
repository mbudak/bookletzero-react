import { SideBarItem } from "./SidebarItem";
export const DocsSidebar: SideBarItem[] = [
  {
    title: "",
    path: "/docs",

    exact: true,
    items: [
      {
        title: "Introduction",
        path: "/docs",

        exact: true,
      },
    ],
  },
  {
    title: "Getting Started",
    path: "",

    items: [

      // {
      //   title: "Code structure",
      //   path: "/docs/code-structure",
      //
      // },
      {
        title: "Roadmap",
        path: "/docs/roadmap",
      },
      {
        title: "License",
        path: "/docs/license",
      },
      {
        title: "Community",
        path: "/docs/community",
      },
    ],
  },
  {
    title: "Product",
    path: "",
    items: [
      {
        title: "Features",
        path: "/docs/features",

        items: [
          {
            title: "All features",
            path: "/docs/features",

            exact: true,
          },
          {
            title: "Admin Portal",
            path: "/docs/features/admin-portal",

            items: [
              {
                title: "Sidebar Menu",
                path: "/docs/features/admin-portal/sidebar-menu",
              },
              {
                title: "Dashboard",
                path: "/docs/features/admin-portal/dashboard",
              },
              {
                title: "Tenants",
                path: "/docs/features/admin-portal/tenants",
              },
              {
                title: "Users",
                path: "/docs/features/admin-portal/users",
              },
              {
                title: "Blog",
                path: "/docs/features/admin-portal/blog",
              },
              {
                title: "Entities",
                path: "/docs/features/admin-portal/entities",
              },
              {
                title: "API",
                path: "/docs/features/admin-portal/api",
              },
              {
                title: "Audit Trails",
                path: "/docs/features/admin-portal/audit-trails",
              },
              {
                title: "Docs",
                path: "/docs/features/admin-portal/docs",
              },
              {
                title: "Set up Pricing Plans",
                path: "/docs/features/admin-portal/set-up-pricing-plans",
              },
              {
                title: "Set up Email Templates",
                path: "/docs/features/admin-portal/set-up-email-templates",
              },
            ],
          },
          {
            title: "App Portal",
            path: "/docs/features/app-portal",
            items: [
              {
                title: "Sidebar Menu",
                path: "/docs/features/app-portal/sidebar-menu",
              },
              {
                title: "Dashboard",
                path: "/docs/features/app-portal/dashboard",
              },
              {
                title: "Profile",
                path: "/docs/features/app-portal/settings-profile",
              },
              {
                title: "Members",
                path: "/docs/features/app-portal/settings-members",
              },
              {
                title: "Subscription",
                path: "/docs/features/app-portal/settings-subscription",
              },
              {
                title: "Linked Accounts",
                path: "/docs/features/app-portal/settings-linked-accounts",
              },
              {
                title: "Account",
                path: "/docs/features/app-portal/settings-account",
              },
              {
                title: "API",
                path: "/docs/features/app-portal/settings-api",
              },
              {
                title: "Audit Trails",
                path: "/docs/features/app-portal/settings-audit-trails",
              },
            ],
          },
          {
            title: "Marketing",
            path: "/docs/features/marketing",
          },
          {
            title: "Authentication",
            path: "/docs/features/authentication",
          },
          {
            title: "Subscriptions",
            path: "/docs/features/subscriptions",
          },
          {
            title: "Blogging",
            path: "/docs/features/blogging",
          },
          {
            title: "Entity Builder",
            path: "/docs/features/entity-builder",
          },
          {
            title: "API",
            path: "/docs/features/api",
          },
          {
            title: "Webhooks",
            path: "/docs/features/webhooks",
          },
          {
            title: "Audit Trails",
            path: "/docs/features/audit-trails",
          },
          {
            title: "Roles & Permissions",
            path: "/docs/features/roles-and-permissions",
          },
          {
            title: "Events and Webhooks",
            path: "/docs/features/events-and-webhooks",
          },
        ],
      },
    
    ],
  },
  {
    title: "Learning Center",
    path: "/docs/learning-center",
    items: [
      { title: "Learning Center", path: "/docs/learning-center", exact: true },
      {
        title: "Quick Start",
        path: "/docs/learning-center/tutorials/quick-start",
        exact: true,
      }
    ],
  },
 
];
