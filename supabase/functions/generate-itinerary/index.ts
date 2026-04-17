import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, budget, days, tags } = await req.json();

    if (!city || !budget || !days) {
      return new Response(
        JSON.stringify({ error: "City, budget, and days are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const tripTags = tags?.length ? tags.join(", ") : "general sightseeing";

    const systemPrompt = `You are an expert travel planner who creates detailed, realistic day-by-day itineraries. You know real places, restaurants, attractions, and local experiences. Always provide specific names of real places, estimated costs in Indian Rupees (₹), and practical tips. Format your response as a JSON object.`;

    const userPrompt = `Create a detailed ${days}-day travel itinerary for ${city} with a total budget of ₹${budget} (Indian Rupees). The trip type is: ${tripTags}.

Return a JSON object with this exact structure:
{
  "destination": "City, Country",
  "summary": "A 2-3 sentence overview of the trip",
  "totalBudget": "₹${budget}",
  "dailyBudget": "₹X per day",
  "bestTimeToVisit": "Month - Month",
  "currency": "Local currency name and exchange rate vs INR",
  "tips": ["tip1", "tip2", "tip3"],
  "days": [
    {
      "day": 1,
      "theme": "Day theme",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "location": "Real place name",
          "description": "What to do and why",
          "estimatedCost": "₹X",
          "tip": "Practical tip"
        }
      ],
      "meals": [
        {
          "type": "Breakfast/Lunch/Dinner",
          "restaurant": "Real restaurant name",
          "cuisine": "Type of food",
          "estimatedCost": "₹X"
        }
      ]
    }
  ]
}

Do NOT include accommodation or hotel suggestions. Focus only on activities, meals, and sightseeing. Make sure all costs are realistic and add up within the total budget. Include real, existing places.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate itinerary" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from the response
    let itinerary;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        itinerary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse itinerary. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
