import React, { useState, useEffect } from 'react';
import queryString from 'query-string'; // this will help with retireving data from the url
import io from 'socket.io-client';
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'https://leah-whats-chat.herokuapp.com/';
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
        socket.on('message', message => {
            setMessages(messages => [ ...messages, message ]);
            // since we can't mutate state, used the spead operator
        });
    

        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
      }, []);

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
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        <TextContainer users={users}/>
    </div>
    )
}

export default Chat
