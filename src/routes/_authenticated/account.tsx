import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fmt } from "@/lib/cart-store";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — LUXÉRIA" },
      { name: "description", content: "Manage your LUXÉRIA orders, addresses, and profile." },
    ],
  }),
  component: Account,
});

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  shipping_country: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
};

type OrderRow = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  items: Array<{ name: string; color: string; qty: number; price: number }>;
  shipping_method: string;
  payment_method: string;
  shipping_address: { city?: string; country?: string };
};

function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [tab, setTab] = useState<"orders" | "profile">("orders");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: o }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(p as Profile | null);
      setOrders(((o as unknown) as OrderRow[]) ?? []);
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!profile || !user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ ...profile, id: user.id });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const logout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (!user) return null;

  return (
    <div className="px-6 lg:px-10 mx-auto max-w-[1280px] py-12">
      <header className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="hairline text-muted-foreground mb-2">Bonjour</p>
          <h1 className="font-serif text-5xl">{profile?.full_name || user.email}</h1>
          <p className="text-xs text-muted-foreground mt-2">{user.email}</p>
        </div>
        <button onClick={logout} className="btn-ghost-luxe">Sign Out</button>
      </header>

      <div className="flex border-b border-border mb-10">
        {(["orders", "profile"] as const).map((t) => (
          <button
            key={t} onClick={() => setTab(t)}
            className={`hairline px-6 py-4 border-b-2 -mb-px transition ${
              tab === t ? "border-onyx text-onyx" : "border-transparent text-muted-foreground"
            }`}
          >
            {t === "orders" ? `Orders (${orders.length})` : "Profile & Address"}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-24 border border-border">
              <p className="font-serif text-2xl">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-3">Your first acquisition awaits.</p>
              <Link to="/shop" className="btn-luxe mt-8 inline-flex">Enter the Boutique</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o.id} className="border border-border p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="hairline text-muted-foreground">Order {o.order_number}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(o.created_at), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-xl">{fmt(Number(o.total))}</p>
                      <span className="hairline mt-1 inline-block px-2 py-1 bg-secondary">{o.status}</span>
                    </div>
                  </div>

                  <ul className="divide-y divide-border">
                    {o.items.map((i, idx) => (
                      <li key={idx} className="py-3 flex justify-between text-sm">
                        <span>{i.name} · {i.color} × {i.qty}</span>
                        <span className="text-muted-foreground">{fmt(Number(i.price) * i.qty)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 pt-5 border-t border-border grid sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="hairline text-muted-foreground mb-1">Shipping to</p>
                      <p>{o.shipping_address.city}, {o.shipping_address.country}</p>
                    </div>
                    <div>
                      <p className="hairline text-muted-foreground mb-1">Method</p>
                      <p>{o.shipping_method}</p>
                    </div>
                    <div>
                      <p className="hairline text-muted-foreground mb-1">Payment</p>
                      <p>{o.payment_method}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "profile" && profile && (
        <div className="max-w-2xl">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full Name" value={profile.full_name ?? ""} onChange={(v) => setProfile({ ...profile, full_name: v })} />
            <Field label="Phone" value={profile.phone ?? ""} onChange={(v) => setProfile({ ...profile, phone: v })} />
            <Field label="Country" value={profile.shipping_country ?? ""} onChange={(v) => setProfile({ ...profile, shipping_country: v })} />
            <Field label="City" value={profile.shipping_city ?? ""} onChange={(v) => setProfile({ ...profile, shipping_city: v })} />
            <Field className="sm:col-span-2" label="Address Line 1" value={profile.shipping_line1 ?? ""} onChange={(v) => setProfile({ ...profile, shipping_line1: v })} />
            <Field className="sm:col-span-2" label="Address Line 2" value={profile.shipping_line2 ?? ""} onChange={(v) => setProfile({ ...profile, shipping_line2: v })} />
            <Field label="State / Province" value={profile.shipping_state ?? ""} onChange={(v) => setProfile({ ...profile, shipping_state: v })} />
            <Field label="ZIP / Postal Code" value={profile.shipping_zip ?? ""} onChange={(v) => setProfile({ ...profile, shipping_zip: v })} />
          </div>
          <button onClick={saveProfile} disabled={saving} className="btn-luxe mt-8">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="hairline block mb-2 text-muted-foreground">{label}</span>
      <input
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-onyx bg-transparent py-2.5 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}
