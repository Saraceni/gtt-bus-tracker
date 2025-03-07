"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useRef, useState } from "react"
import type { BusLocation, BusLine, Entity, Stop, StopTimes } from "@/lib/types"
import { ArrowRight, CircleDot, Eye, MapPin, MapPinPlus } from "lucide-react"
import ReactDOMServer from "react-dom/server"
import BusStopIcon from "./BusStopIcon"

interface BusMapProps {
  busLocations: Entity[]
  busLines: BusLine[]
  userLocation: [number, number] | null
  stops: Stop[]
  selectedTrip: { tripId: string, tripColor: string, busId: string, routeId: string } | undefined
  setSelectedTrip: (trip: { tripId: string, tripColor: string, busId: string, routeId: string } | undefined) => void
}

export default function BusMap({ busLocations, busLines, userLocation, stops, selectedTrip, setSelectedTrip }: BusMapProps) {
  // Default center coordinates (city center)
  const center: [number, number] = [45.0707, 7.6839] // Torino coordinates as example

  const leafletInitialized = useRef(false)

  useEffect(() => {
    if (!leafletInitialized.current) {
      // Fix for Leaflet marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
      leafletInitialized.current = true
    }
  }, [])

  

  // Create custom icons for each bus line
  const getBusIcon = (routeId: string, bearing: number) => {
    const color = busLines.find(line => line.id === routeId)?.color || "#3388ff"

    return L.divIcon({
      className: "custom-bus-icon",
      html: `
        <div style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; position: relative;">
          <div style="${getPositionBasedOnBearing(bearing)}">
            <svg width="30" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L20 18H4L12 3Z" fill="${color}" />
            </svg>
          </div>
          <span style="background-color: white; color: black; border-radius: 50%; font-weight: bold; font-size: 12px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; text-align: center; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;">
            ${routeId.endsWith("U") ? routeId.slice(0, -1) : routeId}
          </span>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [10, 10],
    })
  }

  // Function to calculate position based on bearing
  const getPositionBasedOnBearing = (bearing: number) => {
    // Normalize bearing to 0-360 range
    const normalizedBearing = ((bearing % 360) + 360) % 360;

    // Calculate position
    const radius = 18; // Distance from center
    const angleInRadians = (normalizedBearing * Math.PI) / 180;
    const x = Math.sin(angleInRadians) * radius;
    const y = -Math.cos(angleInRadians) * radius; // Negative because y increases downward in CSS

    return `position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${bearing}deg); 
            z-index: 1;`;
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false} // We'll add zoom control to the bottom right
    >
      <TileLayer
        className="z-0"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {busLocations.map((bus) => (
        <Marker key={bus.id} position={[bus.vehicle.position.latitude, bus.vehicle.position.longitude]} icon={getBusIcon(bus.vehicle.trip.routeId, bus.vehicle.position.bearing)}>
          <Popup>
            <div className="flex flex-col gap-2">
              <div>Bus {bus.id}</div>
              <div>Linea: {bus.vehicle.trip.routeId}</div>
              {/* <p>Direction: {bus.vehicle.position.bearing}</p> */}
              <div>Ultimo aggiornamento: {new Date(+bus.vehicle.timestamp * 1000).toLocaleTimeString('it-IT', {
                timeZone: 'Europe/Rome',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}</div>
              <button
                onClick={() => {
                  setSelectedTrip({ tripId: bus.vehicle.trip.tripId, busId: bus.id, tripColor: busLines.find(line => line.id === bus.vehicle.trip.routeId)?.color || "#3388ff", routeId: bus.vehicle.trip.routeId })
                }}
                className="py-1.5 text-black text-md font-bold flex items-center gap-2"
              >
                <Eye size={16} />
                Vedi Fermate
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {userLocation && (
        <Marker position={userLocation} icon={L.divIcon({
          className: "user-location-icon",
          html: ReactDOMServer.renderToString(
            <div className="text-blue-600 inline-flex">
              <MapPin fill="#FFFFFF" size={40} />
            </div>
          ),
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        })}>
          <Popup>
            <div>La tua posizione</div>
          </Popup>
        </Marker>
      )}

      {stops.map((stop) => (
        <Marker key={stop.stop_id} position={[Number(stop.stop_lat), Number(stop.stop_lon)]} icon={L.divIcon({
          className: "selected-trip-icon opacity-90",
          html: ReactDOMServer.renderToString(
            <div className="inline-flex">
              <BusStopIcon mainColor={selectedTrip?.tripColor} width="30px" height="30px" />
            </div>
          ),
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15]
        })}>
          <Popup>
            <div>{stop.stop_name}</div>
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  )
}

