// Google Maps API integration for address autocomplete and geocoding

export interface AddressSuggestion {
  id: string;
  text: string;
  latitude: number;
  longitude: number;
}

/**
 * Fetches address suggestions using our Next.js API route (which calls Google Maps APIs)
 * This avoids CORS issues by making server-to-server requests
 */
export async function getAddressSuggestions(input: string): Promise<AddressSuggestion[]> {
  if (!input || input.length < 3) {
    return [];
  }

  try {
    // Call our Next.js API route instead of Google Maps directly
    const response = await fetch(`/api/address-autocomplete?input=${encodeURIComponent(input)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API request failed:', errorData.error || response.statusText);
      return [];
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
}
