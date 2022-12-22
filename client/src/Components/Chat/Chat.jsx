import React, { useState, useEffect } from "react";
import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import queryString from "query-string";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import "./Chat.css";
let socket;

const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const location = useLocation();
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io("https://iskylar-chat.herokuapp.com/");
    setName(name);
    setRoom(room);
    console.log(socket);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);
  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  return (
    <>
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
        <TextContainer users={users} />
      </div>
    </>
  );
};

export default Chat;
