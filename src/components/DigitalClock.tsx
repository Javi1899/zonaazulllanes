import { useState, useEffect } from "react";

const ZONE_START_HOUR = 9;
const ZONE_END_HOUR = 20;
const SEASON_START = new Date(2026, 2, 27); // 27 March 2026
const SEASON_END = new Date(2026, 3, 6, 23, 59, 59); // 6 April 2026

type Status = "active" | "soon" | "off-hours" | "off-season";

function getStatus(now: Date): { status: Status; message: string; subMessage: string } {
  const hour = now.getHours();
  const minutes = now.getMinutes();

  // Check if within season
  if (now < SEASON_START || now > SEASON_END) {
    const diffMs = SEASON_START.getTime() - now.getTime();
    if (diffMs > 0 && diffMs < 30 * 24 * 60 * 60 * 1000) {
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        status: "off-season",
        message: "Zona azul inactiva",
        subMessage: `Comienza en ${days} día${days !== 1 ? "s" : ""} (27 de marzo)`,
      };
    }
    return {
      status: "off-season",
      message: "Zona azul inactiva",
      subMessage: "Fuera del periodo de Semana Santa (27 mar – 6 abr)",
    };
  }

  // Within season - check hours
  const currentMinutes = hour * 60 + minutes;
  const startMinutes = ZONE_START_HOUR * 60;
  const endMinutes = ZONE_END_HOUR * 60;

  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    const remainingMinutes = endMinutes - currentMinutes;
    const rh = Math.floor(remainingMinutes / 60);
    const rm = remainingMinutes % 60;
    return {
      status: "active",
      message: "🟢 Zona azul ACTIVA",
      subMessage: `Finaliza a las 20:00 h · Quedan ${rh}h ${rm.toString().padStart(2, "0")}min`,
    };
  }

  // Before opening today
  if (currentMinutes < startMinutes) {
    const minsUntil = startMinutes - currentMinutes;
    if (minsUntil <= 60) {
      const rh = Math.floor(minsUntil / 60);
      const rm = minsUntil % 60;
      return {
        status: "soon",
        message: "⏳ Zona azul próximamente",
        subMessage: `Comienza en ${rh > 0 ? rh + "h " : ""}${rm}min (a las 9:00 h)`,
      };
    }
    return {
      status: "off-hours",
      message: "Zona azul inactiva",
      subMessage: "Comienza a las 9:00 h",
    };
  }

  // After closing
  return {
    status: "off-hours",
    message: "Zona azul inactiva",
    subMessage: "Reanudación mañana a las 9:00 h",
  };
}

export default function DigitalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { status, message, subMessage } = getStatus(now);

  const hours = now.getHours().toString().padStart(2, "0");
  const mins = now.getMinutes().toString().padStart(2, "0");
  const secs = now.getSeconds().toString().padStart(2, "0");

  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()} de ${monthNames[now.getMonth()]} de ${now.getFullYear()}`;

  const borderColor =
    status === "active"
      ? "border-green-400"
      : status === "soon"
      ? "border-amber-400"
      : "border-gray-300";

  const bgGlow =
    status === "active"
      ? "shadow-green-100"
      : status === "soon"
      ? "shadow-amber-100"
      : "shadow-gray-100";

  const statusBg =
    status === "active"
      ? "bg-green-50 text-green-700"
      : status === "soon"
      ? "bg-amber-50 text-amber-700"
      : "bg-gray-100 text-gray-500";

  const colonBlink = now.getSeconds() % 2 === 0 ? "opacity-100" : "opacity-30";

  return (
    <div className={`bg-white rounded-2xl shadow-lg ${bgGlow} border-2 ${borderColor} p-5 sm:p-6 transition-all duration-500`}>
      {/* Date */}
      <p className="text-center text-sm text-gray-400 font-medium mb-3">{dateStr}</p>

      {/* Digital Clock */}
      <div className="flex items-center justify-center gap-1">
        <div className="flex items-baseline">
          <span className="text-5xl sm:text-6xl font-mono font-bold text-gray-800 tabular-nums tracking-tight">{hours}</span>
          <span className={`text-5xl sm:text-6xl font-mono font-bold text-blue-500 mx-0.5 transition-opacity duration-300 ${colonBlink}`}>:</span>
          <span className="text-5xl sm:text-6xl font-mono font-bold text-gray-800 tabular-nums tracking-tight">{mins}</span>
          <span className={`text-3xl sm:text-4xl font-mono font-bold text-blue-400 mx-0.5 transition-opacity duration-300 ${colonBlink}`}>:</span>
          <span className="text-3xl sm:text-4xl font-mono font-bold text-gray-400 tabular-nums tracking-tight">{secs}</span>
        </div>
      </div>

      {/* Progress bar for active hours */}
      {status === "active" && (
        <div className="mt-4 mx-auto max-w-xs">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>9:00</span>
            <span>20:00</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, ((now.getHours() * 60 + now.getMinutes() - ZONE_START_HOUR * 60) / ((ZONE_END_HOUR - ZONE_START_HOUR) * 60)) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Status badge */}
      <div className={`mt-4 rounded-xl px-4 py-3 text-center ${statusBg}`}>
        <p className="font-bold text-base">{message}</p>
        <p className="text-sm mt-0.5 opacity-80">{subMessage}</p>
      </div>
    </div>
  );
}
