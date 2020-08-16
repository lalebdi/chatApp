import React, { useState, useEffect } from 'react';
import queryString from 'query-string'; // this will help with retireving data from the url
import io from 'socket.io-client';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const ENDPOINT = 'localhost:5000';
    // location is from react-router we get a URL back
    useEffect(() => {
        // I destructured the data
        const { name, room } = queryString.parse(location.search);
        // console.log(data) // gave me the name and room inputs from join
        // console.log(location.search) //gave me the parameters
        // console.log(name, room) 
        socket= io(ENDPOINT);
        setName(name);
        setRoom(room);

    })
    return (
        <div>
           Chat 
        </div>
    )
}

export default Chat
