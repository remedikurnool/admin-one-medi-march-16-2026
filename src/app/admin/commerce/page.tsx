import { ModulePlaceholder } from "@/components/module-placeholder";
import { ShoppingCart } from "lucide-react";

export default function CommercePage() {
  return (
    <ModulePlaceholder
      title="Commerce"
      description="End-to-end management of the ONE MEDI marketplace — orders, products, and customers."
      icon={<ShoppingCart className="h-5 w-5" />}
      features={[
        "Order Management & Tracking",
        "Product Catalog & Inventory Sync",
        "Customer 360 View",
        "Returns & Refund Processing",
        "Pricing & Discount Rules",
        "Seller Management",
      ]}
      badgeText="Core Module"
    />
  );
}
