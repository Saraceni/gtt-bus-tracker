import type { BusLine } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

interface BusLineSelectorProps {
  busLines: BusLine[]
  selectedLines: string[]
  toggleBusLine: (lineId: string) => void
  toggleAllLines: (select: boolean) => void
}

export default function BusLineSelector({
  busLines,
  selectedLines,
  toggleBusLine,
  toggleAllLines,
}: BusLineSelectorProps) {
  const allSelected = selectedLines.length === busLines.length
  const someSelected = selectedLines.length > 0 && selectedLines.length < busLines.length

  //#14516e mais escura
  // #05aced mais clara
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h2 className="text-lg text-black font-semibold hidden md:block">Linee</h2>

      <div className="flex items-center justify-center mt-4 mx-4 md:mx-0 border border-gray-200 rounded-md shadow-sm">
        <button
          onClick={() => toggleAllLines(true)}
          className="bg-[#4125C8] text-white px-3 py-2 md:py-1 rounded-l-md text-sm hover:bg-[#05aced] transition-colors flex-1"
        >
          Seleziona tutte
        </button>
        <button
          onClick={() => toggleAllLines(false)}
          className="bg-white text-black px-3 py-2 md:py-1 rounded-r-md text-sm hover:bg-gray-200 transition-colors flex-1"
        >
          Deseleziona tutte
        </button>
      </div>
 
      <div className="overflow-y-auto flex-1 min-h-0 space-y-2 rounded-md md:mt-2 p-4 md:p-0">
        {busLines.map((line) => (
          <div key={line.id} className="flex items-center p-2 border border-gray-200 rounded-md" onClick={() => toggleBusLine(line.id)} >
            <input
              type="checkbox"
              id={`line-${line.id}`}
              checked={selectedLines.includes(line.id)}
              readOnly
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`line-${line.id}`} className="ml-2 flex items-center text-black">
              <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: line.color }}></span>
              {line.name.endsWith("U") ? line.name.slice(0, -1) : line.name}
            </label>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-500 flex-shrink-0 h-10 border-t border-gray-200 pt-2 px-4 md:px-0">
        {allSelected ? (
          <p>All bus lines are visible</p>
        ) : someSelected ? (
          <p>
            {selectedLines.length} di {busLines.length} linee visibili
          </p>
        ) : (
          <p>Nessuna linea selezionata</p>
        )}
      </div>

      {/* <div className="flex justify-center items-center md:hidden">
        <button disabled={selectedLines.length === 0} className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors w-full">
          {selectedLines.length === 0 ? "Seleziona almeno una linea" : "Pronto"}
        </button>
      </div> */}
    </div>
  )
}

