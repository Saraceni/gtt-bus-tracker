import { ExternalLink } from "lucide-react"

interface ResourceCardProps {
  resource: {
    title: string
    description: string
    category: string
    url: string
  }
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
      <p className="text-gray-600 mb-4 flex-grow">{resource.description}</p>
      <div className="flex items-center justify-between">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {resource.category}
        </span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 flex items-center"
        >
          Visit <ExternalLink className="ml-1" size={16} />
        </a>
      </div>
    </div>
  )
}

