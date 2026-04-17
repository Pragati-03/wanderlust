import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Mail, Lock, User, MapPin, Sun, Palmtree, Mountain, Building2, Waves } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-travel.jpg";

const popularDestinations = [
  { city: "Tokyo", country: "Japan", icon: Building2, tagline: "Neon lights & ancient temples", color: "from-rose-500/20 to-pink-500/20" },
  { city: "Paris", country: "France", icon: Building2, tagline: "Art, cuisine & romance", color: "from-blue-500/20 to-indigo-500/20" },
  { city: "Bali", country: "Indonesia", icon: Palmtree, tagline: "Tropical paradise & culture", color: "from-emerald-500/20 to-teal-500/20" },
  { city: "Santorini", country: "Greece", icon: Sun, tagline: "Sunsets & whitewashed villages", color: "from-amber-500/20 to-orange-500/20" },
  { city: "Swiss Alps", country: "Switzerland", icon: Mountain, tagline: "Majestic peaks & cozy chalets", color: "from-sky-500/20 to-cyan-500/20" },
  { city: "Maldives", country: "Maldives", icon: Waves, tagline: "Crystal waters & overwater villas", color: "from-teal-500/20 to-emerald-500/20" },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/plan");
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/plan");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: "Account created!", description: "You can now sign in." });
        setIsLogin(true);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Beautiful travel destination" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="w-10 h-10 text-primary-foreground" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-lg">Wanderlust</h1>
          </div>
          <p className="font-body text-lg text-primary-foreground/85 drop-shadow max-w-lg mx-auto">
            Your AI-powered travel planner. Sign in to start crafting unforgettable trips.
          </p>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <MapPin className="w-6 h-6 text-primary" /> Popular Destinations
          </h2>
          <p className="font-body text-muted-foreground mt-2">Explore trending spots loved by travelers worldwide</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {popularDestinations.map((dest) => (
            <div
              key={dest.city}
              className={`group relative bg-gradient-to-br ${dest.color} border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default`}
            >
              <dest.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-lg font-bold text-foreground">{dest.city}</h3>
              <p className="font-body text-xs text-muted-foreground">{dest.country}</p>
              <p className="font-body text-sm text-foreground/70 mt-1">{dest.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Auth Form */}
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {isLogin ? "Welcome back" : "Join Wanderlust"}
          </h2>
          <p className="font-body text-muted-foreground mt-1">
            {isLogin ? "Sign in to plan your next adventure" : "Create an account to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-card space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Full Name
              </Label>
              <Input id="name" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11 font-body bg-background border-border" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-body text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Email
            </Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 font-body bg-background border-border" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-body text-sm text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" /> Password
            </Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 font-body bg-background border-border" minLength={6} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 font-body font-semibold gradient-warm text-primary-foreground rounded-xl">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
          <p className="text-center font-body text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center font-body text-sm text-muted-foreground">Made with ✨ AI · Prices are estimates · Always verify locally</p>
      </footer>
    </div>
  );
};

export default Auth;
