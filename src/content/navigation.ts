import type { NavItem } from "@/types/content";
import { getFooterLegalNavigation, getMainNavigation } from "@/lib/i18n";

export const mainNavigation: NavItem[] = getMainNavigation("de");

export const mainNavigationEn: NavItem[] = getMainNavigation("en");

export const footerLegalNavigationEn: NavItem[] = getFooterLegalNavigation("en");

export const footerLegalNavigation: NavItem[] = getFooterLegalNavigation("de");
