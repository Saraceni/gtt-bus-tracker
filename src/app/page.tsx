"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import BusLineSelector from "@/components/bus-line-selector"
import MobileMenu from "@/components/mobile-menu"
import type { BusLine, BusLocation, Entity, FeedMessage, Stop, StopTimes } from "@/lib/types"
import { lineColors } from "@/lib/colors"
import { BusIcon, CircleDot, MapPin, MenuIcon, X } from "lucide-react"
import Image from "next/image"
const colorsAssignedToLines = lineColors.map((color) => ({
  lines: [],
  color: color
})) as { lines: string[], color: string }[]

// Import map component dynamically to avoid SSR issues with Leaflet
const BusMap = dynamic(() => import("@/components/bus-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100">
      <div className="text-lg font-medium">Loading map...</div>
    </div>
  ),
})

const mockedData = require('./mocked-data.json')
const useMockedData = false

export default function Home() {

  const [selectedLines, setSelectedLines] = useState<string[]>([])
  const [busLocations, setBusLocations] = useState<Entity[]>([])
  const [stops, setStops] = useState<Stop[]>([])
  const [stopTimes, setStopTimes] = useState<StopTimes[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [firstLoad, setFirstLoad] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<{ tripId: string, tripColor: string, busId: string, routeId: string } | undefined>()

  const busLines = busLocations.reduce((acc, bus) => {
    const routeId = bus.vehicle.trip.routeId;

    // Skip if we already have this line in our accumulator
    if (acc.some(line => line.id === routeId)) {
      return acc;
    }

    // Check if this route already has a color assigned
    let colorAssignment = colorsAssignedToLines.find(item => item.lines.includes(routeId));

    // If no color is assigned yet, find the least used color
    if (!colorAssignment) {
      // Sort color assignments by usage count (ascending)
      const sortedColors = [...colorsAssignedToLines].sort((a, b) => a.lines.length - b.lines.length);

      // Take the first (least used) color
      colorAssignment = sortedColors[0];

      // Add this route to the color's assignment list
      colorAssignment.lines.push(routeId);
    }

    // Add the line to our accumulator
    acc.push({
      id: routeId,
      name: routeId,
      color: colorAssignment.color
    });

    return acc;
  }, [] as BusLine[]);

  const fetchTripDataForSelectedTrip = async (selectedTripId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/stops?tripId=${selectedTripId}`)
      const data = await response.json()
      setStopTimes(data.stopTimes)
      setStops(data.stops)
    } catch (error) {
      console.error("Error fetching trip data:", error)
      setError("Error fetching trip data")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch bus locations from API endpoint every 15 seconds
  useEffect(() => {

    if (useMockedData) {
      setBusLocations(mockedData.entity)
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/buses')
        if (!response.ok) {
          throw new Error('Failed to fetch bus locations')
        }
        const json: FeedMessage = await response.json()
        if (json.entity) {
          setBusLocations(json.entity)
        } else {
          setError('Scusa ma non ci sono dati di bus in tempo reale in questo momento')
        }
      } catch (error) {
        console.error('Error fetching bus locations:', error)
        setError('Errore nel caricamento dei dati')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData() // Initial fetch
    const interval = setInterval(fetchData, 15000) // Every 15 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  useEffect(() => {
    if (busLocations.length > 0 && !firstLoad) {
      toggleAllLines(true)
      setFirstLoad(true)
    }
  }, [busLocations, firstLoad])

  useEffect(() => {
    if (selectedTrip) {
      fetchTripDataForSelectedTrip(selectedTrip.tripId)
    } else {
      setStopTimes([])
      setStops([])
    }
  }, [selectedTrip])

  // Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please check your browser permissions.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
    }
  }

  // Filter bus locations based on selected lines
  const filteredBusLocations = busLocations.filter((bus) => selectedLines.includes(bus.vehicle.trip.routeId))

  const toggleBusLine = (lineId: string) => {
    setSelectedLines((prev) => (prev.includes(lineId) ? prev.filter((id) => id !== lineId) : [...prev, lineId]))
  }

  const toggleAllLines = (select: boolean) => {
    setSelectedLines(select ? busLines.map((line) => line.id) : [])
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden relative">
      <div className="bg-[#4125C8] text-white px-4  shadow-md">
        <div className="mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/bus.png" alt="App Logo" width={70} height={70} />
            <div className="text-xl font-bold">GTT Bus Tracker</div>
          </div>

          <button
            className="md:hidden bg-[#4125C8] border border-[#3518BD] py-2 px-[20px] rounded-[20px] flex items-center gap-2 shadow-[0_0_1px_2px_rgba(65,37,200,0.2),inset_0_0_0_2px_rgb(85,60,208),inset_0_-2px_2px_rgb(36,11,163)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon size={24} className="text-white" />
            {isMobileMenuOpen ? "Chiudi" : "Linee"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="hidden md:block w-64 bg-white border-r p-2 h-full">
          <BusLineSelector
            busLines={busLines}
            selectedLines={selectedLines}
            toggleBusLine={toggleBusLine}
            toggleAllLines={toggleAllLines}
          />
        </div>
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          <div className="h-full z-100">
            <BusLineSelector
              busLines={busLines}
              selectedLines={selectedLines}
              toggleBusLine={toggleBusLine}
              toggleAllLines={toggleAllLines}
            />

          </div>
        </MobileMenu>

        <div className="flex-1 z-0">
          <BusMap busLocations={filteredBusLocations} busLines={busLines} userLocation={userLocation} stops={stops} selectedTrip={selectedTrip} setSelectedTrip={setSelectedTrip} />
          <div className="absolute bottom-16 right-4 z-[1000]">
            <button
              onClick={getUserLocation}
              className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Get my location"
            >
              <MapPin size={24} className="text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md flex items-center space-x-2 z-50 w-[90%] min-w-[250px] md:max-w-md md:w-auto">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className="flex-grow">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Close error message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-[80px] left-[10px] md:left-[280px] flex items-center justify-center bg-white bg-opacity-50">
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div className="text-lg font-medium">Caricando dati...</div>
          </div>
        </div>
      )}

      {selectedTrip && (
        <div className="absolute top-[80px] right-[10px] flex items-center justify-center bg-white opacity-90 rounded shadow">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md">
            <CircleDot fill={selectedTrip?.tripColor} stroke="black" strokeWidth={1} size={20} />
            <div className="text-sm">Fermate bus <span className="font-bold">{selectedTrip.busId}</span> linea <span className="font-bold">{selectedTrip.routeId.endsWith("U") ? selectedTrip.routeId.slice(0, -1) : selectedTrip.routeId}</span> visibile</div>
            <div className="cursor-pointer hover:bg-gray-200" onClick={() => setSelectedTrip(undefined)}><X size={24} /></div>
          </div>
        </div>
      )}
    </div>
  )
}

