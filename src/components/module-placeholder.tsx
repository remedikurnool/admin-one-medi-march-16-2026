"use client";

import { Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  badgeText?: string;
}

export function ModulePlaceholder({ title, description, icon, features, badgeText }: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {badgeText && <Badge variant="secondary">{badgeText}</Badge>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature, i) => (
          <Card key={i} className="glass-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{feature}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-dashed border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Construction className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Module Under Development</CardTitle>
          </div>
          <CardDescription>
            The <strong>{title}</strong> module is being built. All features and data tables will be available in the next sprint.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
