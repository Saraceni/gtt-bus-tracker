"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import BusLineSelector from "@/components/bus-line-selector"
import MobileMenu from "@/components/mobile-menu"
import type { BusLine, BusLocation, Entity, FeedMessage } from "@/lib/types"
import { lineColors } from "@/lib/colors"

const colorsAssignedToLines = lineColors.map((color, index) => ({
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
const useMockedData = true

export default function Home() {
  const [selectedLines, setSelectedLines] = useState<string[]>([])
  const [busLocations, setBusLocations] = useState<Entity[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [firstLoad, setFirstLoad] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const busLines = busLocations.reduce((acc, bus) => {
    if (!acc.some(line => line.id === bus.vehicle.trip.routeId)) {
      var lineColor = colorsAssignedToLines.find(color => color.lines.includes(bus.vehicle.trip.routeId))?.color
      if (!lineColor) {
        // Get the least used color
        lineColor = colorsAssignedToLines.reduce((leastUsed, current) => {
          return leastUsed.lines.length < current.lines.length ? leastUsed : current
        }).color
        colorsAssignedToLines.find(color => color.color === lineColor)?.lines.push(bus.vehicle.trip.routeId)
      }
      acc.push({ id: bus.vehicle.trip.routeId, name: bus.vehicle.trip.routeId, color: lineColor });
    }
    return acc;
  }, [] as BusLine[]);

  // Fetch bus locations from API endpoint every 15 seconds
  useEffect(() => {
    if (useMockedData) {
      setBusLocations(mockedData.entity)
      return
    }

    const fetchData = async () => {
      try {
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
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">GTT Bus Tracker</div>
          <button
            className="md:hidden bg-blue-700 p-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
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
          <BusMap busLocations={filteredBusLocations} busLines={busLines} />
        </div>
      </div>

      {error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md flex items-center space-x-2 z-50 w-[90%] min-w-[250px] md:max-w-md md:w-auto">
          <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          </div>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

