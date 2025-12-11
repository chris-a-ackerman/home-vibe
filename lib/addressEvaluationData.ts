// Mock data that mirrors the free Mapbox Geocoding API structure
const MOCK_GEOCODING_RESPONSES = {
  "1600 Amphitheatre": {
    features: [
      {
        id: "address.1",
        place_name: "1600 Amphitheatre Parkway, Mountain View, California 94043, United States",
        center: [-122.0841, 37.4220],
        place_type: ["address"]
      }
    ]
  },
  "350 5th Ave": {
    features: [
      {
        id: "address.2",
        place_name: "350 5th Avenue, New York, New York 10118, United States",
        center: [-73.9857, 40.7484],
        place_type: ["address"]
      }
    ]
  },
  "1 Apple Park": {
    features: [
      {
        id: "poi.3",
        place_name: "1 Apple Park Way, Cupertino, California 95014, United States",
        center: [-122.0091, 37.3349],
        place_type: ["poi"]
      }
    ]
  }
};

// Mock autocomplete suggestions
const MOCK_AUTOCOMPLETE_RESPONSES = {
  "1600": [
    {
      id: "address.1",
      text: "1600 Amphitheatre Parkway, Mountain View, CA",
      latitude: 37.4220,
      longitude: -122.0841
    },
    {
      id: "address.4",
      text: "1600 Pennsylvania Avenue NW, Washington, DC",
      latitude: 38.8977,
      longitude: -77.0365
    }
  ],
  "350": [
    {
      id: "address.2",
      text: "350 5th Avenue, New York, NY",
      latitude: 40.7484,
      longitude: -73.9857
    },
    {
      id: "address.5",
      text: "350 Mission Street, San Francisco, CA",
      latitude: 37.7897,
      longitude: -122.3972
    }
  ]
};