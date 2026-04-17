import { Clock, MapPin, Utensils, Lightbulb, IndianRupee, Globe, Sun, Download, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadItineraryPDF, type Itinerary } from "@/lib/itinerary-utils";

export type { Itinerary };

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onReset: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

const ItineraryDisplay = ({ itinerary, onReset, onSave, isSaved }: ItineraryDisplayProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Your trip to <span className="text-gradient">{itinerary.destination}</span>
        </h2>
        <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
          {itinerary.summary}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: IndianRupee, label: "Total Budget", value: itinerary.totalBudget },
          { icon: Sun, label: "Daily Budget", value: itinerary.dailyBudget },
          { icon: Globe, label: "Best Time", value: itinerary.bestTimeToVisit || "Any time" },
          { icon: MapPin, label: "Days", value: `${itinerary.days.length} days` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-card rounded-xl p-4 shadow-card text-center">
            <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-body text-xs text-muted-foreground">{label}</p>
            <p className="font-body font-semibold text-sm text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Tips */}
      {itinerary.tips && itinerary.tips.length > 0 && (
        <div className="bg-accent/30 rounded-xl p-5 border border-accent/50">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-accent-foreground" />
            Travel Tips
          </h3>
          <ul className="space-y-2">
            {itinerary.tips.map((tip, i) => (
              <li key={i} className="font-body text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Day-by-Day */}
      <div className="space-y-6">
        {itinerary.days.map((day) => (
          <div key={day.day} className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="gradient-warm px-6 py-4">
              <h3 className="font-display text-xl font-bold text-primary-foreground">
                Day {day.day}: {day.theme}
              </h3>
            </div>
            <div className="p-6 space-y-5">
              {/* Activities */}
              <div className="space-y-3">
                <h4 className="font-body font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-primary" /> Activities
                </h4>
                <div className="space-y-3">
                  {day.activities.map((activity, i) => (
                    <div key={i} className="flex gap-4 p-3 bg-background rounded-lg border border-border/50">
                      <div className="flex-shrink-0 flex items-center gap-1 text-primary font-body font-medium text-sm w-24">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-foreground text-sm">{activity.activity}</p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">{activity.location}</p>
                        <p className="font-body text-sm text-muted-foreground mt-1">{activity.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-body text-xs font-medium text-primary">{activity.estimatedCost}</span>
                          {activity.tip && (
                            <span className="font-body text-xs text-secondary italic">💡 {activity.tip}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meals */}
              {day.meals && day.meals.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-body font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Utensils className="w-4 h-4 text-primary" /> Meals
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {day.meals.map((meal, i) => (
                      <div key={i} className="p-3 bg-background rounded-lg border border-border/50">
                        <p className="font-body text-xs font-medium text-primary uppercase">{meal.type}</p>
                        <p className="font-body font-semibold text-sm text-foreground">{meal.restaurant}</p>
                        <p className="font-body text-xs text-muted-foreground">{meal.cuisine}</p>
                        <p className="font-body text-xs font-medium text-primary mt-1">{meal.estimatedCost}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button
          onClick={() => downloadItineraryPDF(itinerary)}
          className="gradient-warm text-primary-foreground font-body gap-2"
        >
          <Download className="w-4 h-4" /> Download PDF
        </Button>
        {onSave && (
          <Button
            onClick={onSave}
            variant="outline"
            disabled={isSaved}
            className="font-body gap-2 border-primary text-primary hover:bg-primary/10"
          >
            <Bookmark className="w-4 h-4" /> {isSaved ? "Saved ✓" : "Save Trip"}
          </Button>
        )}
        <button
          onClick={onReset}
          className="font-body font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors text-sm"
        >
          Plan another trip
        </button>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
