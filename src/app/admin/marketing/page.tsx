import { ModulePlaceholder } from "@/components/module-placeholder";
import { Megaphone } from "lucide-react";

export default function MarketingPage() {
  return (
    <ModulePlaceholder
      title="Marketing"
      description="Drive growth with campaigns, coupons, push promotions, and loyalty programs."
      icon={<Megaphone className="h-5 w-5" />}
      features={[
        "Campaign Management",
        "Coupon & Promo Codes",
        "Push Notification Campaigns",
        "Loyalty Points Program",
        "A/B Testing",
        "Performance Analytics",
      ]}
      badgeText="Growth Module"
    />
  );
}
