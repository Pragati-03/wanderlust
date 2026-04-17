import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, MapPin, Sun, CloudRain, Sparkles, Loader2, LayoutDashboard, LogOut, CalendarSearch } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PeakMonthsResult {
  destination: string;
  peakMonths: string[];
  offSeason: string[];
  summary: string;
  avgTemp: string;
  highlight: string;
}

const BestTime = () => {
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PeakMonthsResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("peak-months", {
        body: { destination: destination.trim() },
      });
      if (error) throw error;
      if (data?.result) setResult(data.result);
      else throw new Error("No result returned");
    } catch (err: any) {
      toast({ title: "Oops!", description: err.message || "Failed to fetch peak months", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-7 h-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">Wanderlust</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/plan")} className="font-body gap-1">
              <Sparkles className="w-4 h-4" /> Plan Trip
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")} className="font-body gap-1">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="font-body gap-1 text-muted-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2 justify-center">
            <Sun className="w-8 h-8 text-accent" /> Best Time to Visit
          </h1>
          <p className="font-body text-muted-foreground mt-2">Enter a city or country to find the ideal travel months</p>
        </div>

        <form onSubmit={handleSearch} className="bg-card rounded-2xl p-6 shadow-card space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination" className="font-body text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> City or Country
            </Label>
            <Input
              id="destination"
              placeholder="e.g. Tokyo, Switzerland, Bali..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-11 font-body bg-background border-border"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 font-body font-semibold gradient-warm text-primary-foreground rounded-xl">
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Searching...</span>
            ) : (
              <span className="flex items-center gap-2"><CalendarSearch className="w-4 h-4" /> Find Peak Months</span>
            )}
          </Button>
        </form>

        {result && (
          <div className="mt-6 bg-card rounded-2xl p-6 shadow-card space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-display text-xl font-bold text-foreground">{result.destination}</h3>
            <p className="font-body text-sm text-muted-foreground">{result.summary}</p>
            <div className="space-y-3">
              <div>
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                  <Sun className="w-3 h-3" /> Peak Season
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.peakMonths.map((m) => (
                    <span key={m} className="px-3 py-1 rounded-full text-xs font-body font-medium bg-primary/15 text-primary">{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                  <CloudRain className="w-3 h-3" /> Off Season
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.offSeason.map((m) => (
                    <span key={m} className="px-3 py-1 rounded-full text-xs font-body font-medium bg-muted text-muted-foreground">{m}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-border">
              <div className="font-body text-sm">
                <span className="text-muted-foreground">Temp: </span>
                <span className="font-medium text-foreground">{result.avgTemp}</span>
              </div>
              <div className="font-body text-sm flex-1">
                <span className="text-muted-foreground">Highlight: </span>
                <span className="font-medium text-foreground">{result.highlight}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BestTime;
