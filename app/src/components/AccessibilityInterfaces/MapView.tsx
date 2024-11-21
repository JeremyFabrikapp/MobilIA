import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { MapPin, Accessibility } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  startPoint: [number, number];
  endPoint: [number, number];
  waypoints: [number, number][];
  accessiblePoints: Array<{
    position: [number, number];
    type: 'elevator' | 'ramp';
    status: 'operational' | 'maintenance';
  }>;
}

export function MapView({ startPoint, endPoint, waypoints, accessiblePoints }: MapViewProps) {
  const pathPoints = [startPoint, ...waypoints, endPoint];
  const bounds = pathPoints.map(point => point);

  return (
    <div className="h-[60vh] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        bounds={bounds}
        className="h-full w-full"
        zoom={13}
        center={startPoint}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Main path */}
        <Polyline
          positions={pathPoints}
          pathOptions={{ color: 'blue', weight: 4 }}
        />

        {/* Start marker */}
        <Marker position={startPoint} icon={defaultIcon}>
          <Popup>Point de départ</Popup>
        </Marker>

        {/* End marker */}
        <Marker position={endPoint} icon={defaultIcon}>
          <Popup>Destination</Popup>
        </Marker>

        {/* Accessible points markers */}
        {accessiblePoints.map((point, index) => (
          <Marker
            key={index}
            position={point.position}
            icon={defaultIcon}
          >
            <Popup>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">
                    {point.type === 'elevator' ? 'Ascenseur' : 'Rampe d\'accès'}
                  </span>
                </div>
                <span className={`text-sm ${
                  point.status === 'operational' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {point.status === 'operational' ? 'En service' : 'En maintenance'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Waypoint markers */}
        {waypoints.map((point, index) => (
          <Marker key={index} position={point} icon={defaultIcon}>
            <Popup>Point de passage {index + 1}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}