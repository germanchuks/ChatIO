import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import io from 'socket.io-client';
import GroupChat from './GroupChat';
import { useGlobalContext } from '../context/GlobalContext';
import { toast } from 'react-hot-toast';
import {returnIcon, clearIcon, deleteIcon} from '../utils/icons';


const socket = io.connect(process.env.REACT_APP_API_URL);


function GroupChatBox() {
  
  const { userID, groupID, showGroupChat, setShowGroupChat } = useGlobalContext();
  const [allGroupMessages, setAllGroupMessages] = useState([]);
  const [ activeMembers, setActiveMembers ] = useState([]);

  const saveGroupMessages = async (data) => {
    try {
        const response = await axios.post("/store-group-message", { newMessage: data, groupID: groupID, userID: userID })
        if (response.data.error) {
            console.log(response.data.error);
            return;
        }
    } catch (error) {
        console.log(error)
    }
  }

  const getPreviousGroupMessages = async () => {
    try {
        const response = await axios.get(`/get-previous-group-messages/${groupID}/${userID}`)
        if (response.data.error) {
            console.log(response.data.error);
            if (response.data.error === "Group no longer exists") {
              toast.error(response.data.error);
            }
            return;
        }
        // console.log(response.data.messages);
        setAllGroupMessages(response.data.messages);
    } catch (error) {
        console.log(error)
    }
  }

  const clearMessage = async (deleteForAll) => {
    try {
        const response = await axios.post('/clear-group-messages', {
            userID: userID,
            groupID: groupID,
            deleteForAll: deleteForAll
        });
        if (response.data.error) {
          toast.error(response.data.error)
          return;
        }
        getPreviousGroupMessages();
        toast.success(response.data.message);
    } catch (error) {
        console.error(error);
    }
}


  const exitChat = (e) => {
    e.preventDefault();

    socket.emit('leave_chat', groupID);
    setShowGroupChat(false)
    // console.log(recipientID);

  }

  useEffect(() => {
    socket.emit("join", {chatID: groupID, userID});
    getPreviousGroupMessages();

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
    // console.log(activeMembers)
    return () => clearInterval(interval);
  }, [activeMembers]);


  return (
    <GroupChatBoxStyled>
        <div>
            <div className="control-buttons">
                <span className='back-button' onClick={exitChat}>{returnIcon} Go back</span>
                <div className="delete-buttons">
                  <span className='delete-button' onClick={() => clearMessage(false)}>{clearIcon} Clear Messages</span>
                  <span className='delete-button' onClick={() => clearMessage(true)}>{deleteIcon} Delete Messages</span>
                </div>
            </div>
            <GroupChat
                socket={socket}
                groupID={groupID}
                allGroupMessages={allGroupMessages}
                setAllGroupMessages={setAllGroupMessages}
                activeMembers={activeMembers}
                saveGroupMessages={saveGroupMessages}
            />
        </div>
    </GroupChatBoxStyled>
  )
}

const GroupChatBoxStyled = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    width: 60%;
    padding: 1rem;


    .control-buttons {
        display: flex;
        gap: 0.5rem;

        .back-button {
          padding: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          justify-content: space-between;
          color: #fff;
          border-radius: 0.5rem;
          gap: 0.2rem;
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
          width: 75%;
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
export default GroupChatBox;