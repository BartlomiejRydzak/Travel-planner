import React, { useEffect, useState } from "react";
import axios from 'axios';

function Raporty() {
    const [statystyki1, ustawStatystyki1] = useState([]);
    const [statystyki2, ustawStatystyki2] = useState([]);
    const [statystyki3, ustawStatystyki3] = useState([]);

    useEffect(() => {
        const pobierzStatystyki1 = async () => {
            const wynik = await axios.get("http://localhost:5050/statystyki1");
            ustawStatystyki1(wynik.data.osoby);
        }

        const pobierzStatystyki2 = async () => {
            const wynik = await axios.get("http://localhost:5050/statystyki2");
            ustawStatystyki2(wynik.data.kraje);
        }

        const pobierzStatystyki3 = async () => {
            const wynik = await axios.get("http://localhost:5050/statystyki3");
            ustawStatystyki3(wynik.data.kraje);
        }

        pobierzStatystyki1();
        pobierzStatystyki2();
        pobierzStatystyki3();
    }, [])

    return (
        <div>
            <h3>Osoby z największą liczbą odwiedzonych krajów</h3>
            <ul>
                {statystyki1.map((stat, indeks) => {
                    return <li key={indeks}>{stat.osoba}, {stat.liczba_odwiedzonych_krajow}</li>
                })}
            </ul>

            <h3>Top 3 najczęściej odwiedzane kraje</h3>
            <ul>
                {statystyki2.map((stat, indeks) => {
                    return <li key={indeks}>{stat.nazwa}, {stat.liczba}</li>
                })}
            </ul>

            <h3>Top 3 kraje najchetsze do odwiedzenia</h3>
            <ul>
                {statystyki3.map((stat, indeks) => {
                    return <li key={indeks}>{stat.kraj}, {stat.liczba_osob}</li>
                })}
            </ul>
        </div>
    );
}

export default Raporty;
