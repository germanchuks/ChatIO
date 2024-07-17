import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext'
import {refreshIcon, optionsIcon, removeIcon, exitIcon, renameIcon } from '../utils/icons';
import { Avatar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import axios from 'axios';
import { toast } from 'react-hot-toast';


function Groups() {
  const { userID, groups, getGroups, setGroupID, setShowNewGroupName, showNewGroupName, setShowGroupChat, setCurrentChatDetails } = useGlobalContext();
  const [activeOption, setActiveOption] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const containerRef = useRef(null);

  // Open chat using groupID
  const openChat = (groupID, name, members, admin) => {
    setGroupID(groupID)
    setShowGroupChat(true);
    setCurrentChatDetails({
        name: name,
        members: members,
        admin: admin
    });
  };

  const toggleNewGroupName = (id) => {
    setShowNewGroupName(!showNewGroupName);
    setGroupID(id);
  }

  // Ungroup user
  const deleteGroup = async (id) => {
    try {
        const response = await axios.post(`/delete-group`, {userID, id})
        if (response.data.error) {
            console.log(response.data.error)
            toast.error('An error occured. Try again later')
            return;
        }
        getGroups(userID);
        toast.success(response.data.message)
    } catch (error) {
        console.log(error)
    } 
  }

  // Leave group
  const leaveGroup = async (groupID) => {
    try {
        const response = await axios.post('/leave-group', {userID, groupID})
        if (response.data.error) {
            console.log(response.data.error)
            toast.error('An error occured. Try again later')
            return;
        }
        getGroups(userID);
        toast.success(response.data.message)
    } catch (error) {
        console.log(error)
    } 
  }

  // Toggle group option button
  const toggleOptionButton = (groupID) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setActiveOption((prevState) => (prevState === groupID ? null : groupID));
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
    <GroupsStyled ref={containerRef}>
        <div className="group-list-header">
            <h3>Groups</h3>
            <span 
                style={{cursor: "pointer"}}
                onClick={() => getGroups(userID)}
                >{refreshIcon}</span>
        </div>
        
        <div className='group-list'>
            {
              groups.length ?
                groups.map((group) => {
                  return (

                    <div className="group-item" key={group._id}>
                        <div className="group-avatar">
                            <Avatar sx={{ width: 30, height: 30, bgcolor: deepPurple[800] }}>{group.groupName[0].toUpperCase()}</Avatar>
                        </div>
                        <div
                          className="group-details"
                          onClick={() => openChat(group._id, group.groupName, group.members, group.admin)}
                        >
                          <span>{group.groupName.charAt(0).toUpperCase() + group.groupName.slice(1)}</span>
                        </div>
                        <div
                            onClick={() => toggleOptionButton(group._id)} 
                            className="group-options"
                        >
                            {optionsIcon}
                        </div>
                        {
                            activeOption === group._id && (
                                <div className='options-box'>
                                  <div className="option-item">
                                    <span 
                                        onClick={() => leaveGroup(group._id)}
                                        className='option-button'
                                    >
                                      {exitIcon}
                                    </span> 
                                    Leave
                                  </div>
                                  {
                                    group.admin.includes(userID) && (
                                      <>
                                        <div className="option-item">
                                          <span 
                                            onClick={() => deleteGroup(group._id)}
                                            className='option-button'
                                          >
                                            {removeIcon}  
                                          </span> 
                                          Delete
                                        </div>
                                        <div className="option-item">
                                           <span 
                                            onClick={() => toggleNewGroupName(group._id)}
                                            className='option-button'
                                          >
                                            {renameIcon}  
                                          </span> 
                                          Rename
                                        </div>
                                      </>
                                    )
                                  }
                                </div>
                            )
                        }
                    </div>
                )
            }) : <div className='empty-group'>Create or join a group</div>
          }
        </div>
        
    </GroupsStyled>
  )
}

const GroupsStyled = styled.div`

  width: 100%;
  height: 47.5%;
  overflow: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  position: relative;
  color: #000;

  .group-list-header {
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

  .group-list::-webkit-scrollbar { 
      display: none;
  }


  .group-list {
    height: 90%;
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    overflow-y: scroll;
    box-sizing: content-box;
    -ms-overflow-style: none;
    scrollbar-width: none;

    .empty-group {
      font-size: 70%;
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
      font-style: italic;
      color: #fff;
    }
    .group-item {
      display: flex;
      background: #ffffff; 
      padding: 0.75rem 0.5rem;
      color: #000000;
      gap: 0.75rem;
      position: relative;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: #d1cfcfb9;
      }
      transition: all 0.3s ease-in-out;

      .group-avatar {
        display: flex;
        width: 10%;
        justify-content: center;
        align-items: center;
      }

      .group-details {
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .group-options {
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
        flex-direction: column;
        align-items: center;
        top: 55px; 
        right: 10px; 
        z-index: 1; 
        background: #ffffff;
        padding: 0.5rem;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.829);
        height: fit-content;

        .option-item:last-child{
          border-bottom: none;
          padding-bottom: 0;
        }
        .option-item {
          display: flex;
          width: 100%;
          padding-top: 0.5rem;
          justify-content: space-between;
          align-items: center;
          border-bottom: 0.7px solid #383838;
          padding-bottom: 0.5rem;
          gap: 0.2rem;

          .option-button {
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
              
  }
`

export default Groups