import { NextRequest, NextResponse } from 'next/server';
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import fetch from "node-fetch";

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch("http://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx");
    if (!response.ok) {
        const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
        throw error;
    }
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    return NextResponse.json(feed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch GTFS data" }, { status: 500 });
  }
}

