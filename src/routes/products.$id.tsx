import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProduct, products } from "@/lib/products";
import { Product3D } from "@/components/Product3D";
import { useCart, fmt } from "@/lib/cart-store";
import { useState } from "react";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }): { product: import("@/lib/products").Product } => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — LUXÉRIA` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — LUXÉRIA` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [],
  }),
  errorComponent: ({ error, reset }) => (
    <div className="px-6 py-32 text-center">
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="btn-luxe mt-6">Try Again</button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="px-6 py-32 text-center">
      <h1 className="font-serif text-4xl">Piece not found</h1>
      <Link to="/shop" className="btn-luxe mt-6">Back to Boutique</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const add = useCart((s) => s.add);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.category === "Shoes" ? "37" : "M");
  const [qty, setQty] = useState(1);

  const sizes = product.category === "Shoes"
    ? ["35", "36", "37", "38", "39", "40", "41"]
    : product.category === "Jewelry" ? ["48", "50", "52", "54", "56"]
    : ["XS", "S", "M", "L"];

  return (
    <div className="px-6 lg:px-10 mx-auto max-w-[1400px] py-12">
      <nav className="hairline text-muted-foreground mb-8">
        <Link to="/" className="gold-underline">Maison</Link>
        <span className="mx-2">·</span>
        <Link to="/shop" className="gold-underline">Boutique</Link>
        <span className="mx-2">·</span>
        <span className="text-onyx">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
        {/* 3D */}
        <div className="relative bg-secondary aspect-square lg:aspect-auto lg:sticky lg:top-28 lg:self-start lg:h-[calc(100vh-9rem)]">
          <Product3D model={product.model} colorHex={color.hex} className="absolute inset-0" />
          <div className="absolute bottom-4 left-4 hairline text-onyx/60">
            Drag to rotate · Scroll to zoom
          </div>
        </div>

        {/* Details */}
        <div className="py-4">
          {product.limited && (
            <p className="hairline text-gold mb-4">· Limited Edition ·</p>
          )}
          <p className="hairline text-muted-foreground mb-3">{product.category}</p>
          <h1 className="font-serif text-5xl leading-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-2">{product.subtitle}</p>

          <div className="mt-6 flex items-baseline gap-4">
            <p className="font-serif text-3xl">{fmt(product.price)}</p>
            <p className="hairline text-muted-foreground">
              ★ {product.rating} · {product.reviews} reviews
            </p>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-muted-foreground max-w-md">
            {product.description}
          </p>

          {/* Color */}
          <div className="mt-10">
            <p className="hairline mb-4">Finish · <span className="text-muted-foreground normal-case tracking-normal text-xs">{color.name}</span></p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c)}
                  className={`size-10 rounded-full border-2 transition-all ${
                    color.name === c.name ? "border-onyx scale-110" : "border-border"
                  }`}
                  style={{ background: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-8">
            <p className="hairline mb-4">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s} onClick={() => setSize(s)}
                  className={`min-w-12 px-4 py-2.5 text-xs border transition-all ${
                    size === s ? "bg-onyx text-ivory border-onyx" : "border-border hover:border-onyx"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center border border-onyx">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="size-11 hairline">−</button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="size-11 hairline">+</button>
            </div>
            <button
              onClick={() =>
                add({
                  productId: product.id,
                  name: product.name,
                  subtitle: product.subtitle,
                  price: product.price,
                  color: color.name,
                  colorHex: color.hex,
                  size,
                  qty,
                  model: product.model,
                })
              }
              className="btn-luxe flex-1"
            >
              Add to Cart · {fmt(product.price * qty)}
            </button>
          </div>

          <button className="btn-ghost-luxe w-full mt-3">♡  Add to Wishlist</button>

          {/* Details */}
          <div className="mt-12 space-y-6 divide-y divide-border">
            <details className="group pt-6" open>
              <summary className="hairline cursor-pointer flex justify-between">
                Craftsmanship <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{product.craft} Crafted in {product.origin}.</p>
            </details>
            <details className="group pt-6">
              <summary className="hairline cursor-pointer flex justify-between">
                Materials <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
              </summary>
              <ul className="text-sm text-muted-foreground mt-4 space-y-1">
                {product.materials.map((m) => <li key={m}>— {m}</li>)}
              </ul>
            </details>
            <details className="group pt-6">
              <summary className="hairline cursor-pointer flex justify-between">
                Shipping & Returns <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                Complimentary worldwide express shipping. White-glove delivery available at checkout. 30-day return guarantee with original packaging.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Complete the look */}
      <section className="mt-32">
        <p className="hairline mb-3">Complete the Look</p>
        <h2 className="font-serif text-3xl mb-10">You may also consider</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
            <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="group">
              <div className="aspect-square bg-secondary relative overflow-hidden">
                <Product3D model={p.model} colorHex={p.colors[0].hex} autoRotate className="absolute inset-0" />
              </div>
              <div className="mt-4 flex justify-between items-baseline">
                <p className="font-serif text-lg">{p.name}</p>
                <p className="text-sm">{fmt(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
