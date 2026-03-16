"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GlobalSearch } from "@/components/global-search";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Bell,
  Plus,
  ShoppingCart,
  Pill,
  UserRound,
  TicketPercent,
  FileBarChart,
  Moon,
  Sun,
  LogOut,
  Settings,
  User,
  CreditCard,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumb */}
      <div className="flex-1 flex items-center gap-4">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            {paths.slice(1).map((path, index) => (
              <React.Fragment key={path + index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === paths.length - 2 ? (
                    <BreadcrumbPage className="capitalize">
                      {path.replace(/-/g, " ")}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={`/${paths.slice(0, index + 2).join("/")}`}
                      className="capitalize"
                    >
                      {path.replace(/-/g, " ")}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-2">
        {/* Global search */}
        <div className="relative hidden sm:flex items-center">
          <GlobalSearch />
        </div>

        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="outline"
              size="icon"
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground border-dashed cursor-pointer"
            />
          }>
            <Plus className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => router.push("/admin/commerce/orders")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                New Order
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => router.push("/admin/commerce/medicines")}
              >
                <Pill className="mr-2 h-4 w-4" />
                Add Medicine
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => router.push("/admin/consultations/doctors")}
              >
                <UserRound className="mr-2 h-4 w-4" />
                Add Doctor
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => router.push("/admin/marketing/coupons")}
              >
                <TicketPercent className="mr-2 h-4 w-4" />
                Create Coupon
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => router.push("/admin/analytics/revenue")}
              >
                <FileBarChart className="mr-2 h-4 w-4" />
                Generate Report
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        </Button>

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="ghost"
              className="relative cursor-pointer h-9 w-9 rounded-full"
            />
          }>
            <Avatar className="h-9 w-9 border-2 border-primary/20 ring-2 ring-background">
              <AvatarImage src="/avatars/01.png" alt="Admin" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs font-bold">
                AD
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src="/avatars/01.png" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold leading-none">Operations Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@onemedi.com
                  </p>
                  <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary w-fit mt-0.5">
                    Super Admin
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                Team
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
