import express from 'express';
import pg from 'pg';
import cors from 'cors';
import env from 'dotenv';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
env.config({ path: '../.env' });

const db = new pg.Client({
    connectionString:process.env.CONN_STRING,
    ssl: {
        ca: fs.readFileSync('../ca.crt').toString(),
    },
});

db.connect()
    .then(() => console.log('Połączono z bazą danych Tembo!'))
    .catch((err) => console.error('Błąd połączenia:', err.stack));

app.get("/kraje", async (req, res) => {
    const wynik = await db.query(
        "SELECT * FROM pol.osoby_kraje JOIN pol.kraje k USING (kraj_id) WHERE osoba_id=$1",
        [req.query.id]
    );
    res.status(200).json({ kraje: wynik.rows });
});

app.get("/krajeDoPojechania", async (req, res) => {
    const wynik = await db.query(
        "SELECT * FROM pol.osoby_chca_kraje JOIN pol.kraje k USING (kraj_id) WHERE osoba_id=$1",
        [req.query.id]
    );
    res.status(200).json({ kraje: wynik.rows });
});

app.get("/liczba_krajow", async (req, res) => {
    const wynik = await db.query(
        "SELECT COUNT(*) FROM pol.osoby_kraje WHERE osoba_id = $1",
        [req.query.id]
    );
    res.status(200).json({ liczba: wynik.rows[0].count });
});

app.get("/osoby", async (req, res) => {
    const wynik = await db.query("SELECT osoba_id, imie FROM pol.osoby");
    res.status(200).json({ osoby: wynik.rows });
});

app.get("/statystyki1", async (req, res) => {
    const wynik = await db.query(
        "SELECT * FROM pol.widok_odwiedzonych_krajow ORDER BY liczba_odwiedzonych_krajow DESC"
    );
    res.status(200).json({ osoby: wynik.rows });
});

app.get("/statystyki2", async (req, res) => {
    const wynik = await db.query(
        "SELECT COUNT(*) as liczba, nazwa FROM pol.osoby_kraje ok JOIN pol.kraje k USING (kraj_id) GROUP BY nazwa ORDER BY COUNT(*) DESC LIMIT 3"
    );
    res.status(200).json({ kraje: wynik.rows });
});

app.get("/statystyki3", async (req, res) => {
    const wynik = await db.query(
        "select * from pol.widok_krajow_i_liczba_osob order by liczba_osob desc limit 3"
    );
    res.status(200).json({ kraje: wynik.rows });
});

app.post("/kraje", async (req, res) => {
    console.log("Byl");
    let kraj = req.body.country;
    const id = req.body.id;
    let kraj_id;
    try {
        const wynik = await db.query(
            "INSERT INTO pol.kraje (nazwa) VALUES ($1) RETURNING *",
            [kraj]
        );
        kraj_id = wynik.rows[0].kraj_id;
    } catch (e) {
        if (e.code === '23505') {
            console.log("Kraj już istnieje w bazie danych.");
            const existing = await db.query(
                "SELECT * FROM pol.kraje WHERE nazwa = $1",
                [kraj]
            );
            kraj_id = existing.rows[0].kraj_id;
        } else {
            console.error("Wystąpił nieoczekiwany błąd:", e);
        }
    }
    await db.query(
        "INSERT INTO pol.osoby_kraje (osoba_id, kraj_id) VALUES ($1, $2)",
        [id, kraj_id]
    );
    res.status(200).json({ msg: "Kraj dodany" });
});

app.post("/krajeDoPojechania", async (req, res) => {
    console.log("chce");
    let kraj = req.body.country;
    const id = req.body.id;
    let kraj_id;
    try {
        const wynik = await db.query(
            "INSERT INTO pol.kraje (nazwa) VALUES ($1) RETURNING *",
            [kraj]
        );
        kraj_id = wynik.rows[0].kraj_id;
    } catch (e) {
        if (e.code === '23505') {
            console.log("Kraj już istnieje w bazie danych.");
            const existing = await db.query(
                "SELECT * FROM pol.kraje WHERE nazwa = $1",
                [kraj]
            );
            kraj_id = existing.rows[0].kraj_id;
        } else {
            console.error("Wystąpił nieoczekiwany błąd:", e);
        }
    }
    await db.query(
        "INSERT INTO pol.osoby_chca_kraje (osoba_id, kraj_id) VALUES ($1, $2)",
        [id, kraj_id]
    );
    res.status(200).json({ msg: "Kraj dodany" });
});

app.post("/osoba", async (req, res) => {
    const wynik = await db.query(
        "INSERT INTO pol.osoby (imie) VALUES ($1) RETURNING *",
        [req.body.name]
    );
    res.status(200).json({ osoba: wynik.rows[0] });
});

app.delete("/kraje", async (req, res) => {
    const { country, id } = req.body;
    console.log("add",req.body);
    await db.query(
        "DELETE FROM pol.osoby_kraje WHERE osoba_id=$1 AND kraj_id = (SELECT kraj_id FROM pol.kraje WHERE nazwa=$2)",
        [id, country]
    );
    res.status(200).json({ msg: "Kraj usunięty" });
});

app.delete("/krajeDoPojechania", async (req, res) => {
    const { country, id } = req.body;
    console.log("del",req.body);
    await db.query(
        "DELETE FROM pol.osoby_chca_kraje WHERE osoba_id=$1 AND kraj_id = (SELECT kraj_id FROM pol.kraje WHERE nazwa=$2)",
        [id, country]
    );
    res.status(200).json({ msg: "Kraj usunięty" });
});

app.delete("/osoba", async (req, res) => {
    const wynik = await db.query(
        "DELETE FROM pol.osoby WHERE imie=$1 RETURNING *",
        [req.body.name]
    );
    res.status(200).json({ osoba: wynik.rows[0] });
});

app.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie ${port}`);
});
