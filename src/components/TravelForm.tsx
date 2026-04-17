import { useState } from "react";
import { MapPin, IndianRupee, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const TRIP_TAGS = [
  "Adventure", "Romantic", "Family", "Solo", "Cultural",
  "Beach", "Mountain", "Food & Culinary", "Budget", "Luxury",
  "Spiritual", "Nightlife", "Photography", "Wildlife", "Historical",
];

interface TravelFormProps {
  onSubmit: (data: { city: string; budget: number; days: number; tags: string[] }) => void;
  isLoading: boolean;
}

const TravelForm = ({ onSubmit, isLoading }: TravelFormProps) => {
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !budget || !days) return;
    onSubmit({
      city: city.trim(),
      budget: parseInt(budget),
      days: parseInt(days),
      tags: selectedTags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card space-y-6">
        <div className="space-y-2">
          <Label htmlFor="city" className="font-body text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Destination City
          </Label>
          <Input
            id="city"
            placeholder="e.g. Paris, Tokyo, Goa, Manali..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-12 text-base font-body bg-background border-border focus:ring-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget" className="font-body text-sm font-medium text-muted-foreground flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" />
              Budget (₹)
            </Label>
            <Input
              id="budget"
              type="number"
              placeholder="e.g. 50000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="h-12 text-base font-body bg-background border-border"
              min="1000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="days" className="font-body text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Days of Stay
            </Label>
            <Input
              id="days"
              type="number"
              placeholder="e.g. 5"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="h-12 text-base font-body bg-background border-border"
              min="1"
              max="30"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="font-body text-sm font-medium text-muted-foreground">
            Trip Type (select all that apply)
          </Label>
          <div className="flex flex-wrap gap-2">
            {TRIP_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all font-body text-sm px-3 py-1.5 ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border-border"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !city.trim() || !budget || !days}
          className="w-full h-14 text-lg font-body font-semibold gradient-warm text-primary-foreground hover:opacity-90 transition-opacity rounded-xl"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
              Crafting your itinerary...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Itinerary
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default TravelForm;
