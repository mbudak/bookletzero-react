import { SideBarItem } from "./SidebarItem";
import { SvgIcon } from "../enums/shared/SvgIcon";

export const AdminSidebar: SideBarItem[] = [
  {
    title: "Admin",
    path: "",
    items: [
      {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: SvgIcon.DASHBOARD,
      },
      {
        title: "app.sidebar.accountsAndUsers",
        path: "/admin/accounts",
        icon: SvgIcon.COMPONENTS,
        items: [
          {
            title: "admin.tenants.title",
            path: "/admin/accounts",
            // icon: SvgIcon.TENANTS,
            items: [],
            permission: "admin.accounts.view",
          },
          {
            title: "models.user.plural",
            path: "/admin/users",
            // icon: SvgIcon.USERS,
            items: [],
            permission: "admin.users.view",
          },
          {
            title: "app.sidebar.rolesAndPermissions",
            path: "/admin/roles-and-permissions",
            // icon: SvgIcon.ROLES,
            items: [],
            permission: "admin.roles.view",
          },
          {
            title: "models.blacklist.object",
            path: "/admin/blacklist",
            // icon: SvgIcon.USERS,
            items: [],
            permission: "admin.blacklist.view",
          },
        ],
        permission: "admin.accounts.view",
      },
      {
        title: "Blog",
        path: "/admin/blog",
        icon: SvgIcon.BLOG,       
      },
      {
        title: "Events & Webhooks",
        path: "/admin/events",
        icon: SvgIcon.EVENTS,      
      },
      {
        title: "Question Classes",
        path: "/admin/classes",
        icon: SvgIcon.ENTITIES,
      },
      {
        title: "emails",
        path: "/admin/emails",
        icon: SvgIcon.EMAILS,
      },
      {
        title: "Docs",
        path: "/docs",
        icon: SvgIcon.DOCS,
      },
      {
        title: "Setup",
        path: "/admin/setup",
        icon: SvgIcon.SETUP,
        items: [
          {
            title: "admin.pricing.title",
            path: "/admin/setup/pricing",
            items: [],
          },
          {
            title: "admin.emails.title",
            path: "/admin/setup/emails",
            items: [],
          },
        ],
      },
      // {
      //   title: "admin.navigation.title",
      //   path: "/admin/navigation",
      //   icon: SvgIcon.NAVIGATION,
      //   items: [],
      // },
      // {
      //   title: "admin.components.title",
      //   path: "/admin/components",
      //   icon: SvgIcon.COMPONENTS,
      //   items: [],
      // },
      // {
      //   title: "app.navbar.profile",
      //   path: "/admin/profile",
      //   icon: SvgIcon.PROFILE,
      // },
      // {
      //   title: "app.sidebar.setup",
      //   path: "/admin/setup",
      //   icon: SvgIcon.SETTINGS,
      //   // items: [
      //   // ],
      // },
      // {
      //   title: "settings.members.title",
      //   path: "/admin/members",
      //   icon: SvgIcon.MEMBERS,
      //   tenantUserTypes: [TenantUserType.OWNER, TenantUserType.ADMIN],
      // },
    ],
  },
  {
    title: "App",
    path: "",
    items: [
      {
        title: "Switch to App",
        path: "/account",
        icon: SvgIcon.APP,
        items: [],
        exact: true,
      },
    ],
  },
];
