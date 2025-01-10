import React, { useState } from 'react';
import axios from 'axios';

function DodajOsobe(props) {
    const [imie, ustawImie] = useState("");

    function obsluzZmiane(event) {
        ustawImie(event.target.value);
    }

    async function obsluzKlikniecie() {
        const wynik = await axios.post("http://localhost:5050/osoba", { name: imie });
        props.onDodaj(wynik.data.osoba);
        ustawImie("");
        props.fun();
    }

    return (
        <div>
            <label htmlFor="imie">Jak masz na imię?</label>
            <input type="text" id="imie" onChange={obsluzZmiane} />
            <button onClick={obsluzKlikniecie}>Wyślij</button>
        </div>
    );
}

export default DodajOsobe;
