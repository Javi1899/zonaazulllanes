import { useState } from "react";
import DigitalClock from "./components/DigitalClock";
import LlanesMap from "./components/LlanesMap";

/* ─── Data ─── */

const tarifas = [
  { duracion: "1 hora", precio: "0,60 €" },
  { duracion: "1 h 30 min", precio: "0,90 €" },
  { duracion: "2 horas (máximo)", precio: "1,20 €" },
];

interface Calle {
  nombre: string;
  detalles: string[];
  cargaDescarga?: string;
}

const calles: Calle[] = [
  {
    nombre: "Calle Pidal",
    detalles: [
      "Dirección entrada a la villa. Aparcamientos en lado izquierdo.",
      "Desde la rotonda y el n.º 22 al n.º 16: aparcamiento en batería.",
      "Desde el n.º 14 al n.º 10: aparcamiento en línea.",
    ],
    cargaDescarga:
      "Desde el n.º 10 hasta el cruce con c/ Cueto Bajo, c/ La Guía y c/ Las Barqueras: zona de carga y descarga de 8:00 a 15:00 h (junto al edificio de Correos). Por la tarde, zona azul en línea.",
  },
  {
    nombre: "Calle Prolongación Las Barqueras",
    detalles: [
      "Zona semipeatonal. Aparcamientos en lado izquierdo.",
      "Aparcamiento en línea junto a edificio con negocios: peluquería Félix y Estanco n.º 2 (se excluye la plazoleta).",
      "Aparcamiento en línea desde el n.º 1 hasta el cruce con la c/ Marqués de Canillejas.",
    ],
  },
  {
    nombre: "Calle José Enrique Rozas Guijarro",
    detalles: [
      "Aparcamiento en lado izquierdo.",
      "En batería desde el n.º 1 hasta el cruce con la c/ Colegio de la Encarnación.",
    ],
    cargaDescarga:
      "Zona de carga y descarga a la altura del n.º 5 de 8:00 a 15:00 h. Por la tarde, zona azul.",
  },
  {
    nombre: "Calle Alfonso IX",
    detalles: [
      "Aparcamiento en lado izquierdo en línea.",
      "Frente a la oficina de la Policía Local: reserva de aparcamiento para vehículos oficiales.",
    ],
  },
  {
    nombre: "Calle Egidio Gavito",
    detalles: [
      "Dirección salida de la villa.",
      "Aparcamiento en lado izquierdo en batería, desde el n.º 3 al n.º 15.",
    ],
  },
  {
    nombre: "Calle Román Romano",
    detalles: [
      "Aparcamiento en lado derecho en línea desde el n.º 2 al n.º 4.",
      "Aparcamiento en lado izquierdo en batería en el n.º 1.",
      "Aparcamiento en línea en el lado izquierdo desde el n.º 3 al n.º 11.",
    ],
    cargaDescarga:
      "Zona de carga y descarga de 8:00 a 15:00 h a la altura del n.º 6 (junto al supermercado El Día). Por la tarde, zona azul en línea.",
  },
  {
    nombre: "Calle Hermanas Franciscanas del Hospital",
    detalles: [
      "Aparcamiento en batería en lado derecho entre el n.º 2 y n.º 6.",
      "Aparcamiento en línea al lado izquierdo a la altura del n.º 4.",
    ],
  },
  {
    nombre: "Calle Veneranda Manzano",
    detalles: [
      "Aparcamiento en lado derecho en batería, desde el cruce de c/ Hermanas Franciscanas del Hospital hasta el cruce con la c/ Román Romano.",
      "Reserva de 2 plazas para personas con movilidad reducida.",
    ],
  },
];

/* ─── Icon Components ─── */

function CarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17v1a1 1 0 001 1h1a1 1 0 001-1v-1m10 0v1a1 1 0 001 1h1a1 1 0 001-1v-1" />
      <circle cx="7.5" cy="13.5" r="1.5" />
      <circle cx="16.5" cy="13.5" r="1.5" />
    </svg>
  );
}

function ClockIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CalendarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function EuroIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h6M8 9h8M8 15h8" />
    </svg>
  );
}

function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function TruckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ChevronIcon({ open, className = "w-5 h-5" }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`${className} transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function AccessibleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a2 2 0 110 4 2 2 0 010-4zm4 8h-3V8a1 1 0 00-1-1H9a1 1 0 000 2h2v3.17l-2.55 4.25a1 1 0 101.71 1.04L12 14.46l1.84 3a1 1 0 101.71-1.04L13 12.17V11h3a1 1 0 000-2z" />
    </svg>
  );
}

/* ─── Street Card Component ─── */

function StreetCard({ calle, index }: { calle: Calle; index: number }) {
  const [open, setOpen] = useState(false);

  const hasAccessible = calle.detalles.some((d) =>
    d.toLowerCase().includes("movilidad reducida")
  );

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden transition-all duration-300 hover:shadow-md ${
        open ? "ring-2 ring-blue-200" : ""
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset cursor-pointer"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
          {index + 1}
        </span>
        <span className="flex-1 font-semibold text-gray-800 text-base leading-tight">
          {calle.nombre}
        </span>
        {hasAccessible && (
          <span className="text-blue-600" title="Plazas para personas con movilidad reducida">
            <AccessibleIcon className="w-5 h-5" />
          </span>
        )}
        <ChevronIcon open={open} className="w-5 h-5 text-blue-400 flex-shrink-0" />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 pt-0 border-t border-blue-50">
          <ul className="mt-3 space-y-2">
            {calle.detalles.map((detalle, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <span>{detalle}</span>
              </li>
            ))}
          </ul>

          {calle.cargaDescarga && (
            <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <TruckIcon className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">{calle.cargaDescarga}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ─── */

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-sky-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white" />
          <div className="absolute top-20 -left-10 w-60 h-60 rounded-full bg-white" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-white" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
            <span className="text-lg">🏛️</span>
            Ayuntamiento de Llanes
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Zona Azul de Aparcamiento
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 font-medium mb-2">
            Semana Santa 2026
          </p>
          <p className="text-blue-200 text-sm max-w-lg mx-auto">
            Regulación del estacionamiento en las calles de Llanes durante el
            periodo de Semana Santa
          </p>

          {/* Hero icon */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <CarIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 60V20C240 0 480 0 720 20C960 40 1200 40 1440 20V60H0Z"
              className="fill-blue-50"
            />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-16 -mt-2">

        {/* ── Digital Clock & Status ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Estado Actual</h2>
          </div>
          <DigitalClock />
        </section>

        {/* Key Info Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {/* Dates */}
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">Fechas</h3>
            <p className="text-sm text-gray-500 leading-snug">
              Viernes <span className="font-semibold text-gray-700">27 de marzo</span> al lunes{" "}
              <span className="font-semibold text-gray-700">6 de abril</span>
            </p>
            <span className="text-xs text-blue-500 mt-1">Ambos inclusive</span>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mb-3">
              <ClockIcon className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">Horario</h3>
            <p className="text-2xl font-bold text-gray-800">
              9:00 <span className="text-gray-400 text-lg">—</span> 20:00
            </p>
            <span className="text-xs text-sky-500 mt-1">De lunes a domingo</span>
          </div>

          {/* Tariff overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <EuroIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">Desde</h3>
            <p className="text-2xl font-bold text-gray-800">
              0,60 <span className="text-lg">€</span>
            </p>
            <span className="text-xs text-emerald-500 mt-1">Máximo 2 horas</span>
          </div>
        </section>

        {/* Tariff Table */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <EuroIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Tarifas de Aparcamiento</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-blue-100">
              {tarifas.map((t, i) => (
                <div
                  key={i}
                  className={`p-5 text-center ${
                    i === 2 ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">{t.precio}</p>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{t.duracion}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-blue-100 bg-blue-50/50 px-5 py-3">
              <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
                <ClockIcon className="w-3.5 h-3.5" />
                La tarifa empieza a computarse desde el primer minuto del
                estacionamiento
              </p>
            </div>
          </div>
        </section>

        {/* ── Map Section ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <MapPinIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Mapa de la Zona Azul</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Mapa interactivo con las 8 calles reguladas. Pulsa sobre las líneas
            o los marcadores para ver los detalles de cada calle.
          </p>
          <LlanesMap />
        </section>

        {/* Streets Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Detalle por Calles</h2>
          </div>
          <p className="text-sm text-gray-500 mb-5">
            Pulsa en cada calle para ver los detalles del aparcamiento regulado.
            Las vías son las mismas que en años anteriores.
          </p>

          <div className="space-y-3">
            {calles.map((calle, i) => (
              <StreetCard key={i} calle={calle} index={i} />
            ))}
          </div>
        </section>

        {/* Legend */}
        <section className="mt-10 bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
          <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Leyenda</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="w-3 h-3 rounded bg-blue-500 flex-shrink-0" />
              Zona azul – Aparcamiento regulado
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <TruckIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
              Carga y descarga (8:00–15:00 h)
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <AccessibleIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
              Plazas para movilidad reducida
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="w-3 h-3 rounded bg-gray-400 flex-shrink-0" />
              Vehículos oficiales
            </div>
          </div>
        </section>

        {/* Footer note */}
        <footer className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <span>🏛️</span>
            Ayuntamiento de Llanes
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Información sobre la regulación de aparcamiento en zona azul durante
            la Semana Santa
          </p>
        </footer>
      </main>
    </div>
  );
}
