import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { io } from "socket.io-client";
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';


function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  ///////////// ON LOADING: CHECKS WETHER THERE IS A CONNECTED USER
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!localStorage.getItem('chat-app-user')) { //  IF NO USER IS FOUND, REDIRECTS TO login PAGE
        navigate('/login');
      } else { // IF A USER IS FOUND, SETS AS CURRENT
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
        setIsLoaded(true);
      }
    };
    getCurrentUser();
  }, []);

  // WHEN A USER IS CONNECTED
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host); 
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // RETRIEVES ALL USERS IFF THE CURRENT USER HAS AN AVATAR PICTURE
  useEffect(() => {
    const getAllUsers = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data)
        } else {
          navigate("/setAvatar");
        }
      }
    };
    getAllUsers();
  }, [currentUser]);

  // WHEN CHANGING A CHAT-PARTNER
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        {
          isLoaded && currentChat === undefined ?
            <Welcome currentUser={currentUser} /> :
            <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socket} />
        }
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;