import { SvgIcon } from "../enums/shared/SvgIcon";
import { ReactNode } from "react";

export interface SideBarItem {
  title: string;
  path: string;
  icon?: SvgIcon;
  description?: string;
  entityIcon?: string;
  open?: boolean; 
  adminOnly?: boolean; 
  permission?: string;
  items?: SideBarItem[];
  side?: ReactNode;
  exact?: boolean;
}
