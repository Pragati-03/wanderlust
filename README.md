# Wanderlust — AI-Powered Travel Planner ✈️

Wanderlust is an AI-powered travel planning app that generates personalized day-by-day itineraries, helps you discover the best time to visit any destination, and saves your trips for future reference.

## Features

- **AI Itinerary Generator** — Enter a destination, number of days, and budget to get a detailed day-by-day travel plan with activities, meals, and estimated costs.
- **Best Time to Visit** — Search any city or country to find peak months, off-season tips, average temperatures, and travel highlights.
- **Popular Destinations** — Browse trending destinations (Tokyo, Paris, Bali, Santorini, Swiss Alps, Maldives) on the landing page for inspiration.
- **Trip Dashboard** — Save generated itineraries and revisit them anytime from your personal dashboard.
- **PDF Download** — Export any itinerary as a formatted PDF for offline use.
- **Authentication** — Secure email-based signup and login powered by Lovable Cloud.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Lovable Cloud (authentication, database, edge functions)
- **AI**: Lovable AI Gateway (Google Gemini) for itinerary & travel-info generation
- **PDF**: jsPDF + jspdf-autotable

## Getting Started

```sh
# Clone the repo
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

## Project Structure

```
src/
├── pages/
│   ├── Auth.tsx        # Landing page with login/signup & popular destinations
│   ├── Index.tsx       # Trip planner form + itinerary display
│   ├── BestTime.tsx    # Best time to visit search
│   ├── Dashboard.tsx   # Saved trips overview
│   └── NotFound.tsx
├── components/
│   ├── TravelForm.tsx        # Destination/days/budget form
│   ├── ItineraryDisplay.tsx  # Day-by-day itinerary view
│   ├── SavedTrips.tsx        # Trip cards for dashboard
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── itinerary-utils.ts    # Parsing & PDF helpers
supabase/
└── functions/
    ├── generate-itinerary/   # AI itinerary edge function
    └── peak-months/          # AI peak-months edge function
```

## Deployment

Open the project in [Lovable](https://lovable.dev) and click **Share → Publish**.

## License

MIT
