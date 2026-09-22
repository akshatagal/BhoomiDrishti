import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Map as MapIcon, Eye, ShieldCheck, Crosshair } from 'lucide-react';

// Leaflet default marker icons fix for Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export const GISMap = ({ parcels = [], onSelectParcel }) => {
  const [mapTile, setMapTile] = useState('osm'); // 'osm' | 'satellite' | 'topo' | 'light'

  // Map tile URLs
  const tileUrls = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
    },
    light: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }
  };

  const defaultCenter = [27.5550, 76.6360];

  // Delhi-Mumbai Expressway Corridor Line Path
  const highwayAlignment = [
    [27.5450, 76.6200],
    [27.5500, 76.6280],
    [27.5535, 76.6348],
    [27.5570, 76.6400],
    [27.5620, 76.6480],
    [27.5680, 76.6560]
  ];

  // Survey of India DGPS Benchmarks
  const dgpsPins = [
    { id: 'SOI-BM-01', coords: [27.5510, 76.6310], name: 'SOI Benchmark Ref #412', elevation: '268.4m MSL' },
    { id: 'SOI-BM-02', coords: [27.5560, 76.6390], name: 'NRSC DGPS Station Alwar-09', elevation: '271.2m MSL' }
  ];

  // Detailed Cadastral Parcel Polygons
  const parcelPolygons = [
    {
      id: 'PCL-101',
      positions: [
        [27.5520, 76.6330],
        [27.5540, 76.6335],
        [27.5545, 76.6360],
        [27.5525, 76.6355]
      ],
      color: '#f59e0b',
      fillColor: '#f59e0b'
    },
    {
      id: 'PCL-102',
      positions: [
        [27.5542, 76.6358],
        [27.5560, 76.6365],
        [27.5565, 76.6390],
        [27.5545, 76.6380]
      ],
      color: '#ef4444',
      fillColor: '#ef4444'
    },
    {
      id: 'PCL-103',
      positions: [
        [27.5580, 76.6410],
        [27.5600, 76.6420],
        [27.5605, 76.6450],
        [27.5585, 76.6440]
      ],
      color: '#10b981',
      fillColor: '#10b981'
    }
  ];

  return (
    <div className="w-full h-full min-h-[460px] relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution={tileUrls[mapTile].attribution}
          url={tileUrls[mapTile].url}
        />

        {/* Highway Alignment Line */}
        <Polyline
          positions={highwayAlignment}
          pathOptions={{
            color: '#3b82f6',
            weight: 5,
            dashArray: '10, 8',
            opacity: 0.85
          }}
        />

        {/* Cadastral Plot Polygons */}
        {parcelPolygons.map((poly) => (
          <Polygon
            key={poly.id}
            positions={poly.positions}
            pathOptions={{
              color: poly.color,
              fillColor: poly.fillColor,
              fillOpacity: 0.4,
              weight: 2.5
            }}
          />
        ))}

        {/* DGPS Pins */}
        {dgpsPins.map((pin) => (
          <CircleMarker
            key={pin.id}
            center={pin.coords}
            radius={7}
            pathOptions={{
              color: '#38bdf8',
              fillColor: '#0284c7',
              fillOpacity: 0.9,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-1 text-xs">
                <div className="font-bold text-sky-600 flex items-center gap-1">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{pin.name}</span>
                </div>
                <div className="text-slate-600 text-[10px]">Elevation: {pin.elevation}</div>
                <div className="text-slate-500 text-[9px]">Datum: WGS 84 DGPS Master Pin</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Parcel Markers */}
        {parcels.map((parcel) => {
          if (!parcel.coordinates) return null;
          const coords = parcel.coordinates.split(',').map(Number);
          if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return null;

          const isDispute = parcel.activeDispute === 1;
          const isAcquired = parcel.currentStage >= 10;

          return (
            <Marker key={parcel.id} position={coords}>
              <Popup>
                <div className="p-1.5 space-y-2 text-xs w-60">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1 gap-2">
                    <span className="font-bold text-amber-600">{parcel.surveyNo}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isDispute ? 'bg-rose-100 text-rose-700' : isAcquired ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Stage {parcel.currentStage}/11
                    </span>
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold">{parcel.landowner}</div>
                    <div className="text-slate-500 text-[11px]">{parcel.village}, {parcel.district}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-50 p-2 rounded border border-slate-200">
                    <div>Official: <span className="font-mono font-bold text-slate-800">{parcel.officialAreaHa} Ha</span></div>
                    <div>DGPS: <span className="font-mono font-bold text-amber-600">{parcel.surveyedAreaHa} Ha</span></div>
                  </div>

                  {onSelectParcel && (
                    <button
                      onClick={() => onSelectParcel(parcel)}
                      className="w-full mt-1 bg-amber-500 text-slate-950 font-bold py-1.5 rounded-lg hover:bg-amber-400 transition-colors text-[11px] shadow-sm flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Parcel & Award</span>
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Top Map Layer Switcher Control */}
      <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl z-[1000] shadow-lg flex items-center gap-1">
        <button
          onClick={() => setMapTile('osm')}
          className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
            mapTile === 'osm' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Street Map
        </button>
        <button
          onClick={() => setMapTile('satellite')}
          className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
            mapTile === 'satellite' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Satellite Aerial
        </button>
        <button
          onClick={() => setMapTile('light')}
          className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
            mapTile === 'light' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Clean Light
        </button>
        <button
          onClick={() => setMapTile('topo')}
          className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
            mapTile === 'topo' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Topographic
        </button>
      </div>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl z-[1000] text-[11px] space-y-1.5 shadow-xl">
        <div className="font-bold text-slate-900 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center gap-1.5">
          <MapIcon className="w-3.5 h-3.5 text-amber-500" />
          <span>Cadastral GIS Legend</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="w-3 h-0.5 bg-blue-500 font-bold" />
          <span>Highway Expressway Corridor Line</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="w-3 h-3 rounded-sm bg-emerald-500/80 border border-emerald-400" />
          <span>Acquired & DBT Disbursed Plot</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="w-3 h-3 rounded-sm bg-amber-500/80 border border-amber-400" />
          <span>LARR Stage 1-9 In-Progress Plot</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="w-3 h-3 rounded-sm bg-rose-500/80 border border-rose-400" />
          <span>Boundary Discrepancy Dispute</span>
        </div>
      </div>
    </div>
  );
};
