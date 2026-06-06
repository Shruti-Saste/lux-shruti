import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export function Header() {
  const open = useCart((s) => s.open);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-ivory/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-20 flex items-center justify-between">
        <div className="flex-1 hidden md:flex items-center gap-8">
          <Link to="/" className="hairline gold-underline">Maison</Link>
          <Link to="/shop" className="hairline gold-underline">Boutique</Link>
        </div>

        <Link to="/" className="flex flex-col items-center group">
          <span className="font-serif text-[28px] leading-none tracking-[0.18em]">
            LUX<span className="gold-shimmer">É</span>RIA
          </span>
          <span className="hairline text-[0.55rem] text-muted-foreground mt-1">Maison de Couture · 1923</span>
        </Link>

        <div className="flex-1 flex items-center justify-end gap-6">
          {user ? (
            <Link to="/account" className="hairline gold-underline hidden md:inline">Account</Link>
          ) : (
            <Link to="/auth" className="hairline gold-underline hidden md:inline">Sign In</Link>
          )}
          <button onClick={open} className="hairline gold-underline relative flex items-center gap-2">
            Cart
            {count > 0 && (
              <span className="size-5 rounded-full bg-onyx text-ivory text-[10px] font-medium flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
