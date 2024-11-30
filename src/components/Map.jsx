import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCylindricalStereographic } from "d3-geo-projection";

const geoUrl =
  "https://unpkg.com/world-atlas@2.0.2/countries-110m.json"

export default function MapChart() {

  const projection = geoCylindricalStereographic().scale(127);
  const [clickedCountries, setClickedCountry] = useState([]);
  const [position, setPosition] = useState({ coordinates: [-36.091829614540046, -22.272618862363455], zoom: 1 });

  const handleCountryClick = (geo) => {
    if(clickedCountries.includes(geo.rsmKey)) setClickedCountry(prevCountries => {
      let toRemove = prevCountries.find((key) => key === geo.rsmKey)
      return prevCountries.filter((key) => key != toRemove)
    })
    else setClickedCountry(prevCountries => [...prevCountries, geo.rsmKey])
  };

    function handleMoveEnd(position) {
      if(position.zoom !== 1) setPosition(position);
      else setPosition({ coordinates: [0, 0], zoom: 1 })
    }

    useEffect(() => {
      handleMoveEnd({ coordinates: [0, 0], zoom: 1 });
    }, []);

  return (
    <ComposableMap projection={projection} className="map">
          <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}> 
          
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography 
            key={geo.rsmKey} 
            geography={geo} 
            onClick={() => handleCountryClick(geo)}
            stroke="#AAD9BB"
            style={{
              default: {
                fill: clickedCountries.includes(geo.rsmKey) ? "#D5F0C1" : "#F9F7C9",
                outline: "none"
              },
              hover: {
                fill:  clickedCountries.includes(geo.rsmKey) ? "#D5F0C1" : "#F9F7C9",
                outline: "none"
              }
            }}
             />
          ))
        }
      </Geographies>
      {/* <Marker coordinates={[-74.006, 40.7128]}>
        <circle r={4} fill="blue" />
      </Marker> */}
      </ZoomableGroup>
    </ComposableMap>
  )
}
