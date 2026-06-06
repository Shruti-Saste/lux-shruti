import { createFileRoute, Link } from "@tanstack/react-router";
import { products, categories, type Product } from "@/lib/products";
import { fmt } from "@/lib/cart-store";
import { Product3D } from "@/components/Product3D";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Boutique — LUXÉRIA" },
      { name: "description", content: "Explore the complete LUXÉRIA collection: handbags, watches, jewelry, shoes and ready-to-wear." },
      { property: "og:title", content: "The Boutique — LUXÉRIA" },
      { property: "og:description", content: "An interactive 3D atelier of luxury pieces." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState<"featured" | "asc" | "desc">("featured");
  const [maxPrice, setMaxPrice] = useState(50000);

  const filtered = useMemo(() => {
    let list: Product[] = products.filter((p) => p.price <= maxPrice);
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [cat, sort, maxPrice]);

  return (
    <div className="px-6 lg:px-10 mx-auto max-w-[1400px] py-16">
      <header className="text-center mb-16">
        <p className="hairline mb-4">The Complete Collection</p>
        <h1 className="font-serif text-5xl md:text-6xl">Boutique</h1>
        <p className="text-muted-foreground text-sm mt-4 max-w-md mx-auto">
          {filtered.length} pieces · Hand-finished in Europe · Complimentary express delivery
        </p>
      </header>

      <div className="grid lg:grid-cols-[240px_1fr] gap-12">
        {/* Filters */}
        <aside className="space-y-10 lg:sticky lg:top-28 self-start">
          <div>
            <p className="hairline mb-4">Maison</p>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setCat(c)}
                    className={`text-sm gold-underline ${cat === c ? "font-medium" : "text-muted-foreground"}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="hairline mb-4">Sort</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full border-b border-onyx bg-transparent py-2 text-sm outline-none"
            >
              <option value="featured">Featured</option>
              <option value="asc">Price · Low to High</option>
              <option value="desc">Price · High to Low</option>
            </select>
          </div>

          <div>
            <p className="hairline mb-4">Max Price · {fmt(maxPrice)}</p>
            <input
              type="range" min={500} max={50000} step={500}
              value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>
        </aside>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-14">
          {filtered.map((p) => (
            <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="group block">
              <div className="relative aspect-square bg-secondary overflow-hidden">
                <Product3D model={p.model} colorHex={p.colors[0].hex} autoRotate className="absolute inset-0" />
                {p.limited && (
                  <span className="absolute top-3 left-3 hairline bg-onyx text-ivory px-2.5 py-1 text-[10px]">Limited</span>
                )}
              </div>
              <div className="mt-5">
                <p className="hairline text-muted-foreground text-[10px]">{p.category}</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <h3 className="font-serif text-xl">{p.name}</h3>
                  <p className="font-serif">{fmt(p.price)}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
