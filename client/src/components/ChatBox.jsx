import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {returnIcon, clearIcon, deleteIcon} from '../utils/icons';
import axios from 'axios';
import io from 'socket.io-client';
import Chat from './Chat';
import { useGlobalContext } from '../context/GlobalContext';
import { toast } from 'react-hot-toast';


const socket = io.connect(process.env.REACT_APP_API_URL);


function ChatBox() {
  
  const { userID, chatID, showChat, setShowChat } = useGlobalContext();
  const [allMessages, setAllMessages] = useState([]);
  const [ activeMembers, setActiveMembers ] = useState([]);

  const saveMessages = async (data) => {
    try {
        const response = await axios.post("/store-message", { newMessage: data, chatID: chatID, userID: userID })
        if (response.data.error) {
            console.log(response.data.error);
            return;
        }
    } catch (error) {
        console.log(error)
    }
  }

  const getPreviousMessages = async () => {
    try {
        const response = await axios.get(`/get-previous-messages/${chatID}/${userID}`)
        if (response.data.error) {
            console.log(response.data.error);
            return;
        }
        // console.log(response.data.messages);
        setAllMessages(response.data.messages);
    } catch (error) {
        console.log(error)
    }
  }

  const clearMessage = async (deleteForAll) => {
    try {
        const response = await axios.post('/clear-messages', {
            userID: userID,
            chatID: chatID,
            deleteForAll: deleteForAll
        });
        if (response.data.error) {
          toast.error(response.data.error)
          return;
        }
        getPreviousMessages();
        toast.success(response.data.message);
    } catch (error) {
        console.error(error);
    }
}


  const exitChat = (e) => {
    e.preventDefault();

    socket.emit('leave_chat', chatID);
    setShowChat(false)
    // console.log(recipientID);

  }

  useEffect(() => {
    socket.emit("join", {chatID, userID});
    getPreviousMessages();

    // eslint-disable-next-line
  }, [])

  // Keep track receiver actives status
  const getActiveMembers = () => {
    socket.on("current_users", (data) => {
        setActiveMembers(data.filter(item => item.userID !== userID))
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getActiveMembers()
    }, 1000);

    getActiveMembers();

    return () => clearInterval(interval);
  }, [activeMembers]);


  return (
    <ChatBoxStyled>
        <div>
            <div className="control-buttons">
                <span className='back-button' onClick={exitChat}>{returnIcon} Go back</span>
                <div className="delete-buttons">
                  <span className='delete-button' onClick={() => clearMessage(false)}>{clearIcon} Clear Messages</span>
                  <span className='delete-button' onClick={() => clearMessage(true)}>{deleteIcon} Delete Messages</span>
                </div>
            </div>
            <Chat
                socket={socket}
                chatID={chatID}
                allMessages={allMessages}
                setAllMessages={setAllMessages}
                activeMembers={activeMembers}
                saveMessages={saveMessages}
            />
        </div>
    </ChatBoxStyled>
  )
}

const ChatBoxStyled = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    width: 70%;
    padding: 1.5rem;


    .control-buttons {
        display: flex;
        gap: 1rem;

        .back-button {
          padding: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          justify-content: space-between;
          color: #fff;
          border-radius: 0.5rem;
          gap: 0.5rem;
          width: 20%;
          font-size: 55%;
          background-color: #002c6a;
          cursor: pointer;
          &:hover {
            background-color: #002c6a89;
          }
        }

        .delete-buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 80%;
          gap: 0.5rem;

          .delete-button {
            padding: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            justify-content: space-between;
            color: #fff;
            border-radius: 0.5rem;
            gap: 0.5rem;
            font-size: 55%;
            background-color: #002c6a;
            cursor: pointer;
            &:hover {
              background-color: #6a001781;
            }
          }
        }
        button {
            padding: 0.2rem;
        }
    }

`
export default ChatBox;