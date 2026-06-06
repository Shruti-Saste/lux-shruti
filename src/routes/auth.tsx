import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — LUXÉRIA" },
      { name: "description", content: "Sign in to your LUXÉRIA account to view orders and manage your atelier preferences." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Already signed in? Bounce to account.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/account" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Check your inbox to confirm your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/account" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      if (!result.redirected) navigate({ to: "/account" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <p className="font-serif text-3xl tracking-[0.18em]">
            LUX<span className="gold-shimmer">É</span>RIA
          </p>
          <p className="hairline text-[0.55rem] text-muted-foreground mt-1">Maison de Couture · 1923</p>
        </Link>

        <div className="border border-border bg-card p-8">
          <h1 className="font-serif text-3xl text-center mb-1">
            {mode === "sign-in" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-center text-xs text-muted-foreground mb-8">
            {mode === "sign-in" ? "Continue to your private atelier." : "Join the Maison."}
          </p>

          <button
            type="button" onClick={google} disabled={loading}
            className="btn-ghost-luxe w-full mb-6"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="hairline text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-5">
            {mode === "sign-up" && (
              <label className="block">
                <span className="hairline block mb-2 text-muted-foreground">Full Name</span>
                <input
                  required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full border-b border-onyx bg-transparent py-2.5 text-sm outline-none focus:border-gold"
                />
              </label>
            )}
            <label className="block">
              <span className="hairline block mb-2 text-muted-foreground">Email</span>
              <input
                required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-onyx bg-transparent py-2.5 text-sm outline-none focus:border-gold"
              />
            </label>
            <label className="block">
              <span className="hairline block mb-2 text-muted-foreground">Password</span>
              <input
                required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-onyx bg-transparent py-2.5 text-sm outline-none focus:border-gold"
              />
            </label>
            <button type="submit" disabled={loading} className="btn-luxe w-full mt-2">
              {loading ? "Please wait…" : mode === "sign-in" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {mode === "sign-in" ? "New to Luxéria?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
              className="hairline gold-underline text-onyx"
            >
              {mode === "sign-in" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
