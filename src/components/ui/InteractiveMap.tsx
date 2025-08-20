"use client";

import { MapPin, Navigation, Home, Building, Users, Phone } from 'lucide-react';

const mapLocations = [
  {
    id: 1,
    name: "Barangay Hall",
    type: "government",
    coordinates: { x: 45, y: 30 },
    icon: Building,
    description: "Main administrative office"
  },
  {
    id: 2,
    name: "Community Center",
    type: "community",
    coordinates: { x: 60, y: 50 },
    icon: Users,
    description: "Events and gatherings"
  },
  {
    id: 3,
    name: "Health Center",
    type: "healthcare",
    coordinates: { x: 30, y: 60 },
    icon: Phone,
    description: "Medical services"
  },
  {
    id: 4,
    name: "Public School",
    type: "education",
    coordinates: { x: 70, y: 25 },
    icon: Home,
    description: "Elementary education"
  },
  {
    id: 5,
    name: "Market Area",
    type: "commercial",
    coordinates: { x: 55, y: 75 },
    icon: Building,
    description: "Local marketplace"
  }
];

export function InteractiveMap() {
  return (
    <div className="relative w-full h-96 lg:h-[500px] bg-gradient-to-br from-green-100 to-emerald-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-green-50 dark:bg-gray-800">
        {/* Simulated roads */}
        <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-300 dark:bg-gray-600"></div>
        <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-300 dark:bg-gray-600"></div>
        <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-gray-300 dark:bg-gray-600"></div>
        <div className="absolute top-0 bottom-0 right-1/4 w-2 bg-gray-300 dark:bg-gray-600"></div>
        
        {/* River/water feature */}
        <div className="absolute bottom-0 left-0 right-1/3 h-12 bg-blue-200 dark:bg-blue-800 rounded-t-3xl"></div>
      </div>

      {/* Map Locations */}
      {mapLocations.map((location) => (
        <div
          key={location.id}
          className="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${location.coordinates.x}%`,
            top: `${location.coordinates.y}%`
          }}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-300 ring-4 ring-white dark:ring-gray-800">
              <location.icon className="w-4 h-4 text-white" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                <div className="font-semibold">{location.name}</div>
                <div className="text-gray-300">{location.description}</div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Navigation className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Legend</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Public Services</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Water</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Roads</span>
          </div>
        </div>
      </div>
    </div>
  );
}
