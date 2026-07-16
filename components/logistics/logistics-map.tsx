"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cardClass, cardLabelClass, chartCategoryColors } from "@/styles/theme";
import type { Shipment } from "@/types/types";
import "leaflet/dist/leaflet.css";

type Coord = { lat: number; lon: number };
type ShipmentConCoord = Shipment & { coord: Coord };

const ESTADO_COLOR: Record<string, string> = {
    PENDIENTE: chartCategoryColors.amber,
    ASIGNADO: chartCategoryColors.cyan,
    RETIRADO: chartCategoryColors.orange,
    EN_CAMINO: chartCategoryColors.violet,
    ENTREGADO: chartCategoryColors.emerald,
};

const CACHE_KEY = "logistica_geocache_v1";
const MAP_CENTER: [number, number] = [-38.72, -62.27]; // Bahia Blanca aprox
const MAP_ZOOM = 5;
const MAX_MARKERS = 30;
const NOMINATIM_THROTTLE_MS = 1100; // respeta rate limit publico de Nominatim

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

function normalizar(dir: string): string {
    return dir.toLowerCase().includes("argentina") ? dir : `${dir}, Argentina`;
}

async function geocodificar(direccion: string): Promise<Coord | null> {
    const q = normalizar(direccion).replace(/'/g, "");
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
            { headers: { "Accept-Language": "es" } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return null;
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } catch {
        return null;
    }
}

function loadCache(): Record<string, Coord> {
    if (typeof window === "undefined") return {};
    try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveCache(cache: Record<string, Coord>) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // localStorage puede fallar (quota, privado); ignoramos
    }
}

type Props = {
    shipments: Shipment[] | null;
};

export default function LogisticsMap({ shipments }: Props) {
    // Render progresivo: los marcadores aparecen conforme se van resolviendo,
    // en vez de esperar a que se geocodifique el ultimo (~30s con 30 envios).
    // Los que ya estan en cache aparecen instantaneo en el primer render.
    const [resueltos, setResueltos] = useState<ShipmentConCoord[]>([]);
    const [totalAResolver, setTotalAResolver] = useState(0);
    const [progreso, setProgreso] = useState(0);

    useEffect(() => {
        if (!shipments || shipments.length === 0) return;

        const cancelled = { current: false };
        const seleccionados = shipments.slice(0, MAX_MARKERS);
        const cache = loadCache();

        // Direcciones unicas para geocodificar solo una vez por direccion.
        const directsMap = new Map<string, Shipment[]>();
        for (const s of seleccionados) {
            const key = s.direccion.trim().toLowerCase();
            if (!directsMap.has(key)) directsMap.set(key, []);
            directsMap.get(key)!.push(s);
        }

        // Split: los que YA estan en cache se renderizan de una; los que faltan
        // se van resolviendo con throttle y se agregan uno a uno.
        const yaCacheados: ShipmentConCoord[] = [];
        const faltantes: [string, Shipment[]][] = [];
        for (const [key, grupo] of directsMap) {
            const coord = cache[key];
            if (coord) {
                for (const s of grupo) yaCacheados.push({ ...s, coord });
            } else {
                faltantes.push([key, grupo]);
            }
        }

        setResueltos(yaCacheados);
        setTotalAResolver(faltantes.length);
        setProgreso(0);

        (async () => {
            for (let i = 0; i < faltantes.length; i++) {
                if (cancelled.current) return;
                const [, grupo] = faltantes[i];
                const primera = grupo[0];
                const key = primera.direccion.trim().toLowerCase();
                const geo = await geocodificar(primera.direccion);
                if (cancelled.current) return;
                if (geo) {
                    cache[key] = geo;
                    const nuevos = grupo.map((s) => ({ ...s, coord: geo }));
                    setResueltos((prev) => [...prev, ...nuevos]);
                }
                setProgreso(i + 1);
                if (i < faltantes.length - 1) {
                    await new Promise((r) => setTimeout(r, NOMINATIM_THROTTLE_MS));
                }
            }
            if (!cancelled.current) saveCache(cache);
        })();

        return () => {
            cancelled.current = true;
        };
    }, [shipments]);

    if (!shipments || shipments.length === 0) return null;

    const geocodificando = totalAResolver > 0 && progreso < totalAResolver;
    const restantes = totalAResolver - progreso;

    return (
        <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
                <h2 className={cardLabelClass}>
                    Mapa de envíos (hasta {MAX_MARKERS} más recientes)
                </h2>
                {geocodificando && (
                    <span className="text-xs font-mono text-zinc-500">
                        Cargando {restantes} {restantes === 1 ? "dirección" : "direcciones"}...
                    </span>
                )}
            </div>

            <div className="h-96 w-full rounded overflow-hidden">
                <MapContainer
                    center={MAP_CENTER}
                    zoom={MAP_ZOOM}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap"
                    />
                    {resueltos.map((s) => (
                        <CircleMarker
                            key={s.id}
                            center={[s.coord.lat, s.coord.lon]}
                            radius={8}
                            pathOptions={{
                                color: ESTADO_COLOR[s.estado] ?? "#a1a1aa",
                                fillColor: ESTADO_COLOR[s.estado] ?? "#a1a1aa",
                                fillOpacity: 0.7,
                                weight: 2,
                            }}
                        >
                            <Popup>
                                <div className="text-xs font-mono space-y-1">
                                    <div>
                                        <span className="text-zinc-500">Envío:</span>{" "}
                                        <span className="font-semibold text-zinc-100">{s.id.slice(-8)}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">Pedido:</span>{" "}
                                        <span className="text-zinc-200">{s.pedido_id.slice(-8)}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">Estado:</span>{" "}
                                        <span style={{ color: ESTADO_COLOR[s.estado] ?? "#a1a1aa" }}>{s.estado}</span>
                                    </div>
                                    <div className="text-zinc-200">{s.direccion}</div>
                                    <div className="text-zinc-200">${s.monto.toLocaleString("es-AR")}</div>
                                    {s.operador && (
                                        <div>
                                            <span className="text-zinc-500">Operador:</span>{" "}
                                            <span className="text-zinc-200">{s.operador.nombre}</span>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>

            {!geocodificando && totalAResolver > 0 && resueltos.length < shipments.length && (
                <p className="text-xs text-zinc-500 mt-2 font-mono">
                    Mostrando {resueltos.length} de {shipments.length} envíos en el mapa.
                    Direcciones que no pudieron geocodificarse quedaron fuera.
                </p>
            )}
        </div>
    );
}
