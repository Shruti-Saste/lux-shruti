import { useCart, fmt } from "@/lib/cart-store";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

export function CartDrawer() {
  const { isOpen, close, items, setQty, remove, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-onyx/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.2, 0.8, 0.2, 1], duration: 0.5 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-ivory shadow-luxe flex flex-col"
          >
            <div className="px-6 py-6 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-2xl">Your Selection</h2>
              <button onClick={close} className="hairline gold-underline">Close</button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <span className="font-serif text-3xl gold-shimmer">L</span>
                  <p className="text-muted-foreground text-sm">Your atelier selection awaits.</p>
                  <Link to="/shop" onClick={close} className="btn-luxe mt-2">Discover</Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((i) => (
                    <li key={i.id} className="py-5 flex gap-4">
                      <div
                        className="size-20 shrink-0 rounded-sm border border-border flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${i.colorHex}40, ${i.colorHex}10)` }}
                      >
                        <span className="font-serif text-xl text-onyx/70">L</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-lg leading-tight">{i.name}</p>
                        <p className="text-xs text-muted-foreground">{i.color}{i.size ? ` · Size ${i.size}` : ""}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button onClick={() => setQty(i.id, i.qty - 1)} className="size-7 hairline">−</button>
                            <span className="w-7 text-center text-xs">{i.qty}</span>
                            <button onClick={() => setQty(i.id, i.qty + 1)} className="size-7 hairline">+</button>
                          </div>
                          <span className="text-sm">{fmt(i.price * i.qty)}</span>
                        </div>
                        <button onClick={() => remove(i.id)} className="hairline text-muted-foreground mt-2 gold-underline">
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="hairline">Subtotal</span>
                  <span className="font-serif text-2xl">{fmt(subtotal())}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Complimentary worldwide express delivery · 30-day returns
                </p>
                <Link to="/checkout" onClick={close} className="btn-luxe w-full">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
