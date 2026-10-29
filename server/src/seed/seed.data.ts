import type { Brand, Category } from "../products/consts/catalog.consts.js";
import { Role } from "../users/enums/role.enum.js";

type SeedProduct = {
  title: string;
  description: string;
  category: Category;
  brand: Brand;
  image: string;
  price: number;
  salePrice: number;
  totalStock: number;
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

export const DEMO_USERS = [
  { userName: "admin", email: "admin@example.com", password: "Admin12345", role: Role.Admin },
  { userName: "shopper", email: "shopper@example.com", password: "Shopper12345", role: Role.User },
];

export const DEMO_FEATURES = [
  "/banners/banner-1.webp",
  "/banners/banner-2.webp",
  "/banners/banner-3.webp",
];

export const DEMO_PRODUCTS: SeedProduct[] = [
  {
    title: "Essential Cotton T-Shirt",
    description:
      "Soft 100% cotton crew neck tee with a relaxed fit. A wardrobe basic that goes with everything.",
    category: "men",
    brand: "h&m",
    image: unsplash("photo-1521572163474-6864f9cf17ab"),
    price: 19.99,
    salePrice: 14.99,
    totalStock: 120,
  },
  {
    title: "Classic Leather Jacket",
    description:
      "Timeless biker jacket in smooth faux leather with zip pockets and a quilted lining.",
    category: "men",
    brand: "zara",
    image: unsplash("photo-1551028719-00167b16eac5"),
    price: 189,
    salePrice: 0,
    totalStock: 25,
  },
  {
    title: "Everyday Pullover Hoodie",
    description: "Brushed fleece hoodie with a kangaroo pocket and adjustable drawstring hood.",
    category: "men",
    brand: "adidas",
    image: unsplash("photo-1556821840-3a63f95609a7"),
    price: 64.99,
    salePrice: 0,
    totalStock: 60,
  },
  {
    title: "511 Slim Jeans",
    description: "Slim fit jeans in stretch denim that keeps its shape all day long.",
    category: "men",
    brand: "levi",
    image: unsplash("photo-1542272604-787c3835535d"),
    price: 79.99,
    salePrice: 59.99,
    totalStock: 45,
  },
  {
    title: "Skeleton Graphic Tee",
    description:
      "Relaxed black cotton tee with a bold skeleton hand print. Pairs well with light denim.",
    category: "women",
    brand: "levi",
    image: unsplash("photo-1503342217505-b0a15ec3261c"),
    price: 24.99,
    salePrice: 0,
    totalStock: 40,
  },
  {
    title: "Weekend Outfit Set",
    description: "Slim dark chinos paired with white canvas sneakers, an easy weekend look.",
    category: "men",
    brand: "zara",
    image: unsplash("photo-1544441893-675973e31985"),
    price: 159,
    salePrice: 129,
    totalStock: 20,
  },
  {
    title: "Satin Jogger Pants",
    description: "Soft satin joggers in blush pink with an elastic waist and cuffed ankles.",
    category: "women",
    brand: "h&m",
    image: unsplash("photo-1594633312681-425c7b97ccd1"),
    price: 49.99,
    salePrice: 0,
    totalStock: 35,
  },
  {
    title: "Original Graphic Tee",
    description: "Heavyweight cotton tee with a bold retro print on the front.",
    category: "men",
    brand: "adidas",
    image: unsplash("photo-1576566588028-4147f3842f27"),
    price: 54.99,
    salePrice: 44.99,
    totalStock: 50,
  },
  {
    title: "Crochet Knit Poncho",
    description: "Hand-finished crochet poncho with fringe trim, perfect for layering.",
    category: "women",
    brand: "levi",
    image: unsplash("photo-1434389677669-e08b4cac3105"),
    price: 29.99,
    salePrice: 0,
    totalStock: 70,
  },
  {
    title: "Baby Essentials Tee",
    description: "Soft organic cotton tee for little ones, gentle on sensitive skin.",
    category: "kids",
    brand: "h&m",
    image: unsplash("photo-1622290291468-a28f7a7dc6a8"),
    price: 39.99,
    salePrice: 0,
    totalStock: 30,
  },
  {
    title: "Kids Knit Cardigan",
    description: "Warm button-up knit cardigan for chilly days at school and play.",
    category: "kids",
    brand: "zara",
    image: unsplash("photo-1519238263530-99bdd11df2ea"),
    price: 34.99,
    salePrice: 27.99,
    totalStock: 40,
  },
  {
    title: "Kids Graphic Tee",
    description: "Colourful cotton tee for kids, pre-washed for extra softness.",
    category: "kids",
    brand: "puma",
    image: unsplash("photo-1503944583220-79d8926ad5e2"),
    price: 19.99,
    salePrice: 0,
    totalStock: 80,
  },
  {
    title: "Air Runner Sneakers",
    description: "Lightweight running shoes with breathable mesh and a cushioned sole.",
    category: "footwear",
    brand: "nike",
    image: unsplash("photo-1542291026-7eec264c27ff"),
    price: 129.99,
    salePrice: 99.99,
    totalStock: 30,
  },
  {
    title: "Court Classic Sneakers",
    description: "Low-top everyday sneakers with a padded collar and grippy rubber outsole.",
    category: "footwear",
    brand: "puma",
    image: unsplash("photo-1595950653106-6c9ebd614d3a"),
    price: 89.99,
    salePrice: 0,
    totalStock: 40,
  },
  {
    title: "Trail Runner Shoes",
    description: "Supportive running shoes with a rugged outsole for city and park runs.",
    category: "footwear",
    brand: "nike",
    image: unsplash("photo-1491553895911-0055eca6402d"),
    price: 109.99,
    salePrice: 0,
    totalStock: 3,
  },
  {
    title: "Urban Backpack",
    description: "Water-resistant backpack with a padded laptop sleeve and plenty of pockets.",
    category: "accessories",
    brand: "nike",
    image: unsplash("photo-1553062407-98eeb64c6a62"),
    price: 69.99,
    salePrice: 0,
    totalStock: 25,
  },
  {
    title: "Minimal Smartwatch",
    description:
      "Lightweight smartwatch with a soft silicone strap, step tracking and notifications.",
    category: "accessories",
    brand: "puma",
    image: unsplash("photo-1523275335684-37898b6baf30"),
    price: 149,
    salePrice: 119,
    totalStock: 15,
  },
  {
    title: "Round Sunglasses",
    description: "Retro round sunglasses with UV400 protection lenses.",
    category: "accessories",
    brand: "zara",
    image: unsplash("photo-1572635196237-14b3f281503f"),
    price: 39.99,
    salePrice: 0,
    totalStock: 0,
  },
];
