import { createFileRoute, Link } from "@tanstack/react-router";
import { BoutiqueScene } from "@/components/BoutiqueScene";
import { Product3D } from "@/components/Product3D";
import { products } from "@/lib/products";
import { fmt } from "@/lib/cart-store";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUXÉRIA — Maison de Couture" },
      { name: "description", content: "An immersive 3D atelier of luxury handbags, watches, jewelry and ready-to-wear." },
      { property: "og:title", content: "LUXÉRIA — Maison de Couture" },
      { property: "og:description", content: "Step into the LUXÉRIA virtual boutique." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.slice(0, 4);
  return (
    <div className="-mt-20">
      {/* HERO */}
      <section className="relative h-[100vh] min-h-[720px] overflow-hidden">
        <BoutiqueScene className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/40 via-transparent to-ivory pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-24 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}
            className="hairline mb-6"
          >
            Automne · Hiver MMXXVI
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.2 }}
            className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-balance max-w-4xl"
          >
            The Atelier, <em className="gold-shimmer not-italic">Reimagined</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}
            className="mt-6 max-w-xl text-sm text-muted-foreground leading-relaxed"
          >
            A walkable boutique rendered in real time. Examine each piece from every angle, in any light.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Link to="/shop" className="btn-luxe">Enter the Boutique</Link>
            <a href="#collection" className="btn-ghost-luxe">View Collection</a>
          </motion.div>
        </div>

        {/* Scent / ambience marquee */}
        <div className="absolute top-24 left-6 hidden lg:flex flex-col gap-3 text-[10px] tracking-[0.3em] uppercase text-onyx/60">
          <span>· Lavender & Sandalwood</span>
          <span>· Ambient Jazz</span>
          <span>· 22°C · Place Vendôme</span>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-32 px-6 mx-auto max-w-3xl text-center">
        <p className="hairline mb-6">Maison Luxéria · 1923</p>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance">
          Every object passes through{" "}
          <em className="not-italic gold-shimmer">seventeen hands</em> before it meets yours.
        </h2>
        <p className="mt-8 text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
          From the tannery in Tuscany to the bench in La Chaux-de-Fonds, our craft is slow, deliberate, and uncompromisingly private. This is the boutique, brought to your screen.
        </p>
      </section>

      {/* Collection grid */}
      <section id="collection" className="px-6 lg:px-10 mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="hairline mb-3">La Collection</p>
            <h2 className="font-serif text-4xl md:text-5xl">Pieces of the Season</h2>
          </div>
          <Link to="/shop" className="hairline gold-underline hidden md:inline">View All →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20">
          {featured.map((p, i) => (
            <Link
              key={p.id} to="/products/$id" params={{ id: p.id }}
              className="group block"
            >
              <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
                <Product3D
                  model={p.model}
                  colorHex={p.colors[0].hex}
                  autoRotate
                  className="absolute inset-0"
                />
                {p.limited && (
                  <span className="absolute top-4 left-4 hairline bg-onyx text-ivory px-3 py-1.5">Limited</span>
                )}
                <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between bg-gradient-to-t from-ivory/80 to-transparent">
                  <div>
                    <p className="hairline text-onyx/60">{p.category}</p>
                  </div>
                  <span className="hairline gold-underline">Examine</span>
                </div>
              </div>
              <div className="mt-6 flex items-baseline justify-between">
                <div>
                  <h3 className="font-serif text-2xl">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.subtitle}</p>
                </div>
                <p className="font-serif text-xl">{fmt(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Atelier strip */}
      <section className="mt-32 bg-onyx text-ivory py-24 px-6">
        <div className="mx-auto max-w-[1400px] grid md:grid-cols-3 gap-12">
          {[
            { k: "Florence", v: "Leather Atelier · Est. 1923" },
            { k: "La Chaux-de-Fonds", v: "Horlogerie · Est. 1947" },
            { k: "Place Vendôme", v: "Haute Joaillerie · Est. 1961" },
          ].map((a) => (
            <div key={a.k}>
              <p className="hairline text-gold mb-3">{a.k}</p>
              <p className="font-serif text-2xl">{a.v}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
