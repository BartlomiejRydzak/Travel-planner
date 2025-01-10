import React, { useEffect, useState } from 'react';
import Mapa from './Map.jsx';
import axios from "axios";
import Osoba from "./Person.jsx";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Fab from '@mui/material/Fab';
import DodajOsobe from './AddPerson.jsx';
import Raporty from './Reports.jsx';

const URL = "http://localhost:5050";

function Aplikacja() {
    const [kraje, ustawKraje] = useState([]);
    const [krajeDoPojechania, ustawKrajeDoPojechania] = useState([]);
    const [osoby, ustawOsoby] = useState([]);
    const [osobaId, ustawOsobaId] = useState();
    const [pokazFormularz, ustawPokazFormularz] = useState(false);

    useEffect(() => {
        const pobierzOsoby = async () => {
            try {
                const wynik = await axios.get(URL + "/osoby");
                ustawOsoby(wynik.data.osoby);
                ustawOsobaId(wynik.data.osoby[0].osoba_id);
            } catch (blad) {
                console.log("Błąd podczas pobierania osób:", blad);
            }
        };

        pobierzOsoby();
    }, []);

    useEffect(() => {
        const pobierzKraje = async () => {
            if (!osobaId) return;
            try {
                const wynik = await axios.get(URL + "/kraje", { params: { id: osobaId } });
                let listaKrajow = wynik.data.kraje.map(kraj => kraj.nazwa);
                ustawKraje(listaKrajow);
            } catch (blad) {
                console.error("Błąd podczas pobierania krajów:", blad);
            }
        };

        const pobierzKrajeDoPojechania = async () => {
            if (!osobaId) return;
            try {
                const wynik = await axios.get(URL + "/krajeDoPojechania", { params: { id: osobaId } });
                let listaKrajow = wynik.data.kraje.map(kraj => kraj.nazwa);
                ustawKrajeDoPojechania(listaKrajow);
            } catch (blad) {
                console.error("Błąd podczas pobierania krajów:", blad);
            }
        };

        pobierzKraje();
        pobierzKrajeDoPojechania();
    }, [osobaId]);

    function pokaz() {
        ustawPokazFormularz(!pokazFormularz);
    }

    function dodajOsobe(nowaOsoba) {
        ustawOsoby(prevOsoby => [...prevOsoby, nowaOsoba]);
    }

    function usunOsobe(usuwanaOsoba) {
        ustawOsoby(prevOsoby => prevOsoby.filter(osoba => osoba.osoba_id !== usuwanaOsoba.osoba_id));
    }

    return (
        <div>
            <h1>Mapa Podróży</h1>
            {osoby.map((osoba, indeks) => (
                <Osoba onUsun={usunOsobe} fun={ustawOsobaId} key={indeks} id={osoba.osoba_id} imie={osoba.imie} />
            ))}
            {pokazFormularz ? <DodajOsobe onDodaj={dodajOsobe} fun={pokaz} /> : <Fab onClick={pokaz}><AddCircleOutlineIcon /></Fab>}
            <Mapa kraje={kraje} osobaId={osobaId} krajeDoPojechania={krajeDoPojechania}/>
            <Raporty />
        </div>
    );
}

export default Aplikacja;
