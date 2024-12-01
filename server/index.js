import express from 'express';
import pg from "pg";
import cors from "cors";
import env from "dotenv";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
env.config({path: '../.env'});

const db = new pg.Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABSE,
    password: process.env.PASS,
    port: process.env.PORT,
});

db.connect();

app.get("/countries", async (req, res) => {
    console.log(req.query)
    const result = await db.query("SELECT * FROM countries WHERE person_id=$1", [req.query.id]);
    res.status(200).json({countries : result.rows});
})

app.get("/people", async (req, res) => {
    const result = await db.query("SELECT person_id, name FROM people");
    res.status(200).json({people: result.rows});
})

// app.get("/user", async (req, res) => {
//     const result = await db.query("SELECT user_id FROM users");
//     res.status(200).json({people: result.rows});
// })


app.post("/countries", async (req, res) => {
    const {country, id} = req.body;
    await db.query("INSERT INTO countries (been, person_id) VALUES ($1, $2)", [country, id]);
    res.status(200).json({msg: "country added"});
})

app.post("/person", async (req, res) => {
    const result = await db.query("INSERT INTO people (name, user_id) VALUES ($1, $2) RETURNING *", [req.body.name, 1])
    res.status(200).json({person: result.rows[0]});
})

app.delete("/countries", async (req, res) => {
    const {country, id} = req.body;
    await db.query("DELETE FROM countries WHERE been=$1 and person_id=$2", [country, id]);
    res.status(200).json({msg: "country deleted"});
})

app.delete("/person", async (req, res) => {
    const result = await db.query("DELETE FROM people WHERE name=$1 RETURNING *", [req.body.name]);
    console.log(result.rows[0])
    res.status(200).json({person: result.rows[0]});
})


app.listen(port, () => {
    console.log(`Server listens on port ${port}`);
})