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
          title: "Subscriptions",
          path: "/account/settings/subscription",
          icon: SvgIcon.PROFILE,
        },
       
      ],
    }
  ];
  