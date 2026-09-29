import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  MapPin, 
  Battery, 
  BatteryCharging, 
  Phone, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Maximize2,
  Minimize2,
  Compass,
  ArrowUpRight,
  User,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Map as MapIcon,
  Layers
} from 'lucide-react';
import { useLiveRadar, useRouteTrail, type RadarTechnician } from '../api/useRadar';
import RadarMapView from '../components/RadarMapView';

export default function LiveRadarPage() {
  const { data, isLoading, refetch, isFetching } = useLiveRadar();
  const [selectedTechId, setSelectedTechId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in_transit' | 'reached_site' | 'off_duty'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [radarZoomRangeKm, setRadarZoomRangeKm] = useState<number>(15); // radar radius in KM
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'hud'>('map');

  // Selected route trail query
  const { data: routeTrailData, isLoading: isRouteLoading } = useRouteTrail(selectedTechId);

  const base = data?.base || {
    name: 'Headquarters Base',
    lat: 19.0760,
    lng: 72.8777,
    radius_meters: 5000,
  };

  const technicians = useMemo(() => data?.technicians || [], [data]);
  const summary = data?.summary || { total: 0, active: 0, in_transit: 0, on_site: 0, off_duty: 0 };

  // Filtered technicians list
  const filteredTechnicians = useMemo(() => {
    return technicians.filter(tech => {
      const matchStatus = statusFilter === 'all' || tech.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || tech.name.toLowerCase().includes(q) || tech.phone.includes(q);
      return matchStatus && matchSearch;
    });
  }, [technicians, statusFilter, searchQuery]);

  // Selected technician object
  const selectedTech = useMemo(() => {
    return technicians.find(t => t.id === selectedTechId) || null;
  }, [technicians, selectedTechId]);

  // Map / Radar Canvas dimensions
  const SVG_SIZE = 600;
  const CENTER = SVG_SIZE / 2;

  // Convert GPS (lat, lng) to SVG (x, y) relative to Base HQ using Equirectangular approximation
  const projectCoordinates = (lat: number | null, lng: number | null): { x: number; y: number; kmDist: number } | null => {
    if (lat === null || lng === null) return null;
    const latDiffKm = (lat - base.lat) * 111.32;
    const cosBaseLat = Math.cos((base.lat * Math.PI) / 180);
    const lngDiffKm = (lng - base.lng) * 111.32 * cosBaseLat;
    const kmDist = Math.sqrt(latDiffKm * latDiffKm + lngDiffKm * lngDiffKm);

    // Scale factor: radarZoomRangeKm maps to (CENTER - 40) pixels
    const pixelsPerKm = (CENTER - 50) / radarZoomRangeKm;

    // In SVG: +x is East (+lngDiff), -y is North (+latDiff)
    const x = CENTER + lngDiffKm * pixelsPerKm;
    const y = CENTER - latDiffKm * pixelsPerKm;

    return { x, y, kmDist };
  };

  // Concentric radar ring radii in KM
  const ringDistances = useMemo(() => {
    const r = radarZoomRangeKm;
    return [r * 0.25, r * 0.5, r * 0.75, r].map(v => Math.round(v * 10) / 10);
  }, [radarZoomRangeKm]);

  // Projected route waypoints for selected technician
  const routeWaypoints = useMemo(() => {
    if (!routeTrailData?.waypoints) return [];
    return routeTrailData.waypoints.map(wp => {
      const coords = projectCoordinates(wp.lat, wp.lng);
      return {
        ...wp,
        coords,
      };
    }).filter(wp => wp.coords !== null);
  }, [routeTrailData, base.lat, base.lng, radarZoomRangeKm]);

  // SVG path data string for route trail
  const routePathString = useMemo(() => {
    if (routeWaypoints.length < 2) return '';
    return routeWaypoints.reduce((acc, wp, idx) => {
      if (idx === 0) return `M ${wp.coords!.x} ${wp.coords!.y}`;
      return `${acc} L ${wp.coords!.x} ${wp.coords!.y}`;
    }, '');
  }, [routeWaypoints]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return {
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          glow: 'rgba(16, 185, 129, 0.4)',
          text: 'Active / Online',
        };
      case 'in_transit':
        return {
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dot: 'bg-cyan-400',
          glow: 'rgba(6, 182, 212, 0.4)',
          text: 'In Transit',
        };
      case 'reached_site':
        return {
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          dot: 'bg-purple-400',
          glow: 'rgba(168, 85, 247, 0.4)',
          text: 'On Site',
        };
      default:
        return {
          badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          dot: 'bg-slate-500',
          glow: 'rgba(100, 116, 139, 0.2)',
          text: 'Off Duty',
        };
    }
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 ${isFullscreen ? 'fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto' : 'max-w-7xl mx-auto'}`}>
      {/* Top Operations Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Live Operations Radar
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live 15s Polling
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Base HQ: <span className="text-slate-800 dark:text-slate-300 font-semibold">{base.name}</span> ({base.lat.toFixed(4)}, {base.lng.toFixed(4)})
              </p>
            </div>
          </div>
        </div>

        {/* Controls & Quick Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Zoom Radius Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Scope:</span>
            {[5, 15, 30, 60].map((km) => (
              <button
                key={km}
                onClick={() => setRadarZoomRangeKm(km)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                  radarZoomRangeKm === km
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {km}km
              </button>
            ))}
          </div>

          {/* View Mode Switcher: Street Map vs Tactical HUD */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Street Map
            </button>
            <button
              type="button"
              onClick={() => setViewMode('hud')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'hud'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Tactical HUD
            </button>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
            title="Refresh positions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-cyan-500' : ''}`} />
            Sync
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Command Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Metric Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-white dark:bg-slate-800/90 border-cyan-500 shadow-sm ring-1 ring-cyan-500/30'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm'
          }`}
        >
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Crew</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{summary.total}</div>
        </button>

        <button
          onClick={() => setStatusFilter('active')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'active'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm'
          }`}
        >
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active Online
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{summary.active}</div>
        </button>

        <button
          onClick={() => setStatusFilter('in_transit')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'in_transit'
              ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 shadow-sm ring-1 ring-cyan-500/30'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm'
          }`}
        >
          <div className="text-xs text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500" /> In Transit
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{summary.in_transit}</div>
        </button>

        <button
          onClick={() => setStatusFilter('reached_site')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'reached_site'
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-sm ring-1 ring-purple-500/30'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm'
          }`}
        >
          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> On Site
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{summary.on_site}</div>
        </button>

        <button
          onClick={() => setStatusFilter('off_duty')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'off_duty'
              ? 'bg-slate-100 dark:bg-slate-800/90 border-slate-400 dark:border-slate-600 shadow-sm ring-1 ring-slate-400'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm'
          }`}
        >
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Off Duty
          </div>
          <div className="text-xl font-bold text-slate-600 dark:text-slate-400 mt-0.5">{summary.off_duty}</div>
        </button>
      </div>

      {/* Main Grid: Radar Screen (Left/Center) + Command Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Radar Map Canvas Container (Col 8) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm flex flex-col">
          {viewMode === 'map' ? (
            <div className="w-full h-[620px]">
              <RadarMapView
                base={base}
                technicians={filteredTechnicians}
                selectedTechId={selectedTechId}
                onSelectTech={setSelectedTechId}
                routeTrail={routeTrailData}
                isRouteLoading={isRouteLoading}
                isDark={true}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Radar HUD Overlay Header */}
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
                SYS::RADAR_GRID_V2
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                RANGE: {radarZoomRangeKm} KM
              </span>
            </div>
            {selectedTech && (
              <button
                onClick={() => setSelectedTechId(null)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs transition-all font-medium"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Radar Screen Visual */}
          <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center bg-[#070b14] rounded-full border border-cyan-500/20 shadow-inner overflow-hidden my-2">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-cyan-950/20 via-slate-950 to-slate-950 rounded-full pointer-events-none" />

            <svg
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.15))' }}
            >
              <defs>
                {/* Radar Sweep Gradient */}
                <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>

                {/* HQ Beacon Pattern */}
                <radialGradient id="hqBeaconGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Polar Radar Range Circles */}
              {ringDistances.map((km, idx) => {
                const radiusPixels = ((CENTER - 50) / radarZoomRangeKm) * km;
                return (
                  <g key={km}>
                    <circle
                      cx={CENTER}
                      cy={CENTER}
                      r={radiusPixels}
                      fill="none"
                      stroke={idx === ringDistances.length - 1 ? '#0e7490' : '#1e293b'}
                      strokeWidth={idx === ringDistances.length - 1 ? '1.5' : '1'}
                      strokeDasharray={idx === ringDistances.length - 1 ? 'none' : '4 4'}
                      opacity="0.7"
                    />
                    {/* Range Km Label */}
                    <text
                      x={CENTER + 8}
                      y={CENTER - radiusPixels + 14}
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {km}km
                    </text>
                  </g>
                );
              })}

              {/* Cardinal Crosshairs */}
              <line x1={CENTER} y1="30" x2={CENTER} y2={SVG_SIZE - 30} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1={CENTER} x2={SVG_SIZE - 30} y2={CENTER} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

              {/* Diagonal 45deg guidelines */}
              <line x1="70" y1="70" x2={SVG_SIZE - 70} y2={SVG_SIZE - 70} stroke="#0f172a" strokeWidth="1" />
              <line x1={SVG_SIZE - 70} y1="70" x2="70" y2={SVG_SIZE - 70} stroke="#0f172a" strokeWidth="1" />

              {/* Cardinal Directions Labels */}
              <text x={CENTER - 5} y="22" fill="#06b6d4" fontSize="12" fontWeight="bold" fontFamily="monospace">N</text>
              <text x={SVG_SIZE - 20} y={CENTER + 4} fill="#64748b" fontSize="12" fontWeight="bold" fontFamily="monospace">E</text>
              <text x={CENTER - 5} y={SVG_SIZE - 10} fill="#64748b" fontSize="12" fontWeight="bold" fontFamily="monospace">S</text>
              <text x="10" y={CENTER + 4} fill="#64748b" fontSize="12" fontWeight="bold" fontFamily="monospace">W</text>

              {/* Animated Radar Sweep Needle */}
              <g transform={`rotate(0 ${CENTER} ${CENTER})`}>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${CENTER} ${CENTER}`}
                  to={`360 ${CENTER} ${CENTER}`}
                  dur="6s"
                  repeatCount="indefinite"
                />
                {/* Sector cone */}
                <path
                  d={`M ${CENTER} ${CENTER} L ${CENTER} 50 A ${CENTER - 50} ${CENTER - 50} 0 0 1 ${CENTER + (CENTER - 50) * Math.sin(Math.PI / 6)} ${CENTER - (CENTER - 50) * Math.cos(Math.PI / 6)} Z`}
                  fill="url(#radarSweep)"
                  opacity="0.35"
                />
                <line x1={CENTER} y1={CENTER} x2={CENTER} y2="50" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8" />
              </g>

              {/* Selected Technician Route Trail Line */}
              {routePathString && (
                <path
                  d={routePathString}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  opacity="0.8"
                />
              )}

              {/* Route Waypoint Nodes */}
              {routeWaypoints.map((wp) => (
                <g key={wp.order} transform={`translate(${wp.coords!.x}, ${wp.coords!.y})`}>
                  <circle r="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {wp.order}
                  </text>
                  <text
                    x="10"
                    y="-5"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="sans-serif"
                    className="pointer-events-none"
                  >
                    {wp.site_name}
                  </text>
                </g>
              ))}

              {/* Center Base HQ Beacon */}
              <g transform={`translate(${CENTER}, ${CENTER})`}>
                <circle r="22" fill="url(#hqBeaconGlow)" />
                <circle r="8" fill="#0891b2" stroke="#67e8f9" strokeWidth="2" />
                <circle r="3" fill="#ffffff" />
                <text
                  x="0"
                  y="-14"
                  textAnchor="middle"
                  fill="#67e8f9"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  HQ BASE
                </text>
              </g>

              {/* Plotted Field Technicians */}
              {filteredTechnicians.map((tech) => {
                const pos = projectCoordinates(tech.lat, tech.lng);
                if (!pos) return null;

                // Bound markers within visible circular area
                const isSelected = selectedTechId === tech.id;
                const statusMeta = getStatusColor(tech.status);

                return (
                  <g
                    key={tech.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer transition-transform duration-300 hover:scale-125"
                    onClick={() => setSelectedTechId(tech.id)}
                  >
                    {/* Outer Ping Ring for Active/Transit */}
                    {tech.status !== 'off_duty' && (
                      <circle
                        r="16"
                        fill="none"
                        stroke={statusMeta.dot.replace('bg-', '')}
                        strokeWidth="1.5"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="r"
                          values="8;24"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8;0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Selected Halo Ring */}
                    {isSelected && (
                      <circle
                        r="18"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeDasharray="3 2"
                      />
                    )}

                    {/* Marker Dot */}
                    <circle
                      r="9"
                      fill={tech.status === 'active' ? '#10b981' : tech.status === 'in_transit' ? '#06b6d4' : tech.status === 'reached_site' ? '#a855f7' : '#64748b'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Tech Name Tooltip Tag */}
                    <rect
                      x="12"
                      y="-12"
                      width={tech.name.length * 6.5 + 16}
                      height="20"
                      rx="4"
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    <text
                      x="20"
                      y="2"
                      fill="#f8fafc"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {tech.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

            {/* Radar Legend Footer */}
            <div className="w-full mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> Active Online
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm" /> In Transit
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" /> On Site
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 shadow-sm" /> Off Duty
                </span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">
                Click any blip to inspect live stats & breadcrumbs
              </span>
            </div>
          </div>
        )}
      </div>

        {/* Right Sidebar: Tech Inspector + Crew List (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Technician Card (or Empty State) */}
          {selectedTech ? (
            <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {selectedTech.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedTech.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTech.phone}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-[10px] font-semibold border ${getStatusColor(selectedTech.status).badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(selectedTech.status).dot}`} />
                      {getStatusColor(selectedTech.status).text}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${selectedTech.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-emerald-50 dark:bg-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40 rounded-xl transition-all shadow-sm"
                  title="Direct WhatsApp Message"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Quick Telemetry Pill Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                    <Compass className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> Distance from Base
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold mt-0.5">
                    {selectedTech.distance_from_base !== null ? `${selectedTech.distance_from_base.toFixed(2)} KM` : 'Unknown'}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Phone Battery
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold mt-0.5">
                    {selectedTech.battery_level}%
                  </div>
                </div>
              </div>

              {/* Current Active Task */}
              {selectedTech.current_task ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <div className="text-[11px] font-mono uppercase text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Current Assignment
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedTech.current_task.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" /> {selectedTech.current_task.site_name}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-500 dark:text-slate-400 italic">
                  No active task assigned currently.
                </div>
              )}

              {/* Attendance Status */}
              {selectedTech.attendance?.check_in && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Checked In Today
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Time: {new Date(selectedTech.attendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {selectedTech.attendance.selfie && (
                    <img
                      src={selectedTech.attendance.selfie}
                      alt="Selfie"
                      className="w-8 h-8 rounded-lg object-cover border border-emerald-200 dark:border-emerald-500/30"
                    />
                  )}
                </div>
              )}

              {/* Route Trail Breadcrumbs Summary */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-800 dark:text-slate-300 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Today's Waypoints Trail
                  </span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {routeTrailData?.total_km ? `${routeTrailData.total_km.toFixed(1)} KM` : '0 KM'}
                  </span>
                </div>

                {isRouteLoading ? (
                  <div className="py-4 text-center text-xs text-slate-500">Loading trail breadcrumbs...</div>
                ) : routeWaypoints.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {routeWaypoints.map((wp) => (
                      <div key={wp.order} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 text-[10px] font-bold flex items-center justify-center">
                            {wp.order}
                          </span>
                          <span className="text-slate-800 dark:text-slate-300 font-medium truncate max-w-[140px]">{wp.site_name}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {new Date(wp.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 text-xs text-slate-500 italic">
                    No travel waypoints logged yet today.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400 space-y-2 shadow-sm">
              <Compass className="w-8 h-8 text-cyan-500/40 mx-auto animate-pulse" />
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-300">Radar Focus Standby</div>
              <p className="text-xs text-slate-500">
                Click on any blip on the radar screen or select a technician from the roster below to view live coordinates, distance, and daily trail.
              </p>
            </div>
          )}

          {/* Technicians Roster List */}
          <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Field Crew Roster</h4>
              <span className="text-xs font-mono text-slate-500">
                {filteredTechnicians.length} shown
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            {/* List */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {filteredTechnicians.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No staff members match the selected filter.
                </div>
              ) : (
                filteredTechnicians.map((tech) => {
                  const isSelected = selectedTechId === tech.id;
                  const statusMeta = getStatusColor(tech.status);

                  return (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedTechId(tech.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-200">{tech.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {tech.distance_from_base !== null ? `${tech.distance_from_base.toFixed(1)} km from base` : 'Off grid'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">{tech.battery_level}% 🔋</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
