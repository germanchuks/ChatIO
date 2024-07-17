import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext'
import {refreshIcon, optionsIcon, removeIcon } from '../utils/icons';
import { Avatar } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';


function Friends() {
  const { userID, friends, getFriendList, setChatID, setShowChat, setCurrentChatDetails } = useGlobalContext();
  const [activeOption, setActiveOption] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const containerRef = useRef(null);

  // Open chat using chatID
  const openChat = (chatID, name, email) => {
    setChatID(chatID)
    setShowChat(true);
    setCurrentChatDetails({
        email: email,
        name: name
    });
  };

  // Unfriend user
  const removeFriend = async (chatID, email) => {
    try {
        const response = await axios.post(`/remove-friend`, {userID, chatID, email})
        if (response.data.error) {
            console.log(response.data.error)
            toast.error('An error occured. Try again later')
            return;
        }
        getFriendList(userID);
        toast.success(response.data.message)
    } catch (error) {
        console.log(error)
    }
    
  }

  // Toggle friend option button
  const toggleOptionButton = (friendID) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setActiveOption((prevState) => (prevState === friendID ? null : friendID));
  };

  // Close active option menus after 4seconds
  const closeAllMenus = () => {
    setActiveOption(null);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  // Close active menu on mouse click outside
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      closeAllMenus();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeOption) {
      const id = setTimeout(() => {
        setActiveOption(null);
      }, 4000);
      setTimeoutId(id);
    } else if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [activeOption]);


  return (
    <FriendsStyled ref={containerRef}>
        <div className="friend-list-header">
            <h3>Friends</h3>
            <span 
                style={{cursor: "pointer"}}
                onClick={() => getFriendList(userID)}
                >{refreshIcon}</span>
        </div>
        
        <div className='friend-list'>
            {
              friends.length ? 
                friends.map((friend) => {
                  return (

                    <div
                      className="friend-item"
                      key={friend._id}
                    >
                        <div className="friend-avatar">
                            <Avatar sx={{ width: 30, height: 30, bgcolor: deepOrange[800] }}>{friend.friendUser[0].toUpperCase()}</Avatar>
                        </div>
                        <div
                          className="friend-details"
                          onClick={() => openChat(friend.chatID, friend.friendUser, friend.friendEmail)}
                          >
                            <span>{friend.friendUser.charAt(0).toUpperCase() + friend.friendUser.slice(1)}</span>
                            <span className='friend-details-email'>{friend.friendEmail}</span>
                        </div>
                        <div
                            onClick={() => toggleOptionButton(friend._id)} 
                            className="friend-options"
                        >
                            {optionsIcon}
                        </div>
                        {
                            activeOption === friend._id && (
                                <div className="options-box">
                                    <span 
                                        onClick={() => removeFriend(friend.chatID, friend.friendEmail)}
                                        className='delete-button'
                                    >
                                        {removeIcon}
                                    </span> 
                                    Unfriend
                                </div>
                            )
                        }
                    </div>
                )
            }) : <div className='empty-friends'> Add a friend </div>
          }
        </div>
    </FriendsStyled>
  )
}

const FriendsStyled = styled.div`

    width: 100%;
    height: 47.5%;
    overflow: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;
    color: #000;

    .friend-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        width: 100%;
        background-color: #fff;
        gap: 1rem;
        font-size: 80%;

    }

    .friend-list::-webkit-scrollbar { 
        display: none;
    }


    .friend-list {
        height: 90%;
        display: flex;
        gap: 0.5rem;
        flex-direction: column;
        overflow-y: scroll;
        box-sizing: content-box;
        -ms-overflow-style: none;
        scrollbar-width: none;

        .empty-friends {
          font-size: 70%;
          display: flex;
          height: 100%;
          justify-content: center;
          align-items: center;
          font-style: italic;
          color: #fff;
        }

        .friend-item:last-child {
          margin-bottom: 2rem;
        }
        .friend-item {
          display: flex;
          background: #ffffff; 
          padding: 0.75rem 0.5rem;
          color: #000000;
          gap: 0.75rem;
          align-items: center;
          justify-content: center;
          position: relative;
          &:hover {
            background-color: #d1cfcfb9;
          }
          transition: all 0.3s ease-in-out;
                          

            .friend-avatar {
                display: flex;
                width: 10%;
                justify-content: center;
                align-items: center;
            }

            .friend-details {
                display: flex;
                flex-direction: column;
                flex: 1;
                cursor: pointer;
                gap: 0.2rem;


                .friend-details-email {
                  font-style: italic;
                  font-size: 75%;
                }
            }

            .friend-options {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: 5%;
                cursor: pointer;
                position: relative;
        
            }
            .options-box {
                position: absolute;
                display: flex;
                align-items: center;
                gap: 0.2rem;
                top: 55px;
                right: 10px;
                z-index: 1;
                background: #ffffff;
                padding: 0.5rem;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.829);
                height: fit-content;

                .delete-button {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    padding: 0.2rem;
                    border: 1px solid #000;
                    border-radius: 50%;
                    &:hover {
                        background-color: #383838;
                    }
                }
            }
        }
    }
`

export default Friends