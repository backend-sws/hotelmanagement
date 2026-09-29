import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Building2, 
  Compass, 
  Maximize2, 
  Navigation, 
  Radio, 
  RotateCcw, 
  Users, 
  ExternalLink,
  Phone,
  Battery,
  Layers,
  MapPin,
  CheckCircle2,
  Clock,
  MessageCircle
} from 'lucide-react';
import type { RadarBase, RadarTechnician, RouteTrailResponse } from '../api/useRadar';

interface RadarMapViewProps {
  base: RadarBase;
  technicians: RadarTechnician[];
  selectedTechId: number | null;
  onSelectTech: (id: number | null) => void;
  routeTrail?: RouteTrailResponse | null;
  isRouteLoading?: boolean;
  isDark?: boolean;
}

type MapTileProvider = 'dark' | 'streets' | 'satellite';

export default function RadarMapView({
  base,
  technicians,
  selectedTechId,
  onSelectTech,
  routeTrail,
  isRouteLoading = false,
  isDark = true,
}: RadarMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const baseLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const techLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  const [tileProvider, setTileProvider] = useState<MapTileProvider>(isDark ? 'dark' : 'streets');

  // 100% Free Tile Providers (Zero API Key & Zero Watermark Required)
  const tileConfig: Record<MapTileProvider, { url: string; attribution: string; maxZoom: number; className?: string; subdomains?: string[] }> = {
    dark: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: 'dark-osm-tiles',
      subdomains: ['a', 'b', 'c'],
    },
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: '',
      subdomains: ['a', 'b', 'c'],
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri, Earthstar Geographics',
      maxZoom: 18,
      className: '',
    },
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = base.lat || 19.0760;
    const initialLng = base.lng || 72.8777;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false, // We'll render custom tactical controls
      attributionControl: false,
    });

    // Custom attribution in bottom-right with minimal styling
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    // Initial Tile Layer
    const activeTile = tileConfig[tileProvider];
    tileLayerRef.current = L.tileLayer(activeTile.url, {
      attribution: activeTile.attribution,
      maxZoom: activeTile.maxZoom,
      className: activeTile.className || '',
      subdomains: activeTile.subdomains || ['a', 'b', 'c'],
    }).addTo(map);

    // Layer Groups
    baseLayerGroupRef.current = L.layerGroup().addTo(map);
    techLayerGroupRef.current = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Update Tile Layer on tileProvider change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const activeTile = tileConfig[tileProvider];
    tileLayerRef.current = L.tileLayer(activeTile.url, {
      attribution: activeTile.attribution,
      maxZoom: activeTile.maxZoom,
      className: activeTile.className || '',
      subdomains: activeTile.subdomains || ['a', 'b', 'c'],
    }).addTo(mapInstanceRef.current);
  }, [tileProvider]);

  // 3. Render Base HQ Marker & Geofence Circle
  useEffect(() => {
    if (!baseLayerGroupRef.current || !mapInstanceRef.current) return;
    baseLayerGroupRef.current.clearLayers();

    const baseLat = base.lat || 19.0760;
    const baseLng = base.lng || 72.8777;
    const radiusMeters = base.radius_meters || 2000;

    // Base Geofence Circle
    const circle = L.circle([baseLat, baseLng], {
      radius: radiusMeters,
      color: '#6366f1',
      fillColor: '#6366f1',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '6, 6',
    });
    baseLayerGroupRef.current.addLayer(circle);

    // Base HQ Custom Marker Icon
    const hqIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 rounded-full bg-indigo-500/20 animate-ping"></div>
        <div class="relative w-10 h-10 rounded-2xl bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
            <path d="M10 6h4"/>
            <path d="M10 10h4"/>
            <path d="M10 14h4"/>
            <path d="M10 18h4"/>
          </svg>
        </div>
        <div class="absolute -bottom-6 px-2 py-0.5 rounded-full bg-indigo-950/90 border border-indigo-500/30 text-[10px] font-bold text-indigo-300 whitespace-nowrap shadow-md">
          ${base.name || 'HQ Base'}
        </div>
      </div>
    `;

    const hqDivIcon = L.divIcon({
      html: hqIconHtml,
      className: 'custom-hq-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const hqMarker = L.marker([baseLat, baseLng], { icon: hqDivIcon });
    hqMarker.bindPopup(`
      <div class="p-2 font-sans text-xs">
        <div class="font-bold text-slate-900 mb-0.5">${base.name}</div>
        <div class="text-slate-500 text-[11px] mb-2">Central Operations HQ & Geofence Hub</div>
        <div class="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px] text-slate-600">
          <span>Geofence Radius:</span>
          <span class="font-bold text-indigo-600">${radiusMeters} meters</span>
        </div>
      </div>
    `);
    baseLayerGroupRef.current.addLayer(hqMarker);
  }, [base]);

  // 4. Render Technician Markers
  useEffect(() => {
    if (!techLayerGroupRef.current || !mapInstanceRef.current) return;
    techLayerGroupRef.current.clearLayers();
    markersRef.current.clear();

    technicians.forEach(tech => {
      if (tech.lat === null || tech.lng === null) return;

      const isSelected = selectedTechId === tech.id;
      const statusColor = {
        active: { bg: '#10b981', border: '#34d399', ping: 'bg-emerald-500/30', label: 'Active / Online' },
        in_transit: { bg: '#0ea5e9', border: '#38bdf8', ping: 'bg-sky-500/30', label: 'In Transit' },
        reached_site: { bg: '#f59e0b', border: '#fbbf24', ping: 'bg-amber-500/30', label: 'At Client Site' },
        off_duty: { bg: '#64748b', border: '#94a3b8', ping: '', label: 'Off Duty' },
      }[tech.status] || { bg: '#64748b', border: '#94a3b8', ping: '', label: tech.status };

      const cleanPhone = tech.phone.replace(/[^0-9]/g, '');
      const initials = tech.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 ${isSelected ? 'scale-110' : ''}">
          ${tech.status !== 'off_duty' ? `<div class="absolute w-12 h-12 rounded-full ${statusColor.ping} animate-ping"></div>` : ''}
          <div class="relative w-9 h-9 rounded-full shadow-lg border-2 flex items-center justify-center font-black text-xs text-white" 
               style="background-color: ${statusColor.bg}; border-color: ${isSelected ? '#ffffff' : statusColor.border};">
            ${initials}
          </div>
          <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-white/30 flex items-center justify-center text-[9px] font-bold text-white">
            ${tech.battery_level ? `${tech.battery_level}%` : '⚡'}
          </div>
          <div class="absolute -bottom-5 px-1.5 py-0.2 rounded-md bg-slate-900/90 border border-white/10 text-[9px] font-semibold text-white whitespace-nowrap shadow-sm">
            ${tech.name.split(' ')[0]}
          </div>
        </div>
      `;

      const customDivIcon = L.divIcon({
        html: markerHtml,
        className: `tech-marker-${tech.id}`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([tech.lat, tech.lng], { icon: customDivIcon });

      // Rich Interactive Popup
      const popupHtml = `
        <div class="p-3 font-sans max-w-[240px] text-xs">
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-bold text-slate-900 text-sm">${tech.name}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase" style="background-color: ${statusColor.bg}20; color: ${statusColor.bg};">
              ${statusColor.label}
            </span>
          </div>

          <div class="space-y-1.5 py-2 border-y border-slate-100 text-slate-600 text-[11px]">
            <div class="flex items-center justify-between">
              <span>Distance to HQ:</span>
              <span class="font-semibold text-slate-900">${tech.distance_from_base ? `${tech.distance_from_base} km` : 'Near Base'}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Battery Level:</span>
              <span class="font-semibold ${tech.battery_level < 20 ? 'text-rose-500' : 'text-emerald-600'}">${tech.battery_level}%</span>
            </div>
            ${tech.current_task ? `
              <div class="p-1.5 rounded-lg bg-slate-50 border border-slate-100 mt-1">
                <div class="text-[10px] font-bold text-slate-500">ACTIVE TASK:</div>
                <div class="font-semibold text-slate-900 truncate">${tech.current_task.title}</div>
                <div class="text-[10px] text-slate-500 truncate">${tech.current_task.site_name}</div>
              </div>
            ` : ''}
          </div>

          <div class="grid grid-cols-2 gap-2 mt-2.5">
            <a href="tel:${tech.phone}" class="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call
            </a>
            <a href="https://wa.me/${cleanPhone}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              Chat
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectTech(tech.id);
      });

      techLayerGroupRef.current?.addLayer(marker);
      markersRef.current.set(tech.id, marker);
    });
  }, [technicians, selectedTechId]);

  // 5. Handle Route Trail Polyline
  useEffect(() => {
    if (!routeLayerGroupRef.current || !mapInstanceRef.current) return;
    routeLayerGroupRef.current.clearLayers();

    if (!routeTrail || !routeTrail.waypoints || routeTrail.waypoints.length < 2) return;

    const latLngs: L.LatLngExpression[] = routeTrail.waypoints.map(wp => [wp.lat, wp.lng]);

    // Draw GPS Breadcrumbs Polyline
    const polyline = L.polyline(latLngs, {
      color: '#06b6d4',
      weight: 4,
      opacity: 0.85,
      dashArray: '4, 8',
    });
    routeLayerGroupRef.current.addLayer(polyline);

    // Add Start Pin
    const startWp = routeTrail.waypoints[0];
    const startIcon = L.divIcon({
      html: `<div class="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-md"></div>`,
      className: 'route-start-pin',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    const startMarker = L.marker([startWp.lat, startWp.lng], { icon: startIcon });
    startMarker.bindTooltip(`Route Start: ${startWp.site_name || 'Origin'}`);
    routeLayerGroupRef.current.addLayer(startMarker);

    // Add End Pin
    const endWp = routeTrail.waypoints[routeTrail.waypoints.length - 1];
    const endIcon = L.divIcon({
      html: `<div class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-md animate-pulse"></div>`,
      className: 'route-end-pin',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    const endMarker = L.marker([endWp.lat, endWp.lng], { icon: endIcon });
    endMarker.bindTooltip(`Latest Position: ${routeTrail.total_km} km total`);
    routeLayerGroupRef.current.addLayer(endMarker);
  }, [routeTrail]);

  // 6. Smooth Pan / Fly to Selected Technician
  useEffect(() => {
    if (!selectedTechId || !mapInstanceRef.current) return;
    const selectedTech = technicians.find(t => t.id === selectedTechId);
    if (!selectedTech || selectedTech.lat === null || selectedTech.lng === null) return;

    mapInstanceRef.current.flyTo([selectedTech.lat, selectedTech.lng], 16, {
      duration: 1.2,
    });

    const marker = markersRef.current.get(selectedTechId);
    if (marker) {
      marker.openPopup();
    }
  }, [selectedTechId, technicians]);

  // Actions
  const handleRecenterBase = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([base.lat || 19.0760, base.lng || 72.8777], 14, { duration: 1 });
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current) return;
    const validCoords: L.LatLngExpression[] = [];
    if (base.lat && base.lng) validCoords.push([base.lat, base.lng]);
    technicians.forEach(t => {
      if (t.lat !== null && t.lng !== null) validCoords.push([t.lat, t.lng]);
    });

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  };

  const cycleTileProvider = () => {
    setTileProvider(prev => (prev === 'dark' ? 'streets' : prev === 'streets' ? 'satellite' : 'dark'));
  };

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
      <style>{`
        .leaflet-container {
          background-color: #0b0f19 !important;
        }
        .dark-osm-tiles .leaflet-tile {
          filter: invert(100%) hue-rotate(180deg) brightness(88%) contrast(92%) saturate(85%) !important;
        }
      `}</style>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[550px] z-0" />

      {/* Floating Tactical Overlay Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        {/* Recenter Base */}
        <button
          type="button"
          onClick={handleRecenterBase}
          title="Center on Base HQ"
          className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95"
        >
          <Building2 className="w-4 h-4 text-indigo-500" />
        </button>

        {/* Fit All Staff */}
        <button
          type="button"
          onClick={handleFitAll}
          title="Fit All Staff & Base"
          className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95"
        >
          <Users className="w-4 h-4 text-emerald-500" />
        </button>

        {/* Cycle Map Style */}
        <button
          type="button"
          onClick={cycleTileProvider}
          title={`Switch Map Style (Current: ${tileProvider.toUpperCase()})`}
          className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95"
        >
          <Layers className="w-4 h-4 text-sky-500" />
        </button>
      </div>

      {/* Selected Route Trail Legend Banner (Top Left) */}
      {selectedTechId && routeTrail && (
        <div className="absolute top-4 left-4 z-[400] px-3.5 py-2 rounded-xl bg-slate-900/90 dark:bg-black/90 backdrop-blur-md border border-cyan-500/30 text-white shadow-xl flex items-center gap-3 animate-fadeIn">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Route Trail Loaded</div>
            <div className="text-xs font-semibold text-slate-200">
              {routeTrail.total_km} km &bull; {routeTrail.waypoints.length} GPS Waypoints
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectTech(null)}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Floating Status Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[400] px-3 py-2 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl hidden sm:flex items-center gap-4 text-[11px] font-medium text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm"></span>
          <span>In Transit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></span>
          <span>At Site</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-sm"></span>
          <span>Off Duty</span>
        </div>
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-white/10">
          <span className="w-3 h-0.5 border-b-2 border-dashed border-indigo-500"></span>
          <span>Geofence ({base.radius_meters}m)</span>
        </div>
      </div>
    </div>
  );
}
