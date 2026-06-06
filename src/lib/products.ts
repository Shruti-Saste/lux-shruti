export type Product = {
  id: string;
  name: string;
  subtitle: string;
  category: "Handbags" | "Watches" | "Shoes" | "Jewelry" | "Ready-to-Wear";
  price: number;
  rating: number;
  reviews: number;
  colors: { name: string; hex: string }[];
  materials: string[];
  description: string;
  craft: string;
  origin: string;
  inStock: boolean;
  limited?: boolean;
  /** Visual 3D primitive seed */
  model: "handbag" | "watch" | "heel" | "ring" | "scarf";
};

export const products: Product[] = [
  {
    id: "mona-midnight",
    name: "The Mona",
    subtitle: "Midnight Black Handbag",
    category: "Handbags",
    price: 3200,
    rating: 4.8,
    reviews: 234,
    colors: [
      { name: "Midnight", hex: "#0A0A0A" },
      { name: "Burgundy", hex: "#5C1A1B" },
      { name: "Champagne", hex: "#D4AF37" },
      { name: "Ivory", hex: "#F4ECD8" },
    ],
    materials: ["Italian calfskin", "Gold-plated hardware", "Suede lining"],
    description:
      "Hand-stitched in our Florentine atelier, The Mona is sculpted from a single hide of calfskin, finished with a softly burnished patina.",
    craft: "32 hours of handwork. Edges hand-painted in seven coats.",
    origin: "Florence, Italy",
    inStock: true,
    model: "handbag",
  },
  {
    id: "celeste-watch",
    name: "Céleste",
    subtitle: "18K Skeleton Automatic",
    category: "Watches",
    price: 18900,
    rating: 4.9,
    reviews: 87,
    colors: [
      { name: "Champagne Gold", hex: "#D4AF37" },
      { name: "Onyx", hex: "#1C1C1C" },
    ],
    materials: ["18K rose gold", "Sapphire crystal", "Alligator strap"],
    description:
      "A skeletonized automatic movement visible through both faces. 42-hour reserve, Geneva-finished.",
    craft: "Assembled and regulated by a single watchmaker.",
    origin: "La Chaux-de-Fonds, Switzerland",
    inStock: true,
    limited: true,
    model: "watch",
  },
  {
    id: "aria-heel",
    name: "Aria 105",
    subtitle: "Stiletto in Ivory Satin",
    category: "Shoes",
    price: 1290,
    rating: 4.7,
    reviews: 312,
    colors: [
      { name: "Ivory", hex: "#F4ECD8" },
      { name: "Onyx", hex: "#1C1C1C" },
      { name: "Rosewood", hex: "#7A3B3F" },
    ],
    materials: ["Silk satin", "Leather sole", "Hand-lasted"],
    description: "A 105mm stiletto with a softly curved last and signature gilded heel cap.",
    craft: "Lasted by hand over a bespoke Italian form.",
    origin: "Parabiago, Italy",
    inStock: true,
    model: "heel",
  },
  {
    id: "soleil-ring",
    name: "Soleil",
    subtitle: "Cabochon Solitaire",
    category: "Jewelry",
    price: 8400,
    rating: 4.9,
    reviews: 56,
    colors: [
      { name: "Yellow Gold", hex: "#D4AF37" },
      { name: "White Gold", hex: "#E8E8E8" },
    ],
    materials: ["18K gold", "2.1ct citrine cabochon"],
    description: "A single cabochon cradled in a softly tapered bezel.",
    craft: "Hand-set in our Paris workshop.",
    origin: "Paris, France",
    inStock: true,
    model: "ring",
  },
  {
    id: "vento-scarf",
    name: "Vento",
    subtitle: "Hand-Rolled Silk Twill",
    category: "Ready-to-Wear",
    price: 490,
    rating: 4.6,
    reviews: 421,
    colors: [
      { name: "Champagne", hex: "#D4AF37" },
      { name: "Ivory", hex: "#F4ECD8" },
      { name: "Onyx", hex: "#1C1C1C" },
    ],
    materials: ["100% silk twill", "Hand-rolled edges"],
    description: "A 90cm silk twill scarf printed in our Lyonnais studio.",
    craft: "37 silkscreen passes per scarf.",
    origin: "Lyon, France",
    inStock: true,
    model: "scarf",
  },
  {
    id: "noir-clutch",
    name: "Noir Minaudière",
    subtitle: "Evening Clutch in Onyx",
    category: "Handbags",
    price: 2450,
    rating: 4.8,
    reviews: 142,
    colors: [
      { name: "Onyx", hex: "#1C1C1C" },
      { name: "Champagne", hex: "#D4AF37" },
    ],
    materials: ["Lacquered resin", "Gold clasp", "Silk lining"],
    description: "A sculpted evening minaudière finished in seven coats of lacquer.",
    craft: "Polished by hand for four hours.",
    origin: "Florence, Italy",
    inStock: true,
    limited: true,
    model: "handbag",
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export const categories = ["All", "Handbags", "Watches", "Shoes", "Jewelry", "Ready-to-Wear"] as const;
