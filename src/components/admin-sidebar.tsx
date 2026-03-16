"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Microscope,
  Stethoscope,
  Truck,
  Banknote,
  Box,
  MapPin,
  Megaphone,
  Bell,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronRight,
  Pill,
  ClipboardList,
  FileText,
  FlaskConical,
  TestTube,
  CalendarCheck,
  ScrollText,
  UserRound,
  Layers,
  CalendarClock,
  Users,
  UserCheck,
  PackageCheck,
  MapPinned,
  Crosshair,
  Building2,
  Hash,
  Globe,
  TicketPercent,
  Rocket,
  Target,
  Zap,
  MailOpen,
  ListChecks,
  DollarSign,
  TrendingUp,
  Funnel,
  Star,
  Heart,
  Activity,
  LogIn,
  AlertTriangle,
  Flag,
  Sliders,
  Wrench,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[];
}

const navModules: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Commerce",
        url: "/admin/commerce",
        icon: ShoppingCart,
        items: [
          { title: "Medicines", url: "/admin/commerce/medicines", icon: Pill },
          { title: "Inventory", url: "/admin/commerce/inventory", icon: Box },
          { title: "Orders", url: "/admin/commerce/orders", icon: ClipboardList },
          { title: "Prescriptions", url: "/admin/commerce/prescriptions", icon: FileText },
        ],
      },
      {
        title: "Diagnostics",
        url: "/admin/diagnostics",
        icon: Microscope,
        items: [
          { title: "Labs", url: "/admin/diagnostics/labs", icon: FlaskConical },
          { title: "Tests", url: "/admin/diagnostics/tests", icon: TestTube },
          { title: "Bookings", url: "/admin/diagnostics/bookings", icon: CalendarCheck },
          { title: "Reports", url: "/admin/diagnostics/reports", icon: ScrollText },
        ],
      },
      {
        title: "Consultations",
        url: "/admin/consultations",
        icon: Stethoscope,
        items: [
          { title: "Doctors", url: "/admin/consultations/doctors", icon: UserRound },
          { title: "Specialities", url: "/admin/consultations/specialities", icon: Layers },
          { title: "Doctor Slots", url: "/admin/consultations/doctor-slots", icon: CalendarClock },
          { title: "Appointments", url: "/admin/consultations/appointments", icon: CalendarCheck },
        ],
      },
      {
        title: "Logistics",
        url: "/admin/logistics",
        icon: Truck,
        items: [
          { title: "Delivery Partners", url: "/admin/logistics/delivery-partners", icon: Users },
          { title: "Delivery Agents", url: "/admin/logistics/delivery-agents", icon: UserCheck },
          { title: "Deliveries", url: "/admin/logistics/deliveries", icon: PackageCheck },
          { title: "Tracking", url: "/admin/logistics/tracking", icon: MapPinned },
        ],
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        title: "Finance",
        url: "/admin/finance",
        icon: Banknote,
        items: [
          { title: "Commissions", url: "/admin/finance/commissions", icon: DollarSign },
          { title: "Settlements", url: "/admin/finance/settlements", icon: ClipboardList },
          { title: "Vendor Payouts", url: "/admin/finance/vendor-payouts", icon: Banknote },
        ],
      },
      {
        title: "Inventory",
        url: "/admin/inventory",
        icon: Box,
        items: [
          { title: "Vendor Inventory", url: "/admin/inventory/vendor-inventory", icon: Building2 },
          { title: "Stock Movements", url: "/admin/inventory/stock-movements", icon: TrendingUp },
          { title: "Stock Alerts", url: "/admin/inventory/stock-alerts", icon: AlertTriangle },
        ],
      },
      {
        title: "Locations",
        url: "/admin/locations",
        icon: MapPin,
        items: [
          { title: "Cities", url: "/admin/locations/cities", icon: Building2 },
          { title: "Pincodes", url: "/admin/locations/pincodes", icon: Hash },
          { title: "Service Coverage", url: "/admin/locations/service-coverage", icon: Globe },
        ],
      },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        title: "Marketing",
        url: "/admin/marketing",
        icon: Megaphone,
        items: [
          { title: "Coupons", url: "/admin/marketing/coupons", icon: TicketPercent },
          { title: "Campaigns", url: "/admin/marketing/campaigns", icon: Rocket },
          { title: "Segments", url: "/admin/marketing/segments", icon: Target },
          { title: "Automation", url: "/admin/marketing/automation", icon: Zap },
        ],
      },
      {
        title: "Notifications",
        url: "/admin/notifications",
        icon: Bell,
        items: [
          { title: "Templates", url: "/admin/notifications/templates", icon: MailOpen },
          { title: "Logs", url: "/admin/notifications/logs", icon: ListChecks },
        ],
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
        items: [
          { title: "Revenue", url: "/admin/analytics/revenue", icon: DollarSign },
          { title: "GMV", url: "/admin/analytics/gmv", icon: TrendingUp },
          { title: "Funnels", url: "/admin/analytics/funnels", icon: Funnel },
          { title: "Vendor Performance", url: "/admin/analytics/vendor-performance", icon: Star },
          { title: "Customer LTV", url: "/admin/analytics/customer-ltv", icon: Heart },
        ],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Security",
        url: "/admin/security",
        icon: ShieldCheck,
        items: [
          { title: "Audit Logs", url: "/admin/security/audit-logs", icon: ScrollText },
          { title: "Admin Activity", url: "/admin/security/admin-activity", icon: Activity },
          { title: "Login Attempts", url: "/admin/security/login-attempts", icon: LogIn },
          { title: "Security Events", url: "/admin/security/security-events", icon: AlertTriangle },
        ],
      },
      {
        title: "Platform",
        url: "/admin/platform",
        icon: Settings,
        items: [
          { title: "Feature Flags", url: "/admin/platform/feature-flags", icon: Flag },
          { title: "Module Settings", url: "/admin/platform/module-settings", icon: Sliders },
          { title: "Platform Settings", url: "/admin/platform/platform-settings", icon: Wrench },
        ],
      },
    ],
  },
];

function NavItemCollapsible({ item, pathname }: { item: NavItem; pathname: string }) {
  const isParentActive = pathname === item.url || pathname.startsWith(item.url + "/");

  if (!item.items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link href={item.url} />}
          tooltip={item.title}
          isActive={isParentActive}
          className="hover:bg-sidebar-accent transition-all duration-200"
        >
          <item.icon className="w-4 h-4" />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen={isParentActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isParentActive}
              className="hover:bg-sidebar-accent transition-all duration-200"
            />
          }
        >
          <item.icon className="w-4 h-4" />
          <span>{item.title}</span>
          <ChevronRight className="ml-auto w-4 h-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.url}>
                <SidebarMenuSubButton
                  render={<Link href={subItem.url} />}
                  isActive={pathname === subItem.url}
                >
                  <subItem.icon className="w-3.5 h-3.5" />
                  {subItem.title}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/50">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-sidebar-border/50">
        <Link href="/admin" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25 text-sm font-black">
            O
          </div>
          <span className="group-data-[collapsible=icon]:hidden bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            ONE MEDI
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-2">
        {navModules.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItemCollapsible key={item.url} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/admin/platform/platform-settings" />}
              tooltip="Settings"
              className="hover:bg-sidebar-accent transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
