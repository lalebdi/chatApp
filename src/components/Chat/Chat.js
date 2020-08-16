import React, { useState, useEffect } from 'react';
import queryString from 'query-string'; // this will help with retireving data from the url
import io from 'socket.io-client';
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
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
        // console.log(socket);
        // we're getting the callback function from the /server/index
        socket.emit('join', { name, room}, () => {
            
        });
            // below is for unmouting
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]); // to avoid data repetition, need to place an array as the scond param in the useEffect so only when the vlaues change we will re-render

    useEffect(() => {
        socket.on('message' , (message) => {
            setMessages([...messages, message])
            // since we can't mutate state, used the spead operator
        })
    }, [messages]);

    // function for sending messages 
    const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
        }
    console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container" >
                <InfoBar room={room}/>
                {/* <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyPress={event => event.key === 'Enter' ? sendMessage() : null} /> */}
            </div>
        </div>
    )
}

export default Chat
