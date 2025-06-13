// src/components/GlobalMap.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./GlobalMap.css";

// Define custom icons.
const disasterIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// (Other icons defined but not used here.)
const organizationIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const resourceIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Asynchronous function to fetch coordinates using Nominatim API.
const geocodeLocation = async (location, country = "") => {
  const query = encodeURIComponent(`${location}, ${country}`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
  try {
    const response = await fetch(url);
    const results = await response.json();
    if (results && results.length > 0) {
      return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
    }
  } catch (err) {
    console.error("Geocoding error:", err);
  }
  return [20, 0]; // Fallback coordinates.
};

// Dummy fallback function if geocoding isn't used.
const getCoordinatesForLocation = (location, country = "") => {
  const loc = location.toLowerCase();
  const cnt = country.toLowerCase();
  if (loc.includes("pune") && (cnt === "" || cnt.includes("india"))) return [18.5204, 73.8567];
  if (loc.includes("srinagar") && (cnt === "" || cnt.includes("india"))) return [34.0837, 74.7973];
  if (loc.includes("chandigarh")) return [30.7333, 76.7794];
  if (loc.includes("san francisco")) return [37.7749, -122.4194];
  if (loc.includes("new york") || loc.includes("nyc")) return [40.7128, -74.0060];
  if (loc.includes("london")) return [51.5074, -0.1278];
  if (loc.includes("tokyo")) return [35.6895, 139.6917];
  if (loc.includes("sydney")) return [-33.8688, 151.2093];
  if (loc.includes("paris")) return [48.8566, 2.3522];
  return [20, 0];
};

const GlobalMap = ({ searchQuery = "", disasterReports }) => {
  const [mapData, setMapData] = useState([]);

  // Fetch data from API if disasterReports isn't provided.
  const fetchMapData = async () => {
    try {
      const response = await fetch("https://your-real-api-endpoint.com/markers");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMapData(data);
    } catch (error) {
      console.error("Error fetching real-time map data, using sample data:", error);
      const sampleData = [
        {
          lat: 34.0522,
          lng: -118.2437,
          type: "disaster",
          description: "Wildfire in Los Angeles",
          location: "Los Angeles",
          country: "USA",
          supplies: "Water, Food",
        },
        {
          lat: 40.7128,
          lng: -74.0060,
          type: "resource",
          description: "Food distribution center in NYC",
          location: "New York",
          country: "USA",
          supplies: "Food",
        },
        {
          lat: 51.5074,
          lng: -0.1278,
          type: "organization",
          description: "Relief Org in London",
          location: "London",
          country: "UK",
          supplies: "",
        },
        {
          // Marker without lat/lng to test geocoding.
          type: "disaster",
          description: "",
          location: "Tokyo",
          country: "Japan",
          supplies: "Medical supplies",
        },
        {
          lat: -33.8688,
          lng: 151.2093,
          type: "resource",
          description: "Medical supplies center in Sydney",
          location: "Sydney",
          country: "Australia",
          supplies: "Medicine",
        },
        {
          lat: 48.8566,
          lng: 2.3522,
          type: "organization",
          description: "Aid organization in Paris",
          location: "Paris",
          country: "France",
          supplies: "",
        },
        {
          // Example from victim dashboard: Pune, India.
          type: "disaster",
          description: "Flooding reported",
          location: "Pune",
          country: "India",
          supplies: "Food, Water",
        },
      ];
      setMapData(sampleData);
    }
  };

  useEffect(() => {
    if (disasterReports !== undefined) {
      setMapData(disasterReports);
    } else {
      fetchMapData();
      const interval = setInterval(fetchMapData, 60000);
      return () => clearInterval(interval);
    }
  }, [disasterReports]);

  // Geocode markers missing coordinates.
  useEffect(() => {
    const geocodeMarkers = async () => {
      let updated = false;
      const updatedMarkers = await Promise.all(
        mapData.map(async (marker) => {
          if ((marker.lat === undefined || marker.lng === undefined) && marker.location) {
            const coords = await geocodeLocation(marker.location, marker.country || "");
            if (coords) {
              updated = true;
              return { ...marker, lat: coords[0], lng: coords[1] };
            }
          }
          return marker;
        })
      );
      if (updated) {
        setMapData(updatedMarkers);
      }
    };
    if (mapData.length > 0) {
      geocodeMarkers();
    }
  }, [mapData]);

  // Filter only disaster markers and apply search.
  const filteredData = mapData.filter((marker) => {
    const markerType = marker.type
      ? marker.type.toLowerCase()
      : marker.disasterType
      ? "disaster"
      : "";
    if (markerType !== "disaster") return false;
    if (searchQuery.trim() === "") return true;
    const search = searchQuery.toLowerCase();
    return (
      (marker.description && marker.description.toLowerCase().includes(search)) ||
      (marker.location && marker.location.toLowerCase().includes(search)) ||
      (marker.supplies && marker.supplies.toLowerCase().includes(search))
    );
  });

  return (
    <div className="global-map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "500px", width: "90%", margin: "0 auto" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {filteredData.map((marker, index) => {
          const markerType = marker.type
            ? marker.type.toLowerCase()
            : marker.disasterType
            ? "disaster"
            : "";
          const coords =
            marker.lat !== undefined && marker.lng !== undefined
              ? [marker.lat, marker.lng]
              : getCoordinatesForLocation(marker.location || "", marker.country || "");
          // For disasters, always use the disaster icon.
          const icon = disasterIcon;
          return (
            <Marker key={index} position={coords} icon={icon}>
              <Popup>
                {marker.location ? (
                  <>
                    <strong>Location:</strong> {marker.location}
                    {marker.country ? `, ${marker.country}` : ""} <br />
                    <strong>Supplies Needed:</strong> {marker.supplies || "N/A"}
                  </>
                ) : (
                  marker.description || "No description provided"
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default GlobalMap;
