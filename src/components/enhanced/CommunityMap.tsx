"use client";

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info, Search, Layers, Fullscreen, ZoomIn, ZoomOut } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface MapLocation {
  id: string;
  name: string;
  type: 'facility' | 'landmark' | 'service' | 'event';
  coordinates: [number, number];
  description: string;
  icon: string;
  address: string;
  contact?: string;
  hours?: string;
}

export function CommunityMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapStyle, setMapStyle] = useState('mapbox://styles/giomarc27/cmem7v44f00b201sg1qb26xdg');

  const locations: MapLocation[] = [
    {
      id: 'barangay-hall',
      name: 'Barangay Hall',
      type: 'facility',
      coordinates: [123.7307, 13.1390], // Legazpi City coordinates
      description: 'Main government office and community center',
      icon: '🏛️',
      address: 'Barangay Bitano, Legazpi City, Albay',
      contact: '+63 912 345 6789',
      hours: '8:00 AM - 5:00 PM'
    },
    {
      id: 'health-center',
      name: 'Health Center',
      type: 'service',
      coordinates: [123.7310, 13.1395],
      description: 'Community health services and medical assistance',
      icon: '🏥',
      address: 'Near Barangay Plaza, Legazpi City',
      contact: '+63 912 345 6790',
      hours: '7:00 AM - 6:00 PM'
    },
    {
      id: 'school',
      name: 'Elementary School',
      type: 'facility',
      coordinates: [123.7300, 13.1385],
      description: 'Primary education facility for children',
      icon: '🏫',
      address: 'Bitano Elementary School, Legazpi City',
      contact: '+63 912 345 6791',
      hours: '7:00 AM - 4:00 PM'
    },
    {
      id: 'market',
      name: 'Public Market',
      type: 'service',
      coordinates: [123.7320, 13.1392],
      description: 'Local market for fresh produce and goods',
      icon: '🛒',
      address: 'Bitano Public Market, Legazpi City',
      contact: '+63 912 345 6792',
      hours: '5:00 AM - 8:00 PM'
    },
    {
      id: 'park',
      name: 'Community Park',
      type: 'landmark',
      coordinates: [123.7295, 13.1388],
      description: 'Recreational area and gathering space',
      icon: '🌳',
      address: 'Bitano Community Park, Legazpi City',
      hours: '24/7'
    },
    {
      id: 'church',
      name: 'Barangay Church',
      type: 'landmark',
      coordinates: [123.7305, 13.1398],
      description: 'Religious center and community landmark',
      icon: '⛪',
      address: 'Bitano Church, Legazpi City',
      hours: '6:00 AM - 8:00 PM'
    }
  ];

  useEffect(() => {
    // Load Mapbox GL JS
    const loadMapbox = async () => {
      if (typeof window !== 'undefined' && !window.mapboxgl) {
        const mapboxgl = await import('mapbox-gl');
        window.mapboxgl = mapboxgl.default;
        
        // Set your Mapbox access token
        window.mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiZ2lvbWFyYzI3IiwiYSI6ImNrcm9qZ2Z1YzBqZ2Yyb3FqZ2Z1YzBqZ2YifQ.example';
      }

      if (mapRef.current && window.mapboxgl && !map) {
        const newMap = new window.mapboxgl.Map({
          container: mapRef.current,
          style: mapStyle,
          center: [121.7740, 12.8797], // Philippines center
          zoom: 5, // Start with Philippines view
          pitch: 0,
          bearing: 0
        });

        newMap.on('load', () => {
          setIsLoading(false);
          
                     // Zoom to Barangay Bitano after map loads
           setTimeout(() => {
             newMap.flyTo({
               center: [123.7307, 13.1390], // Barangay Bitano, Legazpi City, Albay
               zoom: 16,
               duration: 3000,
               essential: true
             });
           }, 1000);

          // Add custom markers for each location
          locations.forEach(location => {
            // Create marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'map-marker';
            markerEl.innerHTML = `
              <div class="marker-content">
                <div class="marker-icon">${location.icon}</div>
                <div class="marker-pulse"></div>
              </div>
            `;

            // Add click event
            markerEl.addEventListener('click', () => {
              setSelectedLocation(location);
            });

            // Create popup
            const popup = new window.mapboxgl.Popup({ 
              offset: 25,
              closeButton: true,
              closeOnClick: false
            })
              .setHTML(`
                <div class="map-popup">
                  <h3 class="popup-title">${location.name}</h3>
                  <p class="popup-description">${location.description}</p>
                  <div class="popup-address">📍 ${location.address}</div>
                  ${location.contact ? `<div class="popup-contact">📞 ${location.contact}</div>` : ''}
                  ${location.hours ? `<div class="popup-hours">🕒 ${location.hours}</div>` : ''}
                  <div class="popup-type">${location.type}</div>
                </div>
              `);

            // Add marker to map
            new window.mapboxgl.Marker(markerEl)
              .setLngLat(location.coordinates)
              .setPopup(popup)
              .addTo(newMap);
          });

          // Add 3D building layer
          newMap.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'min-zoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          });

          // Add navigation controls
          newMap.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
          newMap.addControl(new window.mapboxgl.FullscreenControl(), 'top-right');
        });

        setMap(newMap);
      }
    };

    loadMapbox();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapRef, map, mapStyle]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate map container entrance
      gsap.fromTo('.map-container', 
        { 
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        { 
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out"
        }
      );

      // Animate location cards
      gsap.fromTo('.location-card', 
        { 
          opacity: 0,
          x: -50
        },
        { 
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }
      );

    }, mapRef);

    return () => ctx.revert();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() && map) {
      // Search for location using Mapbox Geocoding API
      const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${window.mapboxgl.accessToken}&country=PH&bbox=120.0,12.0,127.0,19.0`;
      
      fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            map.flyTo({
              center: [lng, lat],
              zoom: 12,
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.error('Search error:', error);
        });
    }
  };

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
    map?.flyTo({ 
      center: location.coordinates, 
      zoom: 17,
      duration: 2000
    });
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="map" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-16">
           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
             Explore Barangay Bitano
           </h2>
           <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
             Discover important locations, services, and landmarks within Barangay Bitano, Legazpi City, Albay. 
             Click on markers to learn more about each place in our community.
           </p>
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-3">
            <div className="map-container relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-green-900/30 overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                  </div>
                </div>
              )}
              
              <div ref={mapRef} className="w-full h-96 lg:h-[500px]" />
              
              {/* Search Bar */}
              <div className="absolute top-4 left-4 right-4 z-20">
                <div className="flex bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 dark:border-green-900/30">
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 px-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-3 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-20 right-4 flex flex-col gap-2 z-20">
                                 <button 
                   className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300"
                   onClick={() => map?.flyTo({ center: [123.7307, 13.1390], zoom: 16, duration: 2000 })}
                   title="Reset to Barangay Bitano"
                 >
                   <Navigation className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                 </button>
                <button 
                  className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  onClick={() => map?.flyTo({ center: [123.7307, 13.1390], zoom: 18, pitch: 60, duration: 2000 })}
                  title="Zoom to Barangay"
                >
                  <MapPin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button 
                  className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  onClick={() => map?.zoomIn()}
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button 
                  className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  onClick={() => map?.zoomOut()}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Selected Location Info */}
              {selectedLocation && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-green-100 dark:border-green-900/30 z-20">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{selectedLocation.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{selectedLocation.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedLocation.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">📍 {selectedLocation.address}</p>
                      {selectedLocation.contact && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">📞 {selectedLocation.contact}</p>
                      )}
                      {selectedLocation.hours && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">🕒 {selectedLocation.hours}</p>
                      )}
                    </div>
                    <button 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => setSelectedLocation(null)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location List */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100 dark:border-green-900/30">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Community Locations
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <div 
                    key={location.id}
                    className="location-card p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{location.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {location.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {location.type}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {location.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .map-marker {
          cursor: pointer;
          position: relative;
        }

        .marker-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-icon {
          background: white;
          border: 3px solid #22c55e;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-center;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 2;
          position: relative;
        }

        .marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: rgba(34, 197, 94, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        .map-popup {
          padding: 12px;
          max-width: 250px;
        }

        .popup-title {
          font-weight: bold;
          margin-bottom: 6px;
          color: #1f2937;
          font-size: 14px;
        }

        .popup-description {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .popup-address, .popup-contact, .popup-hours {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .popup-type {
          font-size: 10px;
          color: #22c55e;
          text-transform: uppercase;
          font-weight: bold;
          margin-top: 6px;
        }
      `}</style>
    </section>
  );
}
