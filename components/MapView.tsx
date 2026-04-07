'use client';

import { useEffect, useRef } from 'react';
import styles from './MapView.module.css';

interface MapViewProps {
  lat: number;
  lng: number;
  treeName: string;
  plantName: string;
}

export default function MapView({ lat, lng, treeName, plantName }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      // Fallback: show placeholder when no token
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="
            width:100%;height:100%;
            display:flex;flex-direction:column;
            align-items:center;justify-content:center;
            background:linear-gradient(135deg,#1B4332,#2D6A4F);
            color:white;gap:1rem;font-family:Inter,sans-serif;
          ">
            <div style="font-size:3rem">🗺️</div>
            <div style="font-size:1.1rem;font-weight:600">${treeName}</div>
            <div style="font-size:0.85rem;opacity:0.7">Kolhapur, Maharashtra</div>
            <div style="font-size:0.75rem;opacity:0.5;text-align:center;max-width:200px">
              Add NEXT_PUBLIC_MAPBOX_TOKEN to enable live map
            </div>
          </div>`;
      }
      return;
    }

    // Dynamically import mapbox-gl to avoid SSR issues
    import('mapbox-gl').then((mapboxgl) => {
      const mapbox = mapboxgl.default;
      mapbox.accessToken = token;

      const map = new mapbox.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [lng, lat],
        zoom: 13,
      });

      mapInstanceRef.current = map;

      map.on('load', () => {
        // Add custom tree marker
        const el = document.createElement('div');
        el.innerHTML = '🌳';
        el.style.fontSize = '2.5rem';
        el.style.cursor = 'pointer';
        el.style.filter = 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))';

        new mapbox.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(
            new mapbox.Popup({ offset: 25 }).setHTML(`
              <div style="font-family:'Inter',sans-serif;padding:4px">
                <div style="font-weight:700;font-size:0.95rem;color:#1B4332">🌳 ${treeName}</div>
                <div style="font-size:0.8rem;color:#666;margin-top:4px">${plantName}</div>
              </div>
            `)
          )
          .addTo(map);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, treeName, plantName]);

  return <div ref={mapRef} className={styles.map} />;
}
