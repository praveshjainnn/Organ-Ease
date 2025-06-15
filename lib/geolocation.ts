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
    mumbai: {
      coordinates: { latitude: 19.076, longitude: 72.8777 },
      address: "Mumbai, Maharashtra",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
    },
    delhi: {
      coordinates: { latitude: 28.7041, longitude: 77.1025 },
      address: "Delhi, India",
      city: "Delhi",
      state: "Delhi",
      country: "India",
    },
    "new delhi": {
      coordinates: { latitude: 28.6139, longitude: 77.209 },
      address: "New Delhi, Delhi",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
    },
    bangalore: {
      coordinates: { latitude: 12.9716, longitude: 77.5946 },
      address: "Bangalore, Karnataka",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
    },
    bengaluru: {
      coordinates: { latitude: 12.9716, longitude: 77.5946 },
      address: "Bengaluru, Karnataka",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
    },
    hyderabad: {
      coordinates: { latitude: 17.385, longitude: 78.4867 },
      address: "Hyderabad, Telangana",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
    },
    ahmedabad: {
      coordinates: { latitude: 23.0225, longitude: 72.5714 },
      address: "Ahmedabad, Gujarat",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
    },
    chennai: {
      coordinates: { latitude: 13.0827, longitude: 80.2707 },
      address: "Chennai, Tamil Nadu",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
    },
    kolkata: {
      coordinates: { latitude: 22.5726, longitude: 88.3639 },
      address: "Kolkata, West Bengal",
      city: "Kolkata",
      state: "West Bengal",
      country: "India",
    },
    surat: {
      coordinates: { latitude: 21.1702, longitude: 72.8311 },
      address: "Surat, Gujarat",
      city: "Surat",
      state: "Gujarat",
      country: "India",
    },
    pune: {
      coordinates: { latitude: 18.5204, longitude: 73.8567 },
      address: "Pune, Maharashtra",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
    },
    jaipur: {
      coordinates: { latitude: 26.9124, longitude: 75.7873 },
      address: "Jaipur, Rajasthan",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
    },
    lucknow: {
      coordinates: { latitude: 26.8467, longitude: 80.9462 },
      address: "Lucknow, Uttar Pradesh",
      city: "Lucknow",
      state: "Uttar Pradesh",
      country: "India",
    },
    kanpur: {
      coordinates: { latitude: 26.4499, longitude: 80.3319 },
      address: "Kanpur, Uttar Pradesh",
      city: "Kanpur",
      state: "Uttar Pradesh",
      country: "India",
    },
    nagpur: {
      coordinates: { latitude: 21.1458, longitude: 79.0882 },
      address: "Nagpur, Maharashtra",
      city: "Nagpur",
      state: "Maharashtra",
      country: "India",
    },
    indore: {
      coordinates: { latitude: 22.7196, longitude: 75.8577 },
      address: "Indore, Madhya Pradesh",
      city: "Indore",
      state: "Madhya Pradesh",
      country: "India",
    },
    thane: {
      coordinates: { latitude: 19.2183, longitude: 72.9781 },
      address: "Thane, Maharashtra",
      city: "Thane",
      state: "Maharashtra",
      country: "India",
    },
    bhopal: {
      coordinates: { latitude: 23.2599, longitude: 77.4126 },
      address: "Bhopal, Madhya Pradesh",
      city: "Bhopal",
      state: "Madhya Pradesh",
      country: "India",
    },
    visakhapatnam: {
      coordinates: { latitude: 17.6868, longitude: 83.2185 },
      address: "Visakhapatnam, Andhra Pradesh",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      country: "India",
    },
    "pimpri chinchwad": {
      coordinates: { latitude: 18.6298, longitude: 73.7997 },
      address: "Pimpri-Chinchwad, Maharashtra",
      city: "Pimpri-Chinchwad",
      state: "Maharashtra",
      country: "India",
    },
    patna: {
      coordinates: { latitude: 25.5941, longitude: 85.1376 },
      address: "Patna, Bihar",
      city: "Patna",
      state: "Bihar",
      country: "India",
    },
    vadodara: {
      coordinates: { latitude: 22.3072, longitude: 73.1812 },
      address: "Vadodara, Gujarat",
      city: "Vadodara",
      state: "Gujarat",
      country: "India",
    },
    ghaziabad: {
      coordinates: { latitude: 28.6692, longitude: 77.4538 },
      address: "Ghaziabad, Uttar Pradesh",
      city: "Ghaziabad",
      state: "Uttar Pradesh",
      country: "India",
    },
    ludhiana: {
      coordinates: { latitude: 30.901, longitude: 75.8573 },
      address: "Ludhiana, Punjab",
      city: "Ludhiana",
      state: "Punjab",
      country: "India",
    },
    agra: {
      coordinates: { latitude: 27.1767, longitude: 78.0081 },
      address: "Agra, Uttar Pradesh",
      city: "Agra",
      state: "Uttar Pradesh",
      country: "India",
    },
    nashik: {
      coordinates: { latitude: 19.9975, longitude: 73.7898 },
      address: "Nashik, Maharashtra",
      city: "Nashik",
      state: "Maharashtra",
      country: "India",
    },
    faridabad: {
      coordinates: { latitude: 28.4089, longitude: 77.3178 },
      address: "Faridabad, Haryana",
      city: "Faridabad",
      state: "Haryana",
      country: "India",
    },
    meerut: {
      coordinates: { latitude: 28.9845, longitude: 77.7064 },
      address: "Meerut, Uttar Pradesh",
      city: "Meerut",
      state: "Uttar Pradesh",
      country: "India",
    },
    rajkot: {
      coordinates: { latitude: 22.3039, longitude: 70.8022 },
      address: "Rajkot, Gujarat",
      city: "Rajkot",
      state: "Gujarat",
      country: "India",
    },
    "kalyan dombivli": {
      coordinates: { latitude: 19.2403, longitude: 73.1305 },
      address: "Kalyan-Dombivli, Maharashtra",
      city: "Kalyan-Dombivli",
      state: "Maharashtra",
      country: "India",
    },
    "vasai virar": {
      coordinates: { latitude: 19.4912, longitude: 72.8054 },
      address: "Vasai-Virar, Maharashtra",
      city: "Vasai-Virar",
      state: "Maharashtra",
      country: "India",
    },
    varanasi: {
      coordinates: { latitude: 25.3176, longitude: 82.9739 },
      address: "Varanasi, Uttar Pradesh",
      city: "Varanasi",
      state: "Uttar Pradesh",
      country: "India",
    },
    srinagar: {
      coordinates: { latitude: 34.0837, longitude: 74.7973 },
      address: "Srinagar, Jammu and Kashmir",
      city: "Srinagar",
      state: "Jammu and Kashmir",
      country: "India",
    },
    aurangabad: {
      coordinates: { latitude: 19.8762, longitude: 75.3433 },
      address: "Aurangabad, Maharashtra",
      city: "Aurangabad",
      state: "Maharashtra",
      country: "India",
    },
    dhanbad: {
      coordinates: { latitude: 23.7957, longitude: 86.4304 },
      address: "Dhanbad, Jharkhand",
      city: "Dhanbad",
      state: "Jharkhand",
      country: "India",
    },
    amritsar: {
      coordinates: { latitude: 31.634, longitude: 74.8723 },
      address: "Amritsar, Punjab",
      city: "Amritsar",
      state: "Punjab",
      country: "India",
    },
    "navi mumbai": {
      coordinates: { latitude: 19.033, longitude: 73.0297 },
      address: "Navi Mumbai, Maharashtra",
      city: "Navi Mumbai",
      state: "Maharashtra",
      country: "India",
    },
    allahabad: {
      coordinates: { latitude: 25.4358, longitude: 81.8463 },
      address: "Allahabad, Uttar Pradesh",
      city: "Allahabad",
      state: "Uttar Pradesh",
      country: "India",
    },
    prayagraj: {
      coordinates: { latitude: 25.4358, longitude: 81.8463 },
      address: "Prayagraj, Uttar Pradesh",
      city: "Prayagraj",
      state: "Uttar Pradesh",
      country: "India",
    },
    ranchi: {
      coordinates: { latitude: 23.3441, longitude: 85.3096 },
      address: "Ranchi, Jharkhand",
      city: "Ranchi",
      state: "Jharkhand",
      country: "India",
    },
    howrah: {
      coordinates: { latitude: 22.5958, longitude: 88.2636 },
      address: "Howrah, West Bengal",
      city: "Howrah",
      state: "West Bengal",
      country: "India",
    },
    coimbatore: {
      coordinates: { latitude: 11.0168, longitude: 76.9558 },
      address: "Coimbatore, Tamil Nadu",
      city: "Coimbatore",
      state: "Tamil Nadu",
      country: "India",
    },
    jabalpur: {
      coordinates: { latitude: 23.1815, longitude: 79.9864 },
      address: "Jabalpur, Madhya Pradesh",
      city: "Jabalpur",
      state: "Madhya Pradesh",
      country: "India",
    },
    gwalior: {
      coordinates: { latitude: 26.2183, longitude: 78.1828 },
      address: "Gwalior, Madhya Pradesh",
      city: "Gwalior",
      state: "Madhya Pradesh",
      country: "India",
    },
    vijayawada: {
      coordinates: { latitude: 16.5062, longitude: 80.648 },
      address: "Vijayawada, Andhra Pradesh",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      country: "India",
    },
    jodhpur: {
      coordinates: { latitude: 26.2389, longitude: 73.0243 },
      address: "Jodhpur, Rajasthan",
      city: "Jodhpur",
      state: "Rajasthan",
      country: "India",
    },
    madurai: {
      coordinates: { latitude: 9.9252, longitude: 78.1198 },
      address: "Madurai, Tamil Nadu",
      city: "Madurai",
      state: "Tamil Nadu",
      country: "India",
    },
    raipur: {
      coordinates: { latitude: 21.2514, longitude: 81.6296 },
      address: "Raipur, Chhattisgarh",
      city: "Raipur",
      state: "Chhattisgarh",
      country: "India",
    },
    kota: {
      coordinates: { latitude: 25.2138, longitude: 75.8648 },
      address: "Kota, Rajasthan",
      city: "Kota",
      state: "Rajasthan",
      country: "India",
    },
    chandigarh: {
      coordinates: { latitude: 30.7333, longitude: 76.7794 },
      address: "Chandigarh, India",
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
    },
    guwahati: {
      coordinates: { latitude: 26.1445, longitude: 91.7362 },
      address: "Guwahati, Assam",
      city: "Guwahati",
      state: "Assam",
      country: "India",
    },
    solapur: {
      coordinates: { latitude: 17.6599, longitude: 75.9064 },
      address: "Solapur, Maharashtra",
      city: "Solapur",
      state: "Maharashtra",
      country: "India",
    },
    "hubli dharwad": {
      coordinates: { latitude: 15.3647, longitude: 75.124 },
      address: "Hubli-Dharwad, Karnataka",
      city: "Hubli-Dharwad",
      state: "Karnataka",
      country: "India",
    },
    bareilly: {
      coordinates: { latitude: 28.367, longitude: 79.4304 },
      address: "Bareilly, Uttar Pradesh",
      city: "Bareilly",
      state: "Uttar Pradesh",
      country: "India",
    },
    moradabad: {
      coordinates: { latitude: 28.8386, longitude: 78.7733 },
      address: "Moradabad, Uttar Pradesh",
      city: "Moradabad",
      state: "Uttar Pradesh",
      country: "India",
    },
    mysore: {
      coordinates: { latitude: 12.2958, longitude: 76.6394 },
      address: "Mysore, Karnataka",
      city: "Mysore",
      state: "Karnataka",
      country: "India",
    },
    mysuru: {
      coordinates: { latitude: 12.2958, longitude: 76.6394 },
      address: "Mysuru, Karnataka",
      city: "Mysuru",
      state: "Karnataka",
      country: "India",
    },
    gurgaon: {
      coordinates: { latitude: 28.4595, longitude: 77.0266 },
      address: "Gurgaon, Haryana",
      city: "Gurgaon",
      state: "Haryana",
      country: "India",
    },
    gurugram: {
      coordinates: { latitude: 28.4595, longitude: 77.0266 },
      address: "Gurugram, Haryana",
      city: "Gurugram",
      state: "Haryana",
      country: "India",
    },
    aligarh: {
      coordinates: { latitude: 27.8974, longitude: 78.088 },
      address: "Aligarh, Uttar Pradesh",
      city: "Aligarh",
      state: "Uttar Pradesh",
      country: "India",
    },
    jalandhar: {
      coordinates: { latitude: 31.326, longitude: 75.5762 },
      address: "Jalandhar, Punjab",
      city: "Jalandhar",
      state: "Punjab",
      country: "India",
    },
    bhubaneswar: {
      coordinates: { latitude: 20.2961, longitude: 85.8245 },
      address: "Bhubaneswar, Odisha",
      city: "Bhubaneswar",
      state: "Odisha",
      country: "India",
    },
    salem: {
      coordinates: { latitude: 11.6643, longitude: 78.146 },
      address: "Salem, Tamil Nadu",
      city: "Salem",
      state: "Tamil Nadu",
      country: "India",
    },
    warangal: {
      coordinates: { latitude: 17.9689, longitude: 79.5941 },
      address: "Warangal, Telangana",
      city: "Warangal",
      state: "Telangana",
      country: "India",
    },
    "mira bhayandar": {
      coordinates: { latitude: 19.2952, longitude: 72.8544 },
      address: "Mira-Bhayandar, Maharashtra",
      city: "Mira-Bhayandar",
      state: "Maharashtra",
      country: "India",
    },
    thiruvananthapuram: {
      coordinates: { latitude: 8.5241, longitude: 76.9366 },
      address: "Thiruvananthapuram, Kerala",
      city: "Thiruvananthapuram",
      state: "Kerala",
      country: "India",
    },
    trivandrum: {
      coordinates: { latitude: 8.5241, longitude: 76.9366 },
      address: "Trivandrum, Kerala",
      city: "Trivandrum",
      state: "Kerala",
      country: "India",
    },
    guntur: {
      coordinates: { latitude: 16.3067, longitude: 80.4365 },
      address: "Guntur, Andhra Pradesh",
      city: "Guntur",
      state: "Andhra Pradesh",
      country: "India",
    },
    bhiwandi: {
      coordinates: { latitude: 19.3002, longitude: 73.0635 },
      address: "Bhiwandi, Maharashtra",
      city: "Bhiwandi",
      state: "Maharashtra",
      country: "India",
    },
    saharanpur: {
      coordinates: { latitude: 29.968, longitude: 77.5552 },
      address: "Saharanpur, Uttar Pradesh",
      city: "Saharanpur",
      state: "Uttar Pradesh",
      country: "India",
    },
    gorakhpur: {
      coordinates: { latitude: 26.7606, longitude: 83.3732 },
      address: "Gorakhpur, Uttar Pradesh",
      city: "Gorakhpur",
      state: "Uttar Pradesh",
      country: "India",
    },
    bikaner: {
      coordinates: { latitude: 28.0229, longitude: 73.3119 },
      address: "Bikaner, Rajasthan",
      city: "Bikaner",
      state: "Rajasthan",
      country: "India",
    },
    amravati: {
      coordinates: { latitude: 20.9374, longitude: 77.7796 },
      address: "Amravati, Maharashtra",
      city: "Amravati",
      state: "Maharashtra",
      country: "India",
    },
    noida: {
      coordinates: { latitude: 28.5355, longitude: 77.391 },
      address: "Noida, Uttar Pradesh",
      city: "Noida",
      state: "Uttar Pradesh",
      country: "India",
    },
    jamshedpur: {
      coordinates: { latitude: 22.8046, longitude: 86.2029 },
      address: "Jamshedpur, Jharkhand",
      city: "Jamshedpur",
      state: "Jharkhand",
      country: "India",
    },
    bhilai: {
      coordinates: { latitude: 21.1938, longitude: 81.3509 },
      address: "Bhilai, Chhattisgarh",
      city: "Bhilai",
      state: "Chhattisgarh",
      country: "India",
    },
    cuttack: {
      coordinates: { latitude: 20.4625, longitude: 85.8828 },
      address: "Cuttack, Odisha",
      city: "Cuttack",
      state: "Odisha",
      country: "India",
    },
    firozabad: {
      coordinates: { latitude: 27.1592, longitude: 78.3957 },
      address: "Firozabad, Uttar Pradesh",
      city: "Firozabad",
      state: "Uttar Pradesh",
      country: "India",
    },
    kochi: {
      coordinates: { latitude: 9.9312, longitude: 76.2673 },
      address: "Kochi, Kerala",
      city: "Kochi",
      state: "Kerala",
      country: "India",
    },
    cochin: {
      coordinates: { latitude: 9.9312, longitude: 76.2673 },
      address: "Cochin, Kerala",
      city: "Cochin",
      state: "Kerala",
      country: "India",
    },
    bhavnagar: {
      coordinates: { latitude: 21.7645, longitude: 72.1519 },
      address: "Bhavnagar, Gujarat",
      city: "Bhavnagar",
      state: "Gujarat",
      country: "India",
    },
    dehradun: {
      coordinates: { latitude: 30.3165, longitude: 78.0322 },
      address: "Dehradun, Uttarakhand",
      city: "Dehradun",
      state: "Uttarakhand",
      country: "India",
    },
    durgapur: {
      coordinates: { latitude: 23.5204, longitude: 87.3119 },
      address: "Durgapur, West Bengal",
      city: "Durgapur",
      state: "West Bengal",
      country: "India",
    },
    asansol: {
      coordinates: { latitude: 23.6739, longitude: 86.9524 },
      address: "Asansol, West Bengal",
      city: "Asansol",
      state: "West Bengal",
      country: "India",
    },
    nanded: {
      coordinates: { latitude: 19.1383, longitude: 77.321 },
      address: "Nanded, Maharashtra",
      city: "Nanded",
      state: "Maharashtra",
      country: "India",
    },
    kolhapur: {
      coordinates: { latitude: 16.705, longitude: 74.2433 },
      address: "Kolhapur, Maharashtra",
      city: "Kolhapur",
      state: "Maharashtra",
      country: "India",
    },
    ajmer: {
      coordinates: { latitude: 26.4499, longitude: 74.6399 },
      address: "Ajmer, Rajasthan",
      city: "Ajmer",
      state: "Rajasthan",
      country: "India",
    },
    akola: {
      coordinates: { latitude: 20.7002, longitude: 77.0082 },
      address: "Akola, Maharashtra",
      city: "Akola",
      state: "Maharashtra",
      country: "India",
    },
    gulbarga: {
      coordinates: { latitude: 17.3297, longitude: 76.8343 },
      address: "Gulbarga, Karnataka",
      city: "Gulbarga",
      state: "Karnataka",
      country: "India",
    },
    jamnagar: {
      coordinates: { latitude: 22.4707, longitude: 70.0577 },
      address: "Jamnagar, Gujarat",
      city: "Jamnagar",
      state: "Gujarat",
      country: "India",
    },
    ujjain: {
      coordinates: { latitude: 23.1765, longitude: 75.7885 },
      address: "Ujjain, Madhya Pradesh",
      city: "Ujjain",
      state: "Madhya Pradesh",
      country: "India",
    },
    loni: {
      coordinates: { latitude: 28.7506, longitude: 77.2897 },
      address: "Loni, Uttar Pradesh",
      city: "Loni",
      state: "Uttar Pradesh",
      country: "India",
    },
    siliguri: {
      coordinates: { latitude: 26.7271, longitude: 88.3953 },
      address: "Siliguri, West Bengal",
      city: "Siliguri",
      state: "West Bengal",
      country: "India",
    },
    jhansi: {
      coordinates: { latitude: 25.4484, longitude: 78.5685 },
      address: "Jhansi, Uttar Pradesh",
      city: "Jhansi",
      state: "Uttar Pradesh",
      country: "India",
    },
    ulhasnagar: {
      coordinates: { latitude: 19.2215, longitude: 73.1645 },
      address: "Ulhasnagar, Maharashtra",
      city: "Ulhasnagar",
      state: "Maharashtra",
      country: "India",
    },
    jammu: {
      coordinates: { latitude: 32.7266, longitude: 74.857 },
      address: "Jammu, Jammu and Kashmir",
      city: "Jammu",
      state: "Jammu and Kashmir",
      country: "India",
    },
    "sangli miraj kupwad": {
      coordinates: { latitude: 16.8524, longitude: 74.5815 },
      address: "Sangli-Miraj-Kupwad, Maharashtra",
      city: "Sangli-Miraj-Kupwad",
      state: "Maharashtra",
      country: "India",
    },
    mangalore: {
      coordinates: { latitude: 12.9141, longitude: 74.856 },
      address: "Mangalore, Karnataka",
      city: "Mangalore",
      state: "Karnataka",
      country: "India",
    },
    mangaluru: {
      coordinates: { latitude: 12.9141, longitude: 74.856 },
      address: "Mangaluru, Karnataka",
      city: "Mangaluru",
      state: "Karnataka",
      country: "India",
    },
    erode: {
      coordinates: { latitude: 11.341, longitude: 77.7172 },
      address: "Erode, Tamil Nadu",
      city: "Erode",
      state: "Tamil Nadu",
      country: "India",
    },
    belgaum: {
      coordinates: { latitude: 15.8497, longitude: 74.4977 },
      address: "Belgaum, Karnataka",
      city: "Belgaum",
      state: "Karnataka",
      country: "India",
    },
    belagavi: {
      coordinates: { latitude: 15.8497, longitude: 74.4977 },
      address: "Belagavi, Karnataka",
      city: "Belagavi",
      state: "Karnataka",
      country: "India",
    },
    ambattur: {
      coordinates: { latitude: 13.1143, longitude: 80.1548 },
      address: "Ambattur, Tamil Nadu",
      city: "Ambattur",
      state: "Tamil Nadu",
      country: "India",
    },
    tirunelveli: {
      coordinates: { latitude: 8.7139, longitude: 77.7567 },
      address: "Tirunelveli, Tamil Nadu",
      city: "Tirunelveli",
      state: "Tamil Nadu",
      country: "India",
    },
    malegaon: {
      coordinates: { latitude: 20.5579, longitude: 74.5287 },
      address: "Malegaon, Maharashtra",
      city: "Malegaon",
      state: "Maharashtra",
      country: "India",
    },
    gaya: {
      coordinates: { latitude: 24.7914, longitude: 85.0002 },
      address: "Gaya, Bihar",
      city: "Gaya",
      state: "Bihar",
      country: "India",
    },
    jalgaon: {
      coordinates: { latitude: 21.0077, longitude: 75.5626 },
      address: "Jalgaon, Maharashtra",
      city: "Jalgaon",
      state: "Maharashtra",
      country: "India",
    },
    udaipur: {
      coordinates: { latitude: 24.5854, longitude: 73.7125 },
      address: "Udaipur, Rajasthan",
      city: "Udaipur",
      state: "Rajasthan",
      country: "India",
    },
    maheshtala: {
      coordinates: { latitude: 22.5049, longitude: 88.2482 },
      address: "Maheshtala, West Bengal",
      city: "Maheshtala",
      state: "West Bengal",
      country: "India",
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
