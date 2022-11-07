import { SideBarItem } from "./SidebarItem";
import { SvgIcon } from "../enums/shared/SvgIcon";


export const AccountSidebar: SideBarItem[] = [
    {
      title: "Welcome",
      path: "",
      items: [
        {
          title: "Dashboard",
          path: "/account/dashboard",
          icon: SvgIcon.DASHBOARD,
        },
       
        {
          title: "Learn",
          path: "/admin/learn",
          icon: SvgIcon.BLOG,
          // permission: "admin.blog.view",
        },
        {
          title: "Logs",
          path: "/admin/audit-trails",
          icon: SvgIcon.LOGS,
          // permission: "admin.auditTrails.view",
        },
        {
          title: "CRM",
          path: "/admin/crm",
          icon: SvgIcon.CLIENTS,
        },
        {
          title: "Emails",
          path: "/admin/emails",
          icon: SvgIcon.EMAILS,
        }
      ],
    }
  ];
  