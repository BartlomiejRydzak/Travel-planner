import React from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Fab from '@mui/material/Fab';
import axios from 'axios';

function Osoba(props) {

    function obsluzKlikniecie() {
        props.fun(props.id)
    }

    async function obsluzUsuniecie() {
        const wynik = await axios.delete("http://localhost:5050/osoba", { data: { name: props.imie } });
        props.onUsun(wynik.data.osoba);
    }

    return (
        <div id={personalbar.id} style={{ display: "inline-block" }}>
            <button onClick={obsluzKlikniecie}>{props.imie}</button><Fab onClick={obsluzUsuniecie}><HighlightOffIcon /></Fab>
        </div>
    );
}

export default Osoba;
