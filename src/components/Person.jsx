import React from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Fab from '@mui/material/Fab';
import axios from 'axios';

function Person(props) {

    function handleClick() {
        props.fun(props.id)
    }

    async function handleDelete(){
        const result = await axios.delete("http://localhost:5000/person", {data: {name: props.name}});
        props.onDelete(result.data.person);
    }

    return ( <div id={personalbar.id} style={{display:"inline-block"}}>
        <button onClick={handleClick}>{props.name}</button><Fab onClick={handleDelete}><HighlightOffIcon /></Fab>
        
    </div> );
}

export default Person;