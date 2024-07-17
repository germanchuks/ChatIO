import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useGlobalContext } from '../context/GlobalContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import { optionsIcon, exitIcon } from '../utils/icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import InputEmoji from "react-input-emoji";


function GroupChat({
    socket, groupID,
    allGroupMessages, setAllGroupMessages,
    saveGroupMessages,
    activeMembers }) {
    const { user, userID, darkMode, setDarkMode, currentChatDetails, fetchGroupDetail } = useGlobalContext();
    const [ openMembers, setOpenMembers ] = useState(false);
    const [ displayID, setDisplayID ] = useState(false);
    // const [message, setMessage] = useState("");
    const [ text, setText ] = useState("")
    

    const groupName = currentChatDetails.name;
    const groupMembers = currentChatDetails.members;
    const groupAdmin = currentChatDetails.admin;
    
    const toggleMembersList = () => {
      setOpenMembers(!openMembers);
    }

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

            await socket.emit("send_chat", {data, chatID: groupID});
            setAllGroupMessages((msg) => [...msg, data]);
            
            saveGroupMessages(data)
        }
    }

    const removeGroupMember = async (memberID) => {
      try {
        const response = await axios.post('/remove-member', { userID, memberID, groupID});
        if (response.data.error) {
          toast.error(response.data.error)
          return;
        }
        toast.success(response.data.message);
        fetchGroupDetail(groupID);
      } catch (error) {
        console.log(error)
      }
    }

    const makeAdmin = async (memberID) => {
      try {
        const response = await axios.post('/make-admin', { userID, memberID, groupID });
        if (response.data.error) {
          toast.error(response.data.error)
          return;
        }
        toast.success(response.data.message);
        fetchGroupDetail(groupID) 
      } catch (error) {
        console.log(error)
      }
    }

    const removeAdmin = async (memberID) => {
      try {
        const response = await axios.post('/remove-admin', { userID, memberID, groupID });
        if (response.data.error) {
          toast.error(response.data.error);
          return;
        } 
        toast.success(response.data.message);
        fetchGroupDetail(groupID) 
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {

        const receiveChatHandler = (data) => {
            setAllGroupMessages((msg) => [...msg, data]);
        };
        socket.on("receive_chat", receiveChatHandler);
        
        return () => {
            socket.off("receive_chat", receiveChatHandler);
        };

    }, [socket]);
   

    return (
        <GroupChatStyled>
            <div className="chat-header">
                <div className="title">
                    {groupName}
                </div>
                <div className="group-id-info">
                  { 
                    groupAdmin.some(item => item === userID) && (
                      <div className="display-id" onClick={() => setDisplayID(!displayID)}>
                        { displayID ? "Hide ID" : "Show ID"}
                      </div>
                    )
                  }
                  { displayID && <div className='hidden-id'>{groupID}</div> }
                </div>
                <div className="active-status" >
                    <div style={{cursor: "pointer"}} onClick={() => toggleMembersList()}>{optionsIcon}</div>
                    { openMembers && (
                      <div className="members-container">
                        <div className="members-title">
                          <div className="members-label">Group Members</div>
                          <div className="total-members">{groupMembers.length} members</div>
                        </div>
                      {groupMembers.map((member) => {
                        return (
                          <div className="member-item" key={member.memberID}>
                            <div className='member-item-details'>
                              <>
                                <div className="online-icon" 
                                  style={{
                                      backgroundColor: activeMembers.some(item => item.userID === member.memberID) || userID === member.memberID ? "#3ac23a" : "#f13325",
                                  }}
                                ></div>
                                <div className="member-email">
                                  { userID === member.memberID ? 'me' : member.memberEmail }
                                </div>
                                {
                                  groupAdmin.some(item => item === member.memberID) && <span className="admin-tag">(admin)</span>
                                }
                              </>
                            </div>
                            {
                              groupAdmin.some(item => item === userID) && member.memberID !== userID && (
                              <div className='edit-member'>
                                <span className="remove-member" onClick={() => removeGroupMember(member.memberID)}>
                                  remove
                                </span>
                                {
                                  !groupAdmin.includes(member.memberID) ? (
                                    <span className="make-admin" onClick={() => makeAdmin(member.memberID)}>
                                      make admin
                                    </span>
                                  ) : (
                                    <span className="remove-admin" onClick={() => removeAdmin(member.memberID)}>
                                      remove admin
                                    </span>
                                  )
                                }
                              </div>
                              )
                            }
                          </div>
                        )
                      })}
                    </div>
                    )}
                    
                </div>
            </div>
            <div className="chat-body"
              onClick={() => setOpenMembers(false)}
              style={{
                backgroundColor: `${darkMode ? '#000000' : '#ffffff'}`
              }}
              >
                <ScrollToBottom className='chat-container'>
                    {allGroupMessages.map((msg, index) => {
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
                                  <span className="msg-sender"><b>{msg.author.charAt(0).toUpperCase() + msg.author.slice(1)}</b></span>
                                  <span className="msg-time">{msg.time}</span>  
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
        </GroupChatStyled>
    )
}

const GroupChatStyled = styled.div`
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

        .group-id-info {

          .display-id {
            cursor: pointer;
            padding: 0.2rem;
            font-size: small;
            border-radius: 10px;
            display: flex;
            color: #fff;
            background-color: #000000;
            justify-content: center;
            align-items: center;
            &:hover {
              background-color: #000000bc;
            }
          }
          .hidden-id {
            font-size: small;
          }
        }
        .active-status {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            font-size: medium;
            position: relative;

            .online-icon {
                border-radius: 50%;
                width: 10px;
                height: 10px;
            }

            .online-status {
                font-size: small;
            }

            .members-container {
              position: fixed;
              z-index: 1;
              color: #020202;
              background-color: #fff;
              right: 10%;
              top: 20%;
              display: flex;
              flex-direction: column;
              gap: 0.1rem;
              border-radius: 5px;
              font-size: 70%;
              border: 1px solid #000;
              
              .members-title {
                display: flex;
                justify-content: space-between;
                font-size: smaller;
                color: #fff;
                background-color: #002c6a;
                padding: 0.2rem;
                border-bottom: 1px solid #000;
              }

              .member-item:last-child {
                border-bottom: none;
              }
              .member-item {
                border-bottom: 1px solid;
                padding: 0.5rem;
                display: flex;
                gap: 0.3rem;
                flex-direction: column;

                .admin-tag {
                  padding: 0;
                  font-style: italic;
                }

                .member-item-details {
                  display: flex;
                  gap: 0.2rem;

                  align-items: center;
                }

                .edit-member {
                  display: flex;
                  align-items: center;
                  justify-content: space-evenly;
                  font-size: 70%;

                  span {
                    font-style: italic;
                    text-decoration: underline;
                    cursor: pointer;
                  }
                }
              }
            }
        }
    }

    .chat-body {
        display: flex;
        height: 85%;
        flex-direction: column;
        padding: 0.4rem 0.2rem 1rem 0.6rem;
        gap: 1rem;
        font-size: 75%;


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
                border-radius: 10px;
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
                    font-size: 65%;
                    justify-content: space-between;
                }
            }
        }


    }

    .chat-footer {
        display: flex;
        justify-content: center;
        height: 10%;
        background-color: #002c6a;
        border-radius: 0 0 15px 15px;

    }
`

export default GroupChat;