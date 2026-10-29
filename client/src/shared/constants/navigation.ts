import { LayoutDashboard, PackageSearch, ShoppingBasket } from "lucide-react";

export const SHOP_NAV = [
  { label: "Home", to: "/shop/home" },
  { label: "Products", to: "/shop/listing" },
  { label: "Men", to: "/shop/listing?category=men" },
  { label: "Women", to: "/shop/listing?category=women" },
  { label: "Kids", to: "/shop/listing?category=kids" },
  { label: "Footwear", to: "/shop/listing?category=footwear" },
  { label: "Accessories", to: "/shop/listing?category=accessories" },
  { label: "Search", to: "/shop/search" },
];

export const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: ShoppingBasket },
  { label: "Orders", to: "/admin/orders", icon: PackageSearch },
];
