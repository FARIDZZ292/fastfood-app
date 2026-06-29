import React, { useEffect, useRef } from 'react';

export default function LeafletMap({ 
  center = [-6.2088, 106.8456], // Default to Jakarta, Indonesia
  zoom = 13, 
  markers = [], 
  onLocationSelect = null, 
  interactive = true 
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const markersGroupRef = useRef(null);

  useEffect(() => {
    // Check if Leaflet is loaded on window
    if (!window.L) {
      console.error("Leaflet script not loaded yet");
      return;
    }

    const L = window.L;

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: interactive,
        dragging: interactive,
        touchZoom: interactive,
        doubleClickZoom: interactive,
        scrollWheelZoom: interactive,
      }).setView(center, zoom);

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Initialize feature group for dynamic markers
      markersGroupRef.current = L.featureGroup().addTo(mapRef.current);

      // Handle click events for location selection (only if callback is provided)
      if (onLocationSelect && interactive) {
        mapRef.current.on('click', (e) => {
          const { lat, lng } = e.latlng;
          
          // Move or create the placement marker
          if (markerRef.current) {
            markerRef.current.setLatLng(e.latlng);
          } else {
            const customIcon = L.divIcon({
              html: `<div class="bg-orange-500 w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs animate-bounce text-white">📍</div>`,
              className: 'custom-pin-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 24]
            });
            markerRef.current = L.marker(e.latlng, { icon: customIcon }).addTo(mapRef.current);
          }
          
          onLocationSelect(lat, lng);
        });
      }
    } else {
      // If map already exists, update view
      mapRef.current.setView(center, zoom);
    }

    // Clean up on unmount
    return () => {
      // We don't necessarily want to destroy on every re-render,
      // but let's handle the cleanup properly.
    };
  }, [center, zoom, onLocationSelect, interactive]);

  // Handle updates to external markers list
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current || !window.L) return;
    
    const L = window.L;
    markersGroupRef.current.clearLayers();

    markers.forEach((m) => {
      if (!m.lat || !m.lng) return;

      const emoji = m.iconType === 'user' ? '👤' : m.iconType === 'courier' ? '🛵' : '🏪';
      const color = m.iconType === 'user' ? 'bg-green-500' : m.iconType === 'courier' ? 'bg-blue-500' : 'bg-orange-500';

      const customIcon = L.divIcon({
        html: `<div class="${color} w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[13px] text-white font-bold">${emoji}</div>`,
        className: 'custom-pin-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon });
      
      if (m.label) {
        marker.bindPopup(`<b style="font-family: sans-serif; font-size: 12px; color: #374151;">${m.label}</b>`);
      }
      
      markersGroupRef.current.addLayer(marker);
    });

    // Auto fit bounds if multiple markers exist
    if (markers.length > 1) {
      mapRef.current.fitBounds(markersGroupRef.current.getBounds(), { padding: [30, 30] });
    }
  }, [markers]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
      style={{ zIndex: 1 }}
    />
  );
}
