
import type { BusLine, BusLocation } from "./types"

// Sample bus lines data
export const busLines: BusLine[] = [
  { id: "1", name: "Downtown Express", color: "#e74c3c" },
  { id: "2", name: "Uptown Local", color: "#3498db" },
  { id: "3", name: "Crosstown", color: "#2ecc71" },
  { id: "4", name: "Airport Shuttle", color: "#f39c12" },
  { id: "5", name: "Riverside", color: "#9b59b6" },
  { id: "6", name: "Beach Line", color: "#1abc9c" },
  { id: "7", name: "Night Owl", color: "#34495e" },
]

// Generate random bus locations
const generateRandomBuses = (): BusLocation[] => {
  // NYC area coordinates as example
  const centerLat = 40.7128
  const centerLng = -74.006
  const spread = 0.05

  const buses: BusLocation[] = []

  // Generate 3-5 buses for each line
  busLines.forEach((line) => {
    const busCount = Math.floor(Math.random() * 3) + 3 // 3-5 buses per line

    for (let i = 0; i < busCount; i++) {
      // Random position around center
      const lat = centerLat + (Math.random() * 2 - 1) * spread
      const lng = centerLng + (Math.random() * 2 - 1) * spread

      buses.push({
        id: `${line.id}-${i}`,
        lineId: line.id,
        lat,
        lng,
        direction: ["Northbound", "Southbound", "Eastbound", "Westbound"][Math.floor(Math.random() * 4)],
        speed: Math.floor(Math.random() * 35) + 5, // 5-40 mph
        lastUpdated: Date.now(),
      })
    }
  })

  return buses
}

// In a real app, this would fetch from a transit API
export const fetchBusLocations = async (): Promise<BusLocation[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate random bus locations
  return generateRandomBuses()
}

