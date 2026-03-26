import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Street {
  name: string;
  shortName: string;
  color: string;
  weight: number;
  coords: [number, number][];
  info: string;
}

const streets: Street[] = [
  {
    name: "Calle Pidal",
    shortName: "C. Pidal",
    color: "#2563eb",
    weight: 6,
    coords: [
      [43.41688, -4.75372],
      [43.41734, -4.75365],
      [43.41773, -4.75361],
      [43.41815, -4.75358],
      [43.41859, -4.75356],
    ],
    info: "Entrada a la villa · Batería (n.º 22-16) · Línea (n.º 14-10) · C/D junto a Correos",
  },
  {
    name: "C. Prolongación Las Barqueras",
    shortName: "Prol. Barqueras",
    color: "#7c3aed",
    weight: 6,
    coords: [
      [43.41859, -4.75356],
      [43.41882, -4.75378],
      [43.41907, -4.75386],
      [43.41949, -4.75423],
    ],
    info: "Zona semipeatonal · Aparcamiento en línea lado izquierdo",
  },
  {
    name: "C. José Enrique Rozas Guijarro",
    shortName: "C. J.E. Rozas",
    color: "#0891b2",
    weight: 6,
    coords: [
      [43.42183, -4.75506],
      [43.42192, -4.75545],
      [43.42207, -4.75644],
    ],
    info: "Batería lado izquierdo · C/D en n.º 5 (8:00-15:00)",
  },
  {
    name: "Calle Alfonso IX",
    shortName: "C. Alfonso IX",
    color: "#059669",
    weight: 6,
    coords: [
      [43.42096, -4.75539],
      [43.42145, -4.75530],
      [43.42183, -4.75506],
      [43.42195, -4.75512],
    ],
    info: "Línea lado izquierdo · Reserva vehículos oficiales (Policía Local)",
  },
  {
    name: "Calle Egidio Gavito",
    shortName: "C. Egidio Gavito",
    color: "#dc2626",
    weight: 6,
    coords: [
      [43.42195, -4.75512],
      [43.42225, -4.75480],
      [43.42267, -4.75437],
      [43.42310, -4.75405],
    ],
    info: "Dirección salida de la villa · Batería lado izquierdo (n.º 3-15)",
  },
  {
    name: "Calle Román Romano",
    shortName: "C. Román Romano",
    color: "#ea580c",
    weight: 6,
    coords: [
      [43.42018, -4.75685],
      [43.42045, -4.75770],
      [43.42069, -4.75795],
      [43.42098, -4.75870],
      [43.42115, -4.75905],
    ],
    info: "Línea + batería · C/D n.º 6, supermercado El Día (8:00-15:00)",
  },
  {
    name: "C. Hermanas Franciscanas del Hospital",
    shortName: "C. Hnas. Franciscanas",
    color: "#be185d",
    weight: 6,
    coords: [
      [43.42018, -4.75685],
      [43.41983, -4.75679],
      [43.41962, -4.75685],
      [43.41950, -4.75690],
    ],
    info: "Batería lado derecho (n.º 2-6) · Línea lado izquierdo (n.º 4)",
  },
  {
    name: "Calle Veneranda Manzano",
    shortName: "C. V. Manzano",
    color: "#4f46e5",
    weight: 6,
    coords: [
      [43.41950, -4.75690],
      [43.41983, -4.75712],
      [43.42000, -4.75738],
      [43.42018, -4.75685],
    ],
    info: "Batería lado derecho · 2 plazas movilidad reducida ♿",
  },
];

// Custom blue parking marker icon via SVG data URL
function createMarkerIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${color}" stroke="white" stroke-width="2"/>
    <text x="14" y="18" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="sans-serif">P</text>
  </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
}

export default function LlanesMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [activeStreet, setActiveStreet] = useState<string | null>(null);
  const polylineRefs = useRef<Map<string, L.Polyline>>(new Map());
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [43.4200, -4.7560],
      zoom: 16,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    // OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add streets
    streets.forEach((street) => {
      // Polyline
      const polyline = L.polyline(street.coords, {
        color: street.color,
        weight: street.weight,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      polyline.bindPopup(
        `<div style="min-width:200px">
          <strong style="color:${street.color};font-size:14px">${street.name}</strong>
          <hr style="margin:6px 0;border-color:#e5e7eb"/>
          <p style="font-size:12px;color:#4b5563;margin:0;line-height:1.5">${street.info}</p>
          <div style="margin-top:6px;background:${street.color}15;border-radius:4px;padding:4px 8px">
            <span style="font-size:11px;color:${street.color};font-weight:600">🅿️ Zona Azul</span>
          </div>
        </div>`,
        { className: "custom-popup" }
      );

      polylineRefs.current.set(street.name, polyline);

      // Marker at midpoint
      const mid = street.coords[Math.floor(street.coords.length / 2)];
      const marker = L.marker(mid, {
        icon: createMarkerIcon(street.color),
      }).addTo(map);

      marker.bindPopup(
        `<div style="min-width:200px">
          <strong style="color:${street.color};font-size:14px">${street.name}</strong>
          <hr style="margin:6px 0;border-color:#e5e7eb"/>
          <p style="font-size:12px;color:#4b5563;margin:0;line-height:1.5">${street.info}</p>
          <div style="margin-top:6px;background:${street.color}15;border-radius:4px;padding:4px 8px">
            <span style="font-size:11px;color:${street.color};font-weight:600">🅿️ Zona Azul</span>
          </div>
        </div>`,
        { className: "custom-popup" }
      );

      markerRefs.current.set(street.name, marker);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Highlight selected street
  useEffect(() => {
    streets.forEach((street) => {
      const polyline = polylineRefs.current.get(street.name);
      if (!polyline) return;

      if (activeStreet === street.name) {
        polyline.setStyle({ weight: 10, opacity: 1 });
        polyline.openPopup();
        mapInstance.current?.panTo(street.coords[Math.floor(street.coords.length / 2)] as L.LatLngExpression);
      } else {
        polyline.setStyle({ weight: street.weight, opacity: 0.8 });
      }
    });
  }, [activeStreet]);

  return (
    <div>
      {/* Map */}
      <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-blue-200 relative">
        <div ref={mapRef} className="w-full h-[400px] sm:h-[480px] z-0" />
        {/* Overlay badge */}
        <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow px-3 py-1.5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-semibold text-gray-700">Zona Azul</span>
        </div>
      </div>

      {/* Street selector pills */}
      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-2 text-center">Pulsa una calle para localizarla en el mapa:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {streets.map((street) => (
            <button
              key={street.name}
              onClick={() =>
                setActiveStreet(activeStreet === street.name ? null : street.name)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border-2 cursor-pointer ${
                activeStreet === street.name
                  ? "text-white shadow-md scale-105"
                  : "bg-white text-gray-600 hover:shadow"
              }`}
              style={{
                borderColor: street.color,
                backgroundColor:
                  activeStreet === street.name ? street.color : undefined,
              }}
            >
              {street.shortName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
