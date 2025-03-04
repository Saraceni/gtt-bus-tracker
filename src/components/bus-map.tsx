"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
import type { BusLocation, BusLine, Entity } from "@/lib/types"
import { MapPin } from "lucide-react"
import ReactDOMServer from "react-dom/server"

interface BusMapProps {
  busLocations: Entity[]
  busLines: BusLine[]
  userLocation: [number, number] | null
}

export default function BusMap({ busLocations, busLines, userLocation }: BusMapProps) {
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
            <div>
              <h3 className="font-bold">Bus {bus.id}</h3>
              <p>Linea: {bus.vehicle.trip.routeId}</p>
              {/* <p>Direction: {bus.vehicle.position.bearing}</p> */}
              <p>Ultimo aggiornamento: {new Date(+bus.vehicle.timestamp * 1000).toLocaleTimeString('it-IT', {
                timeZone: 'Europe/Rome',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}</p>
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
    </MapContainer>
  )
}

