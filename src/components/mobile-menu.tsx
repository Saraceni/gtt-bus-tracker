import type React from "react"
import { X } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function MobileMenu({ isOpen, onClose, children }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-100 bg-black bg-opacity-50 min-h-0 h-screen">
      <div className="w-full h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden z-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#ececec]">
          <h2 className="text-lg font-semibold text-gray-800">Menu Selezione Linee</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

