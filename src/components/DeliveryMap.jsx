import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import L from "leaflet";

// Custom marker icons
const createIcon = (emoji, color) =>
  L.divIcon({
    className: "custom-map-marker",
    html: `<div style="
      background: ${color};
      width: 44px;
      height: 44px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 3px solid white;
    "><span style="transform: rotate(45deg); font-size: 20px;">${emoji}</span></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });

const pickupIcon = createIcon("📦", "#3b82f6");
const riderIcon = createIcon("🏍️", "#dc2626");
const deliveryIcon = createIcon("🏠", "#16a34a");

// Pakistan cities coordinates
const CITIES = {
  Mardan: [34.1989, 72.0231],
  Chakdara: [34.6499, 72.0333],
  Timergara: [34.8289, 71.8421],
  Swabi: [34.12, 72.47],
  Swat: [34.7717, 72.36],
  Peshawar: [34.0151, 71.5249],
  Nowshera: [34.0159, 71.9747],
  Islamabad: [33.6844, 73.0479],
  Rawalpindi: [33.5651, 73.0169],
  Lahore: [31.5204, 74.3587],
  Faisalabad: [31.4187, 73.0791],
  Charsadda: [34.1453, 71.7308],
  Taxila: [33.7463, 72.7873],
};

export default function DeliveryMap({ pickup, delivery, riderLocation }) {
  const [riderPos, setRiderPos] = useState(CITIES[riderLocation] || CITIES.Chakdara);
  const [progress, setProgress] = useState(0);

  const pickupPos = CITIES[pickup] || CITIES.Mardan;
  const deliveryPos = CITIES[delivery] || CITIES.Timergara;

  // Animate rider marker moving
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 0.004));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const lat = pickupPos[0] + (deliveryPos[0] - pickupPos[0]) * progress;
    const lng = pickupPos[1] + (deliveryPos[1] - pickupPos[1]) * progress;
    setRiderPos([lat, lng]);
  }, [progress, pickupPos, deliveryPos]);

  const routeLine = [pickupPos, riderPos, deliveryPos];

  return (
    <div className="real-map-wrapper">
      <MapContainer
        center={pickupPos}
        zoom={9}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={pickupPos} icon={pickupIcon}>
          <Popup>
            <b>📦 Pickup</b>
            <br />
            {pickup}
          </Popup>
        </Marker>

        <Marker position={deliveryPos} icon={deliveryIcon}>
          <Popup>
            <b>🏠 Delivery</b>
            <br />
            {delivery}
          </Popup>
        </Marker>

        <Marker position={riderPos} icon={riderIcon}>
          <Popup>
            <b>🏍️ Rider</b>
            <br />
            En route
          </Popup>
        </Marker>

        <Circle
          center={riderPos}
          radius={3000}
          pathOptions={{ color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.12 }}
        />

        <Polyline
          positions={routeLine}
          pathOptions={{ color: "#dc2626", weight: 4, opacity: 0.7, dashArray: "10, 8" }}
        />
      </MapContainer>
    </div>
  );
}