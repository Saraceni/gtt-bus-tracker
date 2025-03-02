export interface BusLine {
    id: string
    name: string
    color: string
}

export interface BusLocation {
    id: string
    lineId: string
    lat: number
    lng: number
    direction: string
    speed: number
    lastUpdated: number
}

export interface Entity {
    id: string
    vehicle: {
        trip: {
            routeId: string
            scheduleRelationship: string
            tripId: string
            startDate: string
            startTime: string
        }
        occupancyStatus: string
        position: {
            latitude: number
            longitude: number
            bearing: number
        }
        timestamp: string
        vehicle: {
            id: string
            label: string
        }
    }
}

export interface FeedMessage {
    header: {
        gtfsRealtimeVersion: string
    }
    entity?: Entity[]
}