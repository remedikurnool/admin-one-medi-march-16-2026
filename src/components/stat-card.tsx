"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

export function StatCard({ title, value, change, changeType, icon, description }: StatCardProps) {
  return (
    <Card className="glass-card hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {changeType === "positive" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
          {changeType === "negative" && <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
          {changeType === "neutral" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
          <p
            className={cn("text-xs font-medium", {
              "text-emerald-500": changeType === "positive",
              "text-red-500": changeType === "negative",
              "text-muted-foreground": changeType === "neutral",
            })}
          >
            {change}
          </p>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
