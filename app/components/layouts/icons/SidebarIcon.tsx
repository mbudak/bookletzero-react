import { SvgIcon } from "~/application/enums/shared/SvgIcon";

import IconAdmin from "./IconAdmin";
import IconTenants from "./IconTenants";
import IconUsers from "./IconUsers";
import IconPricing from "./IconPricing";
import IconNavigation from "./IconNavigation";
import IconComponents from "./IconComponents";

import IconApp from "./IconApp";
import IconDashboard from "./IconDashboard";
import IconSettings from "./IconSettings";
import IconLinks from "./IconLinks";
import IconProviders from "./IconProviders";
import IconClients from "./IconClients";
import IconEmails from "./IconEmails";
import IconMembers from "./IconMembers";
import IconProfile from "./IconProfile";
import IconHistory from "./IconHistory";
import IconCode from "./IconCode";
import IconBlog from "./IconBlog";
import IconEntities from "./IconEntities";
import { SideBarItem } from "~/application/sidebar/SidebarItem";
import EntityIcon from "./EntityIcon";
import IconKeys from "./IconKeys";
import IconDocs from "./IconDocs";
import IconRoles from "./IconRoles";
import IconEvents from "./IconEvents";
import IconAnalytics from "./IconAnalytics";
// import IconEntities from "./IconEntities";

interface Props {
  className: string;
  item: SideBarItem;
}

export default function SidebarIcon({ className, item }: Props) {
  return (
    <span>
      {/* Core */}
      {item.icon === SvgIcon.USERS && <IconUsers className={className} />}
      {item.icon === SvgIcon.ROLES && <IconRoles className={className} />}
      {item.icon === SvgIcon.PRICING && <IconPricing className={className} />}
      {item.icon === SvgIcon.EMAILS && <IconEmails className={className} />}
      {item.icon === SvgIcon.NAVIGATION && <IconNavigation className={className} />}
      {item.icon === SvgIcon.COMPONENTS && <IconComponents className={className} />}
      {item.icon === SvgIcon.MEMBERS && <IconMembers className={className} />}
      {item.icon === SvgIcon.PROFILE && <IconProfile className={className} />}
      {item.icon === SvgIcon.APP && <IconApp className={className} />}
      {item.icon === SvgIcon.DASHBOARD && <IconDashboard className={className} />}
      {item.icon === SvgIcon.SETTINGS && <IconSettings className={className} />}
      {item.icon === SvgIcon.SETUP && <IconCode className={className} />}
      {item.icon === SvgIcon.LOGS && <IconHistory className={className} />}
      {item.icon === SvgIcon.EVENTS && <IconEvents className={className} />}
      {item.icon === SvgIcon.BLOG && <IconBlog className={className} />}
      {item.icon === SvgIcon.ENTITIES && <IconEntities className={className} />}
      {item.icon === SvgIcon.KEYS && <IconKeys className={className} />}
      {item.icon === SvgIcon.DOCS && <IconDocs className={className} />}
      {/* App */}
      {item.icon === SvgIcon.LINKS && <IconLinks className={className} />}
      {item.icon === SvgIcon.PROVIDERS && <IconProviders className={className} />}
      {item.icon === SvgIcon.CLIENTS && <IconClients className={className} />}
      {item.entityIcon && <EntityIcon className={className} icon={item.entityIcon} title={item.title} />}

      {item.icon === SvgIcon.ANALYTICS && <IconAnalytics className={className} />}
    </span>
  );
}
