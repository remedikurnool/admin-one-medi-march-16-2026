"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
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
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Building2,
  Hash,
  Globe,
  TicketPercent,
  Rocket,
  Target,
  Zap,
  MailOpen,
  ListChecks,
  Funnel,
  Star,
  Heart,
  Activity,
  LogIn,
  Flag,
  Sliders,
  Wrench,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

const searchModules = [
  {
    group: "Quick Navigation",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
      { title: "Orders", url: "/admin/commerce/orders", icon: ClipboardList },
      { title: "Consultation Bookings", url: "/admin/consultations/appointments", icon: CalendarCheck },
      { title: "Lab Bookings", url: "/admin/diagnostics/bookings", icon: FlaskConical },
    ],
  },
  {
    group: "Commerce",
    items: [
      { title: "Medicines", url: "/admin/commerce/medicines", icon: Pill },
      { title: "Commerce Inventory", url: "/admin/commerce/inventory", icon: Box },
      { title: "Orders", url: "/admin/commerce/orders", icon: ClipboardList },
      { title: "Prescriptions", url: "/admin/commerce/prescriptions", icon: FileText },
    ],
  },
  {
    group: "Diagnostics",
    items: [
      { title: "Labs", url: "/admin/diagnostics/labs", icon: FlaskConical },
      { title: "Tests", url: "/admin/diagnostics/tests", icon: TestTube },
      { title: "Diagnostic Bookings", url: "/admin/diagnostics/bookings", icon: CalendarCheck },
      { title: "Diagnostic Reports", url: "/admin/diagnostics/reports", icon: ScrollText },
    ],
  },
  {
    group: "Consultations",
    items: [
      { title: "Doctors", url: "/admin/consultations/doctors", icon: UserRound },
      { title: "Specialities", url: "/admin/consultations/specialities", icon: Layers },
      { title: "Doctor Slots", url: "/admin/consultations/doctor-slots", icon: CalendarClock },
      { title: "Appointments", url: "/admin/consultations/appointments", icon: CalendarCheck },
    ],
  },
  {
    group: "Logistics",
    items: [
      { title: "Delivery Partners", url: "/admin/logistics/delivery-partners", icon: Users },
      { title: "Delivery Agents", url: "/admin/logistics/delivery-agents", icon: UserCheck },
      { title: "Deliveries", url: "/admin/logistics/deliveries", icon: PackageCheck },
      { title: "Tracking", url: "/admin/logistics/tracking", icon: MapPinned },
    ],
  },
  {
    group: "Finance",
    items: [
      { title: "Commissions", url: "/admin/finance/commissions", icon: DollarSign },
      { title: "Settlements", url: "/admin/finance/settlements", icon: ClipboardList },
      { title: "Vendor Payouts", url: "/admin/finance/vendor-payouts", icon: Banknote },
    ],
  },
  {
    group: "Inventory",
    items: [
      { title: "Vendor Inventory", url: "/admin/inventory/vendor-inventory", icon: Building2 },
      { title: "Stock Movements", url: "/admin/inventory/stock-movements", icon: TrendingUp },
      { title: "Stock Alerts", url: "/admin/inventory/stock-alerts", icon: AlertTriangle },
    ],
  },
  {
    group: "Locations",
    items: [
      { title: "Cities", url: "/admin/locations/cities", icon: Building2 },
      { title: "Pincodes", url: "/admin/locations/pincodes", icon: Hash },
      { title: "Service Coverage", url: "/admin/locations/service-coverage", icon: Globe },
    ],
  },
  {
    group: "Marketing",
    items: [
      { title: "Coupons", url: "/admin/marketing/coupons", icon: TicketPercent },
      { title: "Campaigns", url: "/admin/marketing/campaigns", icon: Rocket },
      { title: "Segments", url: "/admin/marketing/segments", icon: Target },
      { title: "Automation", url: "/admin/marketing/automation", icon: Zap },
    ],
  },
  {
    group: "Notifications",
    items: [
      { title: "Templates", url: "/admin/notifications/templates", icon: MailOpen },
      { title: "Notification Logs", url: "/admin/notifications/logs", icon: ListChecks },
    ],
  },
  {
    group: "Analytics",
    items: [
      { title: "Revenue", url: "/admin/analytics/revenue", icon: DollarSign },
      { title: "GMV", url: "/admin/analytics/gmv", icon: TrendingUp },
      { title: "Funnels", url: "/admin/analytics/funnels", icon: Funnel },
      { title: "Vendor Performance", url: "/admin/analytics/vendor-performance", icon: Star },
      { title: "Customer LTV", url: "/admin/analytics/customer-ltv", icon: Heart },
    ],
  },
  {
    group: "Security",
    items: [
      { title: "Audit Logs", url: "/admin/security/audit-logs", icon: ScrollText },
      { title: "Admin Activity", url: "/admin/security/admin-activity", icon: Activity },
      { title: "Login Attempts", url: "/admin/security/login-attempts", icon: LogIn },
      { title: "Security Events", url: "/admin/security/security-events", icon: AlertTriangle },
    ],
  },
  {
    group: "Platform",
    items: [
      { title: "Feature Flags", url: "/admin/platform/feature-flags", icon: Flag },
      { title: "Module Settings", url: "/admin/platform/module-settings", icon: Sliders },
      { title: "Platform Settings", url: "/admin/platform/platform-settings", icon: Wrench },
    ],
  },
]

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search everything...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search modules, pages, actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchModules.map((group, idx) => (
            <React.Fragment key={group.group}>
              {idx > 0 && <CommandSeparator />}
              <CommandGroup heading={group.group}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.url + item.title}
                    onSelect={() => runCommand(() => router.push(item.url))}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
