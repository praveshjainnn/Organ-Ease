export interface Coordinates {
  latitude: number
  longitude: number
}

export interface LocationData {
  coordinates: Coordinates
  address: string
  city: string
  state: string
  country: string
}

// Haversine formula to calculate distance between two points
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRadians(coord2.latitude - coord1.latitude)
  const dLon = toRadians(coord2.longitude - coord1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Mock geocoding service (in real app, use Google Maps API or similar)
export async function geocodeAddress(address: string): Promise<LocationData | null> {
  // Mock coordinates for major cities
  const mockLocations: Record<string, LocationData> = {
    "new york": {
      coordinates: { latitude: 40.7128, longitude: -74.006 },
      address: "New York, NY",
      city: "New York",
      state: "NY",
      country: "USA",
    },
    "los angeles": {
      coordinates: { latitude: 34.0522, longitude: -118.2437 },
      address: "Los Angeles, CA",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
    },
    chicago: {
      coordinates: { latitude: 41.8781, longitude: -87.6298 },
      address: "Chicago, IL",
      city: "Chicago",
      state: "IL",
      country: "USA",
    },
    houston: {
      coordinates: { latitude: 29.7604, longitude: -95.3698 },
      address: "Houston, TX",
      city: "Houston",
      state: "TX",
      country: "USA",
    },
    phoenix: {
      coordinates: { latitude: 33.4484, longitude: -112.074 },
      address: "Phoenix, AZ",
      city: "Phoenix",
      state: "AZ",
      country: "USA",
    },
    philadelphia: {
      coordinates: { latitude: 39.9526, longitude: -75.1652 },
      address: "Philadelphia, PA",
      city: "Philadelphia",
      state: "PA",
      country: "USA",
    },
    "san antonio": {
      coordinates: { latitude: 29.4241, longitude: -98.4936 },
      address: "San Antonio, TX",
      city: "San Antonio",
      state: "TX",
      country: "USA",
    },
    "san diego": {
      coordinates: { latitude: 32.7157, longitude: -117.1611 },
      address: "San Diego, CA",
      city: "San Diego",
      state: "CA",
      country: "USA",
    },
    dallas: {
      coordinates: { latitude: 32.7767, longitude: -96.797 },
      address: "Dallas, TX",
      city: "Dallas",
      state: "TX",
      country: "USA",
    },
    "san jose": {
      coordinates: { latitude: 37.3382, longitude: -121.8863 },
      address: "San Jose, CA",
      city: "San Jose",
      state: "CA",
      country: "USA",
    },
    austin: {
      coordinates: { latitude: 30.2672, longitude: -97.7431 },
      address: "Austin, TX",
      city: "Austin",
      state: "TX",
      country: "USA",
    },
    jacksonville: {
      coordinates: { latitude: 30.3322, longitude: -81.6557 },
      address: "Jacksonville, FL",
      city: "Jacksonville",
      state: "FL",
      country: "USA",
    },
    "fort worth": {
      coordinates: { latitude: 32.7555, longitude: -97.3308 },
      address: "Fort Worth, TX",
      city: "Fort Worth",
      state: "TX",
      country: "USA",
    },
    columbus: {
      coordinates: { latitude: 39.9612, longitude: -82.9988 },
      address: "Columbus, OH",
      city: "Columbus",
      state: "OH",
      country: "USA",
    },
    charlotte: {
      coordinates: { latitude: 35.2271, longitude: -80.8431 },
      address: "Charlotte, NC",
      city: "Charlotte",
      state: "NC",
      country: "USA",
    },
    "san francisco": {
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
      address: "San Francisco, CA",
      city: "San Francisco",
      state: "CA",
      country: "USA",
    },
    indianapolis: {
      coordinates: { latitude: 39.7684, longitude: -86.1581 },
      address: "Indianapolis, IN",
      city: "Indianapolis",
      state: "IN",
      country: "USA",
    },
    seattle: {
      coordinates: { latitude: 47.6062, longitude: -122.3321 },
      address: "Seattle, WA",
      city: "Seattle",
      state: "WA",
      country: "USA",
    },
    denver: {
      coordinates: { latitude: 39.7392, longitude: -104.9903 },
      address: "Denver, CO",
      city: "Denver",
      state: "CO",
      country: "USA",
    },
    boston: {
      coordinates: { latitude: 42.3601, longitude: -71.0589 },
      address: "Boston, MA",
      city: "Boston",
      state: "MA",
      country: "USA",
    },
    "el paso": {
      coordinates: { latitude: 31.7619, longitude: -106.485 },
      address: "El Paso, TX",
      city: "El Paso",
      state: "TX",
      country: "USA",
    },
    detroit: {
      coordinates: { latitude: 42.3314, longitude: -83.0458 },
      address: "Detroit, MI",
      city: "Detroit",
      state: "MI",
      country: "USA",
    },
    nashville: {
      coordinates: { latitude: 36.1627, longitude: -86.7816 },
      address: "Nashville, TN",
      city: "Nashville",
      state: "TN",
      country: "USA",
    },
    portland: {
      coordinates: { latitude: 45.5152, longitude: -122.6784 },
      address: "Portland, OR",
      city: "Portland",
      state: "OR",
      country: "USA",
    },
    "oklahoma city": {
      coordinates: { latitude: 35.4676, longitude: -97.5164 },
      address: "Oklahoma City, OK",
      city: "Oklahoma City",
      state: "OK",
      country: "USA",
    },
    "las vegas": {
      coordinates: { latitude: 36.1699, longitude: -115.1398 },
      address: "Las Vegas, NV",
      city: "Las Vegas",
      state: "NV",
      country: "USA",
    },
    louisville: {
      coordinates: { latitude: 38.2527, longitude: -85.7585 },
      address: "Louisville, KY",
      city: "Louisville",
      state: "KY",
      country: "USA",
    },
    baltimore: {
      coordinates: { latitude: 39.2904, longitude: -76.6122 },
      address: "Baltimore, MD",
      city: "Baltimore",
      state: "MD",
      country: "USA",
    },
    milwaukee: {
      coordinates: { latitude: 43.0389, longitude: -87.9065 },
      address: "Milwaukee, WI",
      city: "Milwaukee",
      state: "WI",
      country: "USA",
    },
    albuquerque: {
      coordinates: { latitude: 35.0844, longitude: -106.6504 },
      address: "Albuquerque, NM",
      city: "Albuquerque",
      state: "NM",
      country: "USA",
    },
    tucson: {
      coordinates: { latitude: 32.2226, longitude: -110.9747 },
      address: "Tucson, AZ",
      city: "Tucson",
      state: "AZ",
      country: "USA",
    },
    fresno: {
      coordinates: { latitude: 36.7378, longitude: -119.7871 },
      address: "Fresno, CA",
      city: "Fresno",
      state: "CA",
      country: "USA",
    },
    sacramento: {
      coordinates: { latitude: 38.5816, longitude: -121.4944 },
      address: "Sacramento, CA",
      city: "Sacramento",
      state: "CA",
      country: "USA",
    },
    "kansas city": {
      coordinates: { latitude: 39.0997, longitude: -94.5786 },
      address: "Kansas City, MO",
      city: "Kansas City",
      state: "MO",
      country: "USA",
    },
    mesa: {
      coordinates: { latitude: 33.4152, longitude: -111.8315 },
      address: "Mesa, AZ",
      city: "Mesa",
      state: "AZ",
      country: "USA",
    },
    atlanta: {
      coordinates: { latitude: 33.749, longitude: -84.388 },
      address: "Atlanta, GA",
      city: "Atlanta",
      state: "GA",
      country: "USA",
    },
    "colorado springs": {
      coordinates: { latitude: 38.8339, longitude: -104.8214 },
      address: "Colorado Springs, CO",
      city: "Colorado Springs",
      state: "CO",
      country: "USA",
    },
    raleigh: {
      coordinates: { latitude: 35.7796, longitude: -78.6382 },
      address: "Raleigh, NC",
      city: "Raleigh",
      state: "NC",
      country: "USA",
    },
    omaha: {
      coordinates: { latitude: 41.2565, longitude: -95.9345 },
      address: "Omaha, NE",
      city: "Omaha",
      state: "NE",
      country: "USA",
    },
    miami: {
      coordinates: { latitude: 25.7617, longitude: -80.1918 },
      address: "Miami, FL",
      city: "Miami",
      state: "FL",
      country: "USA",
    },
    "long beach": {
      coordinates: { latitude: 33.7701, longitude: -118.1937 },
      address: "Long Beach, CA",
      city: "Long Beach",
      state: "CA",
      country: "USA",
    },
    "virginia beach": {
      coordinates: { latitude: 36.8529, longitude: -75.978 },
      address: "Virginia Beach, VA",
      city: "Virginia Beach",
      state: "VA",
      country: "USA",
    },
    oakland: {
      coordinates: { latitude: 37.8044, longitude: -122.2712 },
      address: "Oakland, CA",
      city: "Oakland",
      state: "CA",
      country: "USA",
    },
    minneapolis: {
      coordinates: { latitude: 44.9778, longitude: -93.265 },
      address: "Minneapolis, MN",
      city: "Minneapolis",
      state: "MN",
      country: "USA",
    },
    tulsa: {
      coordinates: { latitude: 36.154, longitude: -95.9928 },
      address: "Tulsa, OK",
      city: "Tulsa",
      state: "OK",
      country: "USA",
    },
    arlington: {
      coordinates: { latitude: 32.7357, longitude: -97.1081 },
      address: "Arlington, TX",
      city: "Arlington",
      state: "TX",
      country: "USA",
    },
    "new orleans": {
      coordinates: { latitude: 29.9511, longitude: -90.0715 },
      address: "New Orleans, LA",
      city: "New Orleans",
      state: "LA",
      country: "USA",
    },
    wichita: {
      coordinates: { latitude: 37.6872, longitude: -97.3301 },
      address: "Wichita, KS",
      city: "Wichita",
      state: "KS",
      country: "USA",
    },
    cleveland: {
      coordinates: { latitude: 41.4993, longitude: -81.6944 },
      address: "Cleveland, OH",
      city: "Cleveland",
      state: "OH",
      country: "USA",
    },
    tampa: {
      coordinates: { latitude: 27.9506, longitude: -82.4572 },
      address: "Tampa, FL",
      city: "Tampa",
      state: "FL",
      country: "USA",
    },
    bakersfield: {
      coordinates: { latitude: 35.3733, longitude: -119.0187 },
      address: "Bakersfield, CA",
      city: "Bakersfield",
      state: "CA",
      country: "USA",
    },
    aurora: {
      coordinates: { latitude: 39.7294, longitude: -104.8319 },
      address: "Aurora, CO",
      city: "Aurora",
      state: "CO",
      country: "USA",
    },
    honolulu: {
      coordinates: { latitude: 21.3099, longitude: -157.8581 },
      address: "Honolulu, HI",
      city: "Honolulu",
      state: "HI",
      country: "USA",
    },
    anaheim: {
      coordinates: { latitude: 33.8366, longitude: -117.9143 },
      address: "Anaheim, CA",
      city: "Anaheim",
      state: "CA",
      country: "USA",
    },
    "santa ana": {
      coordinates: { latitude: 33.7455, longitude: -117.8677 },
      address: "Santa Ana, CA",
      city: "Santa Ana",
      state: "CA",
      country: "USA",
    },
    "corpus christi": {
      coordinates: { latitude: 27.8006, longitude: -97.3964 },
      address: "Corpus Christi, TX",
      city: "Corpus Christi",
      state: "TX",
      country: "USA",
    },
    riverside: {
      coordinates: { latitude: 33.9533, longitude: -117.3962 },
      address: "Riverside, CA",
      city: "Riverside",
      state: "CA",
      country: "USA",
    },
    lexington: {
      coordinates: { latitude: 38.0406, longitude: -84.5037 },
      address: "Lexington, KY",
      city: "Lexington",
      state: "KY",
      country: "USA",
    },
    stockton: {
      coordinates: { latitude: 37.9577, longitude: -121.2908 },
      address: "Stockton, CA",
      city: "Stockton",
      state: "CA",
      country: "USA",
    },
    henderson: {
      coordinates: { latitude: 36.0395, longitude: -114.9817 },
      address: "Henderson, NV",
      city: "Henderson",
      state: "NV",
      country: "USA",
    },
    "saint paul": {
      coordinates: { latitude: 44.9537, longitude: -93.09 },
      address: "Saint Paul, MN",
      city: "Saint Paul",
      state: "MN",
      country: "USA",
    },
    "st. louis": {
      coordinates: { latitude: 38.627, longitude: -90.1994 },
      address: "St. Louis, MO",
      city: "St. Louis",
      state: "MO",
      country: "USA",
    },
    cincinnati: {
      coordinates: { latitude: 39.1031, longitude: -84.512 },
      address: "Cincinnati, OH",
      city: "Cincinnati",
      state: "OH",
      country: "USA",
    },
    pittsburgh: {
      coordinates: { latitude: 40.4406, longitude: -79.9959 },
      address: "Pittsburgh, PA",
      city: "Pittsburgh",
      state: "PA",
      country: "USA",
    },
    greensboro: {
      coordinates: { latitude: 36.0726, longitude: -79.792 },
      address: "Greensboro, NC",
      city: "Greensboro",
      state: "NC",
      country: "USA",
    },
    lincoln: {
      coordinates: { latitude: 40.8136, longitude: -96.7026 },
      address: "Lincoln, NE",
      city: "Lincoln",
      state: "NE",
      country: "USA",
    },
    plano: {
      coordinates: { latitude: 33.0198, longitude: -96.6989 },
      address: "Plano, TX",
      city: "Plano",
      state: "TX",
      country: "USA",
    },
    anchorage: {
      coordinates: { latitude: 61.2181, longitude: -149.9003 },
      address: "Anchorage, AK",
      city: "Anchorage",
      state: "AK",
      country: "USA",
    },
    buffalo: {
      coordinates: { latitude: 42.8864, longitude: -78.8784 },
      address: "Buffalo, NY",
      city: "Buffalo",
      state: "NY",
      country: "USA",
    },
    "fort wayne": {
      coordinates: { latitude: 41.0793, longitude: -85.1394 },
      address: "Fort Wayne, IN",
      city: "Fort Wayne",
      state: "IN",
      country: "USA",
    },
    "jersey city": {
      coordinates: { latitude: 40.7178, longitude: -74.0431 },
      address: "Jersey City, NJ",
      city: "Jersey City",
      state: "NJ",
      country: "USA",
    },
    "chula vista": {
      coordinates: { latitude: 32.6401, longitude: -117.0842 },
      address: "Chula Vista, CA",
      city: "Chula Vista",
      state: "CA",
      country: "USA",
    },
    orlando: {
      coordinates: { latitude: 28.5383, longitude: -81.3792 },
      address: "Orlando, FL",
      city: "Orlando",
      state: "FL",
      country: "USA",
    },
    norfolk: {
      coordinates: { latitude: 36.8508, longitude: -76.2859 },
      address: "Norfolk, VA",
      city: "Norfolk",
      state: "VA",
      country: "USA",
    },
    chandler: {
      coordinates: { latitude: 33.3062, longitude: -111.8413 },
      address: "Chandler, AZ",
      city: "Chandler",
      state: "AZ",
      country: "USA",
    },
    laredo: {
      coordinates: { latitude: 27.5306, longitude: -99.4803 },
      address: "Laredo, TX",
      city: "Laredo",
      state: "TX",
      country: "USA",
    },
    madison: {
      coordinates: { latitude: 43.0731, longitude: -89.4012 },
      address: "Madison, WI",
      city: "Madison",
      state: "WI",
      country: "USA",
    },
    durham: {
      coordinates: { latitude: 35.994, longitude: -78.8986 },
      address: "Durham, NC",
      city: "Durham",
      state: "NC",
      country: "USA",
    },
    lubbock: {
      coordinates: { latitude: 33.5779, longitude: -101.8552 },
      address: "Lubbock, TX",
      city: "Lubbock",
      state: "TX",
      country: "USA",
    },
    "winston-salem": {
      coordinates: { latitude: 36.0999, longitude: -80.2442 },
      address: "Winston-Salem, NC",
      city: "Winston-Salem",
      state: "NC",
      country: "USA",
    },
    garland: {
      coordinates: { latitude: 32.9126, longitude: -96.6389 },
      address: "Garland, TX",
      city: "Garland",
      state: "TX",
      country: "USA",
    },
    glendale: {
      coordinates: { latitude: 33.5387, longitude: -112.186 },
      address: "Glendale, AZ",
      city: "Glendale",
      state: "AZ",
      country: "USA",
    },
    hialeah: {
      coordinates: { latitude: 25.8576, longitude: -80.2781 },
      address: "Hialeah, FL",
      city: "Hialeah",
      state: "FL",
      country: "USA",
    },
    reno: {
      coordinates: { latitude: 39.5296, longitude: -119.8138 },
      address: "Reno, NV",
      city: "Reno",
      state: "NV",
      country: "USA",
    },
    "baton rouge": {
      coordinates: { latitude: 30.4515, longitude: -91.1871 },
      address: "Baton Rouge, LA",
      city: "Baton Rouge",
      state: "LA",
      country: "USA",
    },
    irvine: {
      coordinates: { latitude: 33.6846, longitude: -117.8265 },
      address: "Irvine, CA",
      city: "Irvine",
      state: "CA",
      country: "USA",
    },
    chesapeake: {
      coordinates: { latitude: 36.7682, longitude: -76.2875 },
      address: "Chesapeake, VA",
      city: "Chesapeake",
      state: "VA",
      country: "USA",
    },
    irving: {
      coordinates: { latitude: 32.814, longitude: -96.9489 },
      address: "Irving, TX",
      city: "Irving",
      state: "TX",
      country: "USA",
    },
    scottsdale: {
      coordinates: { latitude: 33.4942, longitude: -111.9261 },
      address: "Scottsdale, AZ",
      city: "Scottsdale",
      state: "AZ",
      country: "USA",
    },
    "north las vegas": {
      coordinates: { latitude: 36.1989, longitude: -115.1175 },
      address: "North Las Vegas, NV",
      city: "North Las Vegas",
      state: "NV",
      country: "USA",
    },
    fremont: {
      coordinates: { latitude: 37.5485, longitude: -121.9886 },
      address: "Fremont, CA",
      city: "Fremont",
      state: "CA",
      country: "USA",
    },
    gilbert: {
      coordinates: { latitude: 33.3528, longitude: -111.789 },
      address: "Gilbert, AZ",
      city: "Gilbert",
      state: "AZ",
      country: "USA",
    },
    "san bernardino": {
      coordinates: { latitude: 34.1083, longitude: -117.2898 },
      address: "San Bernardino, CA",
      city: "San Bernardino",
      state: "CA",
      country: "USA",
    },
    boise: {
      coordinates: { latitude: 43.615, longitude: -116.2023 },
      address: "Boise, ID",
      city: "Boise",
      state: "ID",
      country: "USA",
    },
    birmingham: {
      coordinates: { latitude: 33.5186, longitude: -86.8104 },
      address: "Birmingham, AL",
      city: "Birmingham",
      state: "AL",
      country: "USA",
    },
  }

  const key = address.toLowerCase().trim()
  return mockLocations[key] || null
}

// Get user's current location
export async function getCurrentLocation(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 10) / 10} mi`
  } else if (distance < 10) {
    return `${Math.round(distance * 10) / 10} mi`
  } else {
    return `${Math.round(distance)} mi`
  }
}

// Get distance category for filtering
export function getDistanceCategory(distance: number): string {
  if (distance <= 10) return "within-10"
  if (distance <= 25) return "within-25"
  if (distance <= 50) return "within-50"
  if (distance <= 100) return "within-100"
  return "over-100"
}
