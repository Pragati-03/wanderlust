import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, MapPin, Trash2, Eye, LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { downloadItineraryPDF, type Itinerary } from "@/lib/itinerary-utils";
import ItineraryDisplay from "@/components/ItineraryDisplay";

interface Trip {
  id: string;
  destination: string;
  budget: string;
  days: number;
  itinerary: Itinerary;
  created_at: string;
}

const Dashboard = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Itinerary | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setTrips((data as unknown as Trip[]) || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting trip", variant: "destructive" });
    } else {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Trip deleted" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (viewing) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-7 h-7 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">Wanderlust</span>
            </div>
            <Button variant="ghost" onClick={() => setViewing(null)} className="font-body text-sm">
              ← Back to Dashboard
            </Button>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
          <ItineraryDisplay itinerary={viewing} onReset={() => setViewing(null)} isSaved={true} />
        </main>
      </div>
    );
  }

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
              <Plus className="w-4 h-4" /> New Trip
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="font-body gap-1 text-muted-foreground">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">My Trips</h1>

        {loading ? (
          <div className="text-center py-12 font-body text-muted-foreground">Loading...</div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <MapPin className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="font-body text-muted-foreground">No saved trips yet</p>
            <Button onClick={() => navigate("/plan")} className="gradient-warm text-primary-foreground font-body gap-2">
              <Plus className="w-4 h-4" /> Plan Your First Trip
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body font-semibold text-foreground text-sm truncate">
                      {trip.destination}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {trip.days} days · {trip.budget} · {new Date(trip.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setViewing(trip.itinerary)} className="text-primary hover:text-primary/80">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(trip.id)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
