import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get('input');

  if (!input) {
    return NextResponse.json(
      { error: 'Input parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key is not configured' },
      { status: 500 }
    );
  }

  try {
    // Call Google Places Autocomplete API
    const autocompleteResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&types=address`
    );

    if (!autocompleteResponse.ok) {
      throw new Error(`Autocomplete API request failed: ${autocompleteResponse.statusText}`);
    }

    const autocompleteData = await autocompleteResponse.json();

    if (autocompleteData.status !== 'OK' && autocompleteData.status !== 'ZERO_RESULTS') {
      return NextResponse.json(
        { error: `Google Maps API error: ${autocompleteData.status}` },
        { status: 500 }
      );
    }

    if (!autocompleteData.predictions || autocompleteData.predictions.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }
    console.log(
      "Autocomplete API response:", autocompleteData.predictions.slice(0, 5).map((prediction: any) => prediction.description)
    )
    // Get coordinates for each prediction using Geocoding API
    const suggestions = await Promise.all(
      autocompleteData.predictions.slice(0, 5).map(async (prediction: any) => {
        try {
          const geocodeResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(prediction.description)}&key=${apiKey}`
          );

          if (!geocodeResponse.ok) {
            console.warn(`Geocoding failed for "${prediction.description}"`);
            return null;
          }

          const geocodeData = await geocodeResponse.json();

          if (geocodeData.status !== 'OK' || !geocodeData.results || geocodeData.results.length === 0) {
            console.warn(`No geocoding results for "${prediction.description}"`);
            return null;
          }

          const location = geocodeData.results[0].geometry.location;

          return {
            id: prediction.place_id,
            text: prediction.description,
            latitude: location.lat,
            longitude: location.lng,
          };
        } catch (error) {
          console.error(`Error geocoding "${prediction.description}":`, error);
          return null;
        }
      })
    );

    // Filter out null results
    const validSuggestions = suggestions.filter((s) => s !== null);

    return NextResponse.json({ suggestions: validSuggestions });
  } catch (error) {
    console.error('Error in address autocomplete API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address suggestions' },
      { status: 500 }
    );
  }
}
