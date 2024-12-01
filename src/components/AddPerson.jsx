import React, { useState } from 'react';
import axios from 'axios';

function AddPerson(props) {
    const [name, setName] = useState("");

    function handleChange(event){
        setName(event.target.value);
    }

    async function handleClick(){
        const result = await axios.post("http://localhost:5000/person", {name: name});
        props.onAdd(result.data.person);
        setName("");
        props.fun();
    }

    return ( <div>
        <label htmlFor="name">Whats your name</label>
        <input type="text" id="name" onChange={handleChange}/>
        <button onClick={handleClick}>Submit</button>
    </div> );
}

export default AddPerson;