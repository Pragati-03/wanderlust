import { MapPin, Trash2, Eye, Calendar } from "lucide-react";
import { SavedTrip, deleteTrip } from "@/lib/itinerary-utils";
import { Button } from "@/components/ui/button";

interface SavedTripsProps {
  trips: SavedTrip[];
  onView: (itinerary: any) => void;
  onDelete: (id: string) => void;
}

const SavedTrips = ({ trips, onView, onDelete }: SavedTripsProps) => {
  if (trips.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <h3 className="font-display text-xl font-bold text-foreground text-center">
        Saved Trips
      </h3>
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
                  {trip.days} days · {trip.budget} · {new Date(trip.savedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(trip.itinerary)}
                className="text-primary hover:text-primary/80"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(trip.id)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedTrips;
