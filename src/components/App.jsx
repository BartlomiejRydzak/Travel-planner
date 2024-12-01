import React, { useEffect, useState } from 'react';
import MapChart from './Map.jsx';
import axios from "axios";
import Person from "./Person.jsx"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Fab from '@mui/material/Fab';
import AddPerson from './AddPerson.jsx';

const URL = "http://localhost:5000";

function App() {

    const [countries, setCountries] = useState([]);
    const [people, setPeople] = useState([]);
    const [person_id, setId] = useState();
    const [showForm, setShowForm] = useState(false);
    // const [user_id, setUser] = useState();

    // useEffect(() => {
    //     const getPeople = async() => {
    //         try {
    //             const result = await axios.get(URL + "/user");
    //             // setPeople(result.data.people)
    //             // setId(result.data.people[0].person_id)
    //             console.log("id",result.data)
    //         } catch (error) {
    //             console.log("Error fetching people:", error);
    //         }
    //     };
        
    //     getPeople();
    // }, []);

    useEffect(() => {
        const getPeople = async() => {
            try {
                const result = await axios.get(URL + "/people");
                setPeople(result.data.people)
                setId(result.data.people[0].person_id)
                console.log("id",result.data.people[0].person_id)
            } catch (error) {
                console.log("Error fetching people:", error);
            }
        };
        
        getPeople();
    }, []);


    useEffect(() => {

        const getCountries = async () => {
            if(!person_id) return;
            try {
                const result = await axios.get(URL + "/countries", {
                    params: {
                        id: person_id,
                    }
                })
                let tab = []
                for(let i=0; i<result.data.countries.length; i++){
                    tab.push(result.data.countries[i].been);
                }
                setCountries(tab);
                } catch (error) {
                console.error("Error fetching countries:", error);
            }
            };
            getCountries();

    }, [person_id])

    function show() {
        setShowForm(!showForm);
    }

    function addPerson(newPerson) {
        setPeople(prevPeople => [...prevPeople, newPerson]);
    }

    function deletePerson(deletedPerson) {
        setPeople(prevPeople => prevPeople.filter(person => person.person_id != deletedPerson.person_id))
    }

    return ( <div>
        <h1>Travel Map</h1>
        {people.map((person, index) => {
            return <Person onDelete={deletePerson} fun={setId} key={index} id={person.person_id} name={person.name}/>
        })}
        {showForm ? <AddPerson onAdd={addPerson} fun={show}/> : <Fab onClick={show}><AddCircleOutlineIcon /></Fab>}
        <MapChart countries={countries} person_id={person_id}/>
        
    </div> );
}

export default App;

