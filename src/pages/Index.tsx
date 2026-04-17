import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, LogIn, LayoutDashboard, LogOut, CalendarSearch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-travel.jpg";
import TravelForm from "@/components/TravelForm";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import { type Itinerary } from "@/lib/itinerary-utils";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
      if (!session) navigate("/");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
      if (!session) navigate("/");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (data: { city: string; budget: number; days: number; tags: string[] }) => {
    setIsLoading(true);
    setItinerary(null);
    setIsSaved(false);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-itinerary", {
        body: data,
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      if (result?.itinerary) {
        setItinerary(result.itinerary);
      } else {
        throw new Error("No itinerary returned");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Oops! Something went wrong",
        description: err.message || "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!itinerary) return;
    if (!user) {
      toast({ title: "Please sign in to save trips", description: "Go to Login to create an account.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.from("trips").insert({
        user_id: user.id,
        destination: itinerary.destination,
        budget: itinerary.totalBudget,
        days: itinerary.days.length,
        itinerary: itinerary as any,
      });
      if (error) throw error;
      setIsSaved(true);
      toast({ title: "Trip saved!", description: "Find it in your dashboard." });
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" });
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setIsSaved(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out" });
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-7 h-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">Wanderlust</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate("/best-time")} className="font-body gap-1">
                  <CalendarSearch className="w-4 h-4" /> Best Time
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")} className="font-body gap-1">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="font-body gap-1 text-muted-foreground">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/")} className="font-body gap-1">
                <LogIn className="w-4 h-4" /> Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      {!itinerary && (
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <img
            src={heroImage}
            alt="Beautiful travel destination with mountains and turquoise water"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
              Plan Your Dream Trip
            </h1>
            <p className="font-body text-lg md:text-xl text-primary-foreground/85 drop-shadow">
              Tell us where you want to go, your budget, and we'll craft the perfect itinerary for you
            </p>
          </div>
        </section>
      )}

      {/* Content */}
      <main className={`max-w-7xl mx-auto px-4 pb-16 ${itinerary ? "pt-24" : "py-12"}`}>
        {!itinerary ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Where to next?
              </h2>
              <p className="font-body text-muted-foreground mt-2">
                Enter your details and let AI plan the perfect trip
              </p>
            </div>
            <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <ItineraryDisplay itinerary={itinerary} onReset={handleReset} onSave={handleSave} isSaved={isSaved} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <p className="text-center font-body text-sm text-muted-foreground">
          Made with ✨ AI · Prices are estimates · Always verify locally
        </p>
      </footer>
    </div>
  );
};

export default Index;
