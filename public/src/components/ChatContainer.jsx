import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import Logout from './Logout';
import axios from 'axios';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import { v4 as uuidv4 } from 'uuid';

function ChatContainer({ currentChat, currentUser, socket }) {
  const [ messages, setMessages ] = useState([]);
  const [arrivingMsg, setArrivingMsg ] = useState(null);
  const scrollRef = useRef();

  // GETS ALL SHARED MESSAGES
  useEffect(() => {
    const getMessages = async() => {
      const msgs = await axios.post(getAllMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id
      });
      setMessages(msgs.data);
    };
    currentChat && getMessages();
  }, [currentChat]);

  // ON LOAD: ON INCOMING OF A NEW MESSAGE
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", msg => {
        setArrivingMsg({
          fromSelf: false,
          message: msg 
        })
      })
    }
  }, []);

  //////////  ON THE SENDING OF A NEW MESSAGE, UPDATES STATE
  useEffect(() => {
    arrivingMsg && setMessages(oldMessages => {
      return [...oldMessages, arrivingMsg]
    })
  }, [arrivingMsg]);

  // SCROLLING TO THE END OF THE CHAT WITH EVERY MESSAGE
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg 
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg 
    });
    setMessages(oldMessages => {
      return [...oldMessages, {fromSelf: true, message: msg}]
    })
  };
  
  return (
    <>
    {currentChat && (<Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
          <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => {
            const msgToFrom = msg.fromSelf ? 'sended' : 'recieved';
            const currId = uuidv4();
            return (
              <div key={currId} ref={scrollRef}>
                <div className={`message ${msgToFrom}`}>
                  <div className="content">
                    <p>
                      {msg.message || msg.msg}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>)}
  </>
  )
}

export default ChatContainer;

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;