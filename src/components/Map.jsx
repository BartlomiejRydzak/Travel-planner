import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCylindricalStereographic } from "d3-geo-projection";
import axios from "axios";

const geoUrl =
  "https://unpkg.com/world-atlas@2.0.2/countries-110m.json"
const URL = "http://localhost:5000";

export default function MapChart(props) {

  const projection = geoCylindricalStereographic().scale(127);
  const [clickedCountries, setClickedCountry] = useState(props.countries);
  const [position, setPosition] = useState({ coordinates: [-36.091829614540046, -22.272618862363455], zoom: 1 });

  useEffect(() => {
    setClickedCountry(props.countries);
  }, [props.countries]); 

  const handleCountryClick = async (geo) => {
    console.log(clickedCountries)
    if(clickedCountries.includes(geo.properties.name)) {
      setClickedCountry(prevCountries => {
      let toRemove = prevCountries.find((key) => key === geo.properties.name);
      return prevCountries.filter((key) => key != toRemove);
      })
      await axios.delete(URL + "/countries", {data: {country: geo.properties.name, id: props.person_id}});
    }
    else {
      setClickedCountry(prevCountries => [...prevCountries, geo.properties.name])
      await axios.post(URL + "/countries", {country: geo.properties.name, id: props.person_id})
    }
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
                fill: clickedCountries.includes(geo.properties.name) ? "#D5F0C1" : "#F9F7C9",
                outline: "none"
              },
              hover: {
                fill:  "#D5F0C1",
                outline: "none"
              },
            }}
             />
          ))
        }
      </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  )
}
