import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart, fmt } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — LUXÉRIA" },
      { name: "description", content: "Complete your LUXÉRIA order with secure checkout." },
    ],
  }),
  component: Checkout,
});

type Step = 0 | 1 | 2 | 3 | 4;
const stepNames = ["Shipping", "Method", "Payment", "Review", "Confirmation"];

const shippingOptions = [
  { id: "standard", label: "Standard Shipping", note: "5–7 days", price: 0 },
  { id: "express", label: "Express Shipping", note: "2–3 days", price: 49 },
  { id: "next", label: "Next-Day Delivery", note: "1 day", price: 99 },
  { id: "white", label: "White Glove Delivery", note: "Luxury unboxing experience", price: 199 },
];

const paymentOptions = [
  { id: "card", label: "Credit / Debit Card", note: "Visa · Mastercard · Amex" },
  { id: "paypal", label: "PayPal", note: "One-click checkout" },
  { id: "apple", label: "Apple Pay", note: "Biometric authentication" },
  { id: "klarna", label: "Klarna", note: "4 interest-free payments" },
  { id: "crypto", label: "Cryptocurrency", note: "BTC · ETH · USDC" },
];

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<Step>(0);
  const [ship, setShip] = useState({
    name: "", email: "", phone: "", country: "France", line1: "", line2: "", city: "", state: "", zip: "",
  });
  const [method, setMethod] = useState(shippingOptions[0].id);
  const [payment, setPayment] = useState(paymentOptions[0].id);
  const [card, setCard] = useState({ number: "", exp: "", cvv: "", name: "" });
  const [orderNumber, setOrderNumber] = useState(() => `LX-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [submitting, setSubmitting] = useState(false);

  // Prefill from profile when signed in
  useEffect(() => {
    if (!user) return;
    setShip((s) => ({ ...s, email: s.email || user.email || "" }));
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (!data) return;
      setShip((s) => ({
        name: s.name || data.full_name || "",
        email: s.email || data.email || user.email || "",
        phone: s.phone || data.phone || "",
        country: data.shipping_country || s.country,
        line1: s.line1 || data.shipping_line1 || "",
        line2: s.line2 || data.shipping_line2 || "",
        city: s.city || data.shipping_city || "",
        state: s.state || data.shipping_state || "",
        zip: s.zip || data.shipping_zip || "",
      }));
    });
  }, [user]);

  const shipPrice = shippingOptions.find((s) => s.id === method)?.price ?? 0;
  const sub = subtotal();
  const tax = Math.round(sub * 0.08);
  const total = sub + shipPrice + tax;

  if (items.length === 0 && step < 4) {
    return (
      <div className="px-6 py-32 text-center">
        <h1 className="font-serif text-4xl">Your selection is empty</h1>
        <p className="text-muted-foreground text-sm mt-3">Discover the collection before checking out.</p>
        <Link to="/shop" className="btn-luxe mt-8">Enter the Boutique</Link>
      </div>
    );
  }

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please sign in to complete your order.");
      navigate({ to: "/auth" });
      return;
    }
    setSubmitting(true);
    const number = `LX-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const methodLabel = shippingOptions.find((s) => s.id === method)?.label ?? method;
    const paymentLabel = paymentOptions.find((p) => p.id === payment)?.label ?? payment;
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      order_number: number,
      status: "confirmed",
      items: items.map((i) => ({ name: i.name, color: i.color, qty: i.qty, price: i.price, size: i.size })),
      subtotal: sub,
      shipping_cost: shipPrice,
      tax,
      total,
      shipping_method: methodLabel,
      payment_method: paymentLabel,
      shipping_address: ship,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setOrderNumber(number);
    setStep(4);
    setTimeout(() => {
      confetti({
        particleCount: 140, spread: 80, origin: { y: 0.5 },
        colors: ["#D4AF37", "#F4ECD8", "#1C1C1C"],
      });
    }, 200);
    setTimeout(() => clear(), 800);
  };

  return (
    <div className="px-6 lg:px-10 mx-auto max-w-[1280px] py-12">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-3 md:gap-6 mb-16 flex-wrap">
        {stepNames.map((n, i) => (
          <div key={n} className="flex items-center gap-3">
            <div className={`size-8 rounded-full border flex items-center justify-center text-xs ${
              i <= step ? "bg-onyx text-ivory border-onyx" : "border-border text-muted-foreground"
            }`}>{i + 1}</div>
            <span className={`hairline ${i === step ? "" : "text-muted-foreground"}`}>{n}</span>
            {i < stepNames.length - 1 && <span className="w-6 md:w-12 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className={`grid ${step < 4 ? "lg:grid-cols-[1fr_400px]" : ""} gap-12`}>
        {/* Main */}
        <div>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="ship" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-serif text-3xl mb-8">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" value={ship.name} onChange={(v) => setShip({ ...ship, name: v })} />
                  <Field label="Email Address" value={ship.email} onChange={(v) => setShip({ ...ship, email: v })} />
                  <Field label="Phone Number" value={ship.phone} onChange={(v) => setShip({ ...ship, phone: v })} />
                  <Field label="Country" value={ship.country} onChange={(v) => setShip({ ...ship, country: v })} />
                  <Field className="sm:col-span-2" label="Address Line 1" value={ship.line1} onChange={(v) => setShip({ ...ship, line1: v })} />
                  <Field className="sm:col-span-2" label="Address Line 2 (optional)" value={ship.line2} onChange={(v) => setShip({ ...ship, line2: v })} />
                  <Field label="City" value={ship.city} onChange={(v) => setShip({ ...ship, city: v })} />
                  <Field label="State / Province" value={ship.state} onChange={(v) => setShip({ ...ship, state: v })} />
                  <Field label="ZIP / Postal Code" value={ship.zip} onChange={(v) => setShip({ ...ship, zip: v })} />
                </div>
                <button onClick={() => setStep(1)} className="btn-luxe mt-10">Continue to Shipping</button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="method" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-serif text-3xl mb-8">Shipping Method</h2>
                <div className="space-y-3">
                  {shippingOptions.map((o) => (
                    <label key={o.id} className={`flex items-center justify-between p-5 border cursor-pointer transition ${
                      method === o.id ? "border-onyx bg-secondary" : "border-border hover:border-onyx/50"
                    }`}>
                      <div className="flex items-center gap-4">
                        <input type="radio" checked={method === o.id} onChange={() => setMethod(o.id)} className="accent-onyx" />
                        <div>
                          <p className="font-serif text-lg">{o.label}</p>
                          <p className="text-xs text-muted-foreground">{o.note}</p>
                        </div>
                      </div>
                      <span className="font-serif">{o.price === 0 ? "Complimentary" : fmt(o.price)}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-10">
                  <button onClick={() => setStep(0)} className="btn-ghost-luxe">Back</button>
                  <button onClick={() => setStep(2)} className="btn-luxe">Continue to Payment</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="pay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-serif text-3xl mb-2">Payment</h2>
                <p className="text-xs text-muted-foreground mb-8">SSL encrypted · PCI DSS compliant · 3D Secure</p>

                <div className="space-y-3 mb-8">
                  {paymentOptions.map((o) => (
                    <label key={o.id} className={`flex items-center justify-between p-5 border cursor-pointer transition ${
                      payment === o.id ? "border-onyx bg-secondary" : "border-border hover:border-onyx/50"
                    }`}>
                      <div className="flex items-center gap-4">
                        <input type="radio" checked={payment === o.id} onChange={() => setPayment(o.id)} className="accent-onyx" />
                        <div>
                          <p className="font-serif text-lg">{o.label}</p>
                          <p className="text-xs text-muted-foreground">{o.note}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {payment === "card" && (
                  <div className="grid sm:grid-cols-2 gap-5 p-6 border border-border bg-secondary/50">
                    <Field className="sm:col-span-2" label="Card Number" value={card.number} onChange={(v) => setCard({ ...card, number: v })} placeholder="0000  0000  0000  0000" />
                    <Field label="Expiry" value={card.exp} onChange={(v) => setCard({ ...card, exp: v })} placeholder="MM / YY" />
                    <Field label="CVV" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v })} placeholder="•••" />
                    <Field className="sm:col-span-2" label="Cardholder Name" value={card.name} onChange={(v) => setCard({ ...card, name: v })} />
                  </div>
                )}

                <div className="flex gap-3 mt-10">
                  <button onClick={() => setStep(1)} className="btn-ghost-luxe">Back</button>
                  <button onClick={() => setStep(3)} className="btn-luxe">Review Order</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-serif text-3xl mb-8">Review Your Order</h2>
                <div className="space-y-6 border border-border p-6">
                  <Block title="Shipping to">
                    <p>{ship.name || "—"}</p>
                    <p className="text-muted-foreground">{ship.line1}{ship.line2 ? `, ${ship.line2}` : ""}</p>
                    <p className="text-muted-foreground">{ship.city}, {ship.state} {ship.zip} · {ship.country}</p>
                  </Block>
                  <Block title="Method">
                    <p>{shippingOptions.find((s) => s.id === method)?.label}</p>
                  </Block>
                  <Block title="Payment">
                    <p>{paymentOptions.find((p) => p.id === payment)?.label}</p>
                  </Block>
                  <Block title="Items">
                    <ul className="divide-y divide-border">
                      {items.map((i) => (
                        <li key={i.id} className="py-3 flex justify-between text-sm">
                          <span>{i.name} · {i.color} × {i.qty}</span>
                          <span>{fmt(i.price * i.qty)}</span>
                        </li>
                      ))}
                    </ul>
                  </Block>
                </div>
                <div className="flex gap-3 mt-10">
                  <button onClick={() => setStep(2)} className="btn-ghost-luxe">Back</button>
                  <button onClick={placeOrder} disabled={submitting} className="btn-luxe">
                    {submitting ? "Placing order…" : user ? `Place Order · ${fmt(total)}` : `Sign In to Place Order · ${fmt(total)}`}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                <div className="size-20 rounded-full bg-gold mx-auto flex items-center justify-center mb-8 animate-float-soft">
                  <span className="font-serif text-4xl text-onyx">✓</span>
                </div>
                <h2 className="font-serif text-5xl">Thank you.</h2>
                <p className="hairline gold-shimmer mt-4">Order {orderNumber}</p>
                <p className="text-muted-foreground text-sm mt-6 max-w-md mx-auto">
                  A confirmation has been dispatched to your inbox. Your atelier specialist will be in touch shortly to coordinate delivery.
                </p>
                <div className="flex gap-3 justify-center mt-10">
                  <Link to="/account" className="btn-luxe">View Order</Link>
                  <button onClick={() => navigate({ to: "/shop" })} className="btn-ghost-luxe">Continue Shopping</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary */}
        {step < 4 && (
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="border border-border p-6">
              <p className="hairline mb-4">Order Summary</p>
              <ul className="divide-y divide-border mb-6">
                {items.map((i) => (
                  <li key={i.id} className="py-3 flex gap-3 text-sm">
                    <div className="size-14 shrink-0" style={{ background: `linear-gradient(135deg, ${i.colorHex}40, ${i.colorHex}10)` }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.color} · Qty {i.qty}</p>
                    </div>
                    <span>{fmt(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm border-t border-border pt-4">
                <Row k="Subtotal" v={fmt(sub)} />
                <Row k="Shipping" v={shipPrice === 0 ? "Complimentary" : fmt(shipPrice)} />
                <Row k="Tax (est.)" v={fmt(tax)} />
                <div className="h-px bg-border my-2" />
                <Row k={<span className="hairline">Total</span>} v={<span className="font-serif text-xl">{fmt(total)}</span>} />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, className = "", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; className?: string; placeholder?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="hairline block mb-2 text-muted-foreground">{label}</span>
      <input
        value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border-b border-onyx bg-transparent py-2.5 text-sm outline-none focus:border-gold transition"
      />
    </label>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="hairline text-muted-foreground mb-2">{title}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-muted-foreground">{k}</span>
      <span>{v}</span>
    </div>
  );
}
