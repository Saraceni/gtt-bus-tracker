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

export interface Stop {
    stop_id: string
    stop_code: string
    stop_name: string
    stop_desc: string
    stop_lat: string
    stop_lon: string
    zone_id: string
    stop_url: string
    location_type: string
    parent_station: string
    stop_timezone: string
    wheelchair_boarding: string
}

export interface StopTimes {
    trip_id: string
    arrival_time: string
    departure_time: string
    stop_id: string
    stop_sequence: number
    stop_headsign: string
    pickup_type: string
    drop_off_type: string
    shape_dist_traveled: string
    timepoint: string
}