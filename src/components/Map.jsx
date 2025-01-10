import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCylindricalStereographic } from "d3-geo-projection";
import axios from "axios";

const geoUrl =
  "https://unpkg.com/world-atlas@2.0.2/countries-110m.json"
const URL = "http://localhost:5050";


export default function Mapa(props) {

  const projection = geoCylindricalStereographic().scale(127);
  const [kliknieteKraje, ustawKliknieteKraje] = useState(props.kraje);
  const [krajeDoPojechania, ustawKrajeDoPojechania] = useState(props.krajeDoPojechania);
  const [pozycja, ustawPozycje] = useState({ coordinates: [-36.091829614540046, -22.272618862363455], zoom: 1 });
  const [liczba, ustawLiczbe] = useState(0)
  const [nazwaKraju, ustawNazweKraju] = useState("");
  let clickTimeout;

  useEffect(() => {
    ustawKliknieteKraje(props.kraje);
  }, [props.kraje]);

  useEffect(() => {
    ustawKrajeDoPojechania(props.krajeDoPojechania);
  }, [props.krajeDoPojechania]);

  const obsluzKlikniecieKraju = async (geo) => {
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(async () => {
        if (kliknieteKraje.includes(geo.properties.name)) {
        ustawKliknieteKraje(prevKraje => {
            let doUsuniecia = prevKraje.find((key) => key === geo.properties.name);
            return prevKraje.filter((key) => key !== doUsuniecia);
        })
        await axios.delete(URL + "/kraje", { data: { country: geo.properties.name, id: props.osobaId } });
        }
        else {
        ustawKliknieteKraje(prevKraje => [...prevKraje, geo.properties.name]);
        await axios.post(URL + "/kraje", { country: geo.properties.name, id: props.osobaId });
        }
        await pobierzLiczbe();
    }, 300); // 300ms debounce
  };

  const obluzKrajeDoPojechania = async (geo) => {
    console.log(krajeDoPojechania);
    clearTimeout(clickTimeout); 
    if (krajeDoPojechania.includes(geo.properties.name)) {
      ustawKrajeDoPojechania(prevKraje => {
        let doUsuniecia = prevKraje.find((key) => key === geo.properties.name);
        return prevKraje.filter((key) => key !== doUsuniecia);
      })
      await axios.delete(URL + "/krajeDoPojechania", { data: { country: geo.properties.name, id: props.osobaId } });
    }
    else {
        ustawKrajeDoPojechania(prevKraje => [...prevKraje, geo.properties.name]);
      await axios.post(URL + "/krajeDoPojechania", { country: geo.properties.name, id: props.osobaId });
    }
    await pobierzLiczbe();
  };

  function obsluzZakonczeniePrzemieszczania(pozycja) {
    if (pozycja.zoom !== 1) ustawPozycje(pozycja);
    else ustawPozycje({ coordinates: [0, 0], zoom: 1 });
  }

  useEffect(() => {
    obsluzZakonczeniePrzemieszczania({ coordinates: [0, 0], zoom: 1 });
  }, []);

  const pobierzLiczbe = async () => {
    const wynik = await axios.get(URL + "/liczba_krajow", {
      params: {
        id: props.osobaId,
      }
    })
    ustawLiczbe(wynik.data.liczba);
  }

  useEffect(() => {
    
    pobierzLiczbe();
  }, [kliknieteKraje]);

  const obsluzPrzeslanieFormularza = async (e) => {
    e.preventDefault();
    try {
      let kraj = nazwaKraju;
      kraj = kraj.toLowerCase();
      kraj = kraj.charAt(0).toUpperCase() + kraj.slice(1);
      await axios.post(URL + "/kraje", { country: kraj, id: props.osobaId });
      ustawKliknieteKraje(prevKraje => [...prevKraje, kraj]);
      ustawNazweKraju("");
    } catch (blad) {
      console.error("Błąd podczas przesyłania formularza:", blad);
    }
  };

  return (
    <div>
      <p>liczba: {liczba}</p>
      <form onSubmit={obsluzPrzeslanieFormularza}>
        <label htmlFor="nazwa_kraju">Nazwa Kraju:</label>
        <input
          type="text"
          id="nazwa_kraju"
          name="nazwa_kraju"
          value={nazwaKraju}
          onChange={(e) => ustawNazweKraju(e.target.value)}
          required
        />
        <button type="submit">Wyślij</button>
      </form>
      <ComposableMap projection={projection} className="map">
        {/* <ZoomableGroup
          zoom={pozycja.zoom}
          center={pozycja.coordinates}
          onMoveEnd={obsluzZakonczeniePrzemieszczania}
          >  */}

          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => obsluzKlikniecieKraju(geo)}
                  onDoubleClick={() => obluzKrajeDoPojechania(geo)}
                  stroke="#AAD9BB"
                  style={{
                    default: {
                      fill: kliknieteKraje.includes(geo.properties.name) ? "#D5F0C1" : krajeDoPojechania.includes(geo.properties.name) ? "#2E5077" : "#F9F7C9",
                      outline: "none"
                    },
                    hover: {
                      fill: "#D5F0C1",
                      outline: "none"
                    },
                  }}
                />
              ))
            }
          </Geographies>
        {/* </ZoomableGroup> */}
      </ComposableMap>
    </div>
  );
}