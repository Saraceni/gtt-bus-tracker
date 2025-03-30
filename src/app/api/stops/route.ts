import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

const parseCsv = (csv: string) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.replace(/^"(.*)"$/, '$1').trim());

    const stops = lines.slice(1)
        .filter(line => line.trim() !== '')
        .map(line => {
            // Handle quoted values properly
            const values: string[] = [];
            let inQuotes = false;
            let currentValue = '';

            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(currentValue.replace(/^"(.*)"$/, '$1').trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }

            // Add the last value
            values.push(currentValue.replace(/^"(.*)"$/, '$1').trim());

            // Create the stop object
            const stop: { [key: string]: string } = {};
            headers.forEach((header, index) => {
                stop[header] = values[index] || '';
            });

            return stop;
        });

    return stops;
}

var cachedStops: any[] = []
var cachedStopTimes: any[] = []

export const maxDuration = 30; // This function can run for a maximum of 20 seconds

export async function GET(request: NextRequest) {
    // I need to download the zip file from the url https://www.gtt.to.it/open_data/gtt_gtfs.zip
    // I need to unzip the file 
    // I need to read the stops.txt file
    // I need to return the stops as a json
    try {

        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const tripId = searchParams.get('tripId')
        const clearCache = searchParams.get('clearCache') === 'true';

        if (!tripId && !clearCache) {
            return NextResponse.json({ error: "Missing tripId or clearCache parameter" }, { status: 400 });
        }

        // Clear cache if requested
        if (clearCache) {
            cachedStops = [];
            cachedStopTimes = [];
            console.log("Cache cleared");
        }

        // Check if we can use cached data
        const useCache = cachedStops.length > 0 && !clearCache;

        // If we have cached data and no cache clear was requested, use it
        if (useCache) {
            console.log("Using cached data");

            // StopTimes has an attribute trip_id and an attribute stop_id
            // I need to return the stops that are in the tripStopTimes and the unique stops that are not in the tripStopTimes
            // StopTimes have multiple stop_ids for the same trip_id. I need to return the unique stops for the trip_id
            const tripStopTimes = cachedStopTimes.filter(stopTime => stopTime.trip_id === tripId);
            const uniqueStops = tripStopTimes.reduce((acc, stopTime) => {
                if (!acc.some((stop: any) => stop.stop_id === stopTime.stop_id)) {
                    const stop = cachedStops.find((stop: any) => stop.stop_id === stopTime.stop_id)
                    if (stop) {
                        acc.push(stop)
                    }
                }
                return acc
            }, [] as any[])
            return NextResponse.json({ stops: uniqueStops, stopTimes: tripStopTimes });
        }

        const response = await fetch("https://www.gtt.to.it/open_data/gtt_gtfs.zip");

        if (!response.ok) {
            throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
        }

        // Get the zip file as an ArrayBuffer
        const zipBuffer = await response.arrayBuffer();

        // Load the zip file
        const zip = await JSZip.loadAsync(zipBuffer);

        // Extract the stops.txt file (assuming this is what you need)
        const stopsFile = zip.file("stops.txt");

        if (!stopsFile) {
            throw new Error("stops.txt not found in the zip file");
        }

        // Get the content as text
        const stopsContent = await stopsFile.async("string");

        // Parse the CSV content (simple example)
        const stops = parseCsv(stopsContent);

        const stopTimesFile = zip.file("stop_times.txt")
        if (!stopTimesFile) {
            throw new Error("stop_times.txt not found in the zip file");
        }

        const stopTimesContent = await stopTimesFile.async("string");
        const stopTimes = parseCsv(stopTimesContent);

        cachedStops = stops
        cachedStopTimes = stopTimes

        // StopTimes has an attribute trip_id and an attribute stop_id
        // I need to return the stops that are in the tripStopTimes and the unique stops that are not in the tripStopTimes
        // StopTimes have multiple stop_ids for the same trip_id. I need to return the unique stops for the trip_id
        const tripStopTimes = cachedStopTimes.filter(stopTime => stopTime.trip_id === tripId);
        const uniqueStops = tripStopTimes.reduce((acc, stopTime) => {
            if (!acc.some((stop: any) => stop.stop_id === stopTime.stop_id)) {
                const stop = cachedStops.find((stop: any) => stop.stop_id === stopTime.stop_id)
                if (stop) {
                    acc.push(stop)
                }
            }
            return acc
        }, [] as any[])
        return NextResponse.json({ stops: uniqueStops, stopTimes: tripStopTimes });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch GTFS data" }, { status: 500 });
    }

}
