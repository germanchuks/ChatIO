import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useGlobalContext } from '../context/GlobalContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import InputEmoji from "react-input-emoji";
import { TextField, InputAdornment, IconButton } from '@mui/material';


function Chat({
    socket, chatID,
    allMessages, setAllMessages,
    saveMessages,
    activeMembers }) {
    const { user, darkMode, userID, currentChatDetails } = useGlobalContext();
    // const [message, setMessage] = useState("");
    
    const [ text, setText ] = useState("")
    

    const handleOnEnter = async (text) => {
        if (text !== "") {
            
            const addZero = (i) => {
                if (i < 10) {i = "0" + i}
                return i;
            }

            const d = new Date();
            let h = d.getHours();
            let m = addZero(d.getMinutes());

            const period = h >= 12 ? "PM" : "AM";
            h = h % 12 || 12;
            h = addZero(h);

            const data = {
                author: user.split(' ')[0],
                authorID: userID,
                message: text,
                time: `${h}:${m} ${period}`
            }

            await socket.emit("send_chat", {data, chatID});
            setAllMessages((msg) => [...msg, data]);
            
            saveMessages(data)
        }
    }



    useEffect(() => {

        const receiveChatHandler = (data) => {
            setAllMessages((msg) => [...msg, data]);
        };
        socket.on("receive_chat", receiveChatHandler);
        
        return () => {
            socket.off("receive_chat", receiveChatHandler);
        };

    }, [socket]);
   

    return (
        <ChatStyled>
            <div className="chat-header">
                <div className="title">
                    {currentChatDetails.email}
                </div>
                <div className="active-status">
                    <div className="online-icon" 
                        style={{
                            backgroundColor: activeMembers.length ? "#3ac23a" : "#f13325",
                        }}
                    ></div>
                    <div className="online-status">{activeMembers.length ? "Online" : "Offline"}</div>
                </div>
            </div>
            <div className="chat-body"
                style={{
                    backgroundColor: `${darkMode ? '#000000' : '#ffffff'}`
                }}
            >
                <ScrollToBottom className='chat-container'>
                    {allMessages.map((msg, index) => {
                        return (
                            <div
                                key={index}
                                className={`msg-item ${msg.author === user.split(' ')[0] ? 'user-msg-item' : ''}`}
                            >
                                {
                                    msg.author !== user.split(' ')[0] &&
                                    <Avatar sx={{ width: 20, height: 20, fontSize: 'small', bgcolor: deepPurple[500] }}>{msg.author[0].toUpperCase()}</Avatar>
                                }
                                <div className="msg-info">
                                    <p 
                                        className={`msg-text ${msg.message === 'Deleted Message' ? 'deleted' : ''}`}
                                    >
                                        {msg.message}
                                    </p>
                                    <div className="msg-meta">
                                        <span>
                                            <b>
                                                {msg.author !== user.split(' ')[0] ? (
                                                msg.author.charAt(0).toUpperCase() + msg.author.slice(1)
                                                ) : (
                                                <div style={{
                                                    width: '20px'
                                                }}></div>
                                                )}
                                            </b>
                                        </span>
                                        <span>{msg.time}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <InputEmoji
                    value={text}
                    onChange={setText}
                    cleanOnEnter
                    onEnter={handleOnEnter}
                    placeholder="Type a message"
                    fontSize={'75%'}
                    theme={ darkMode ? 'dark' : 'light'}
                />
            </div>
        </ChatStyled>
    )
}

const ChatStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 80vh;
    margin-block: 0.5rem;
    font-size: 85%;

    .chat-header {
        display: flex;
        height: 10%;
        align-items: center;
        padding: 1rem;
        color: #fff;
        border-radius: 15px 15px 0 0;
        background-color: #002c6a;
        justify-content: space-between;

        .title {
            display: flex;
            align-items: center;
            font-size: smaller;
        }
        .active-status {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            font-size: medium;

            .online-icon {
                border-radius: 50%;
                width: 10px;
                height: 10px;
            }

            .online-status {
                font-size: small;
            }
        }
    }

    .chat-body {
        display: flex;
        height: 85%;
        flex-direction: column;
        padding: 0.5rem 0.2rem 1rem 0.6rem;
        gap: 1rem;
        font-size: 80%;

        .chat-container {
            height: 100%;
            
            .user-msg-item {
                display: flex;
                justify-content: flex-end;
                width: auto;
                margin-right: 0.5rem;

                .msg-info {
                    background-color: #f5f5f5;

                }
                
            }

            .msg-item {
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.3rem;
                display: flex;
                align-items: end;

            }
            .msg-info {
                background-color: #a3a1a1;
                border: 1px solid #ddd;
                width: fit-content;
                border-radius: 0.3rem;
                min-width: 15%;
                padding: 0.5rem 0.8rem 0.3rem;

                .msg-text {
                    background-color: transparent;
                    color: #000;
                    width: 100%;
                    padding-bottom: 0.75rem;
                    border-radius: 10px;
                }

                .deleted {
                    font-style: italic;
                    font-size: smaller;
                }
        
                .msg-meta {
                    display: flex;
                    gap: 0.5rem;
                    font-size: 70%;
                    justify-content: space-between;
                }
            }
        }


    }

    .chat-footer {
        display: flex;
        justify-content: center;
        flex-direction: column;
        height: 10%;
        background-color: #002c6a;
    }
`

export default Chat;