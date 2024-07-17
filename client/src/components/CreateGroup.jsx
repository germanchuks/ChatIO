import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext'
import { TextField } from '@mui/material'
import { toast } from 'react-hot-toast';
import axios from 'axios';


function CreateGroup() {
 
  const { user, userEmail, userID, darkMode, getGroups, setIsCreateGroup, setGroupOptionClicked, friends } = useGlobalContext();
  const [ groupName, setGroupName ] = useState('');
  const [ step, setStep ] = useState(1);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const closeDialog = () => {
    if (step === 1) {
        setGroupOptionClicked(false);
        setIsCreateGroup(false)
    } else {
        setStep(1)
    }
  }

  const proceed = async () => {
    if (step === 1) {
        if (!groupName) {
            toast.error('Please input group name');
            return;
        } else {
            setStep(2)
        }
    } else {
        try {
            const response = await axios.post(`/create-group`, {
                groupName: groupName,
                members: [
                    {
                        userID: userID,
                        userName: user,
                        userEmail: userEmail
                    },
                    ...selectedFriends
                ],
                admin: userID
            });
            if (response.data.error) {
                console.log(response.data.error)
                return;
            }
            console.log(response.data.group)
            setSelectedFriends([])
            setGroupOptionClicked(false);
            setIsCreateGroup(false);
            toast.success(response.data.message)
            getGroups(userID)
        } catch (error) {
            console.log(error)
        }
    }
  }

  const toggleFriendClick = (friendID) => {
    setSelectedFriends((prevSelectedFriends) => {
        const friend = friends.find(f => f.friendID === friendID);
        const isAlreadySelected = prevSelectedFriends.some(f => f.userID === friendID);

        if (isAlreadySelected) {
            return prevSelectedFriends.filter(f => f.userID !== friendID);
        } else {
            return [
                ...prevSelectedFriends,
                {
                    userID: friend.friendID,
                    userName: friend.friendName,
                    userEmail: friend.friendEmail
                }
            ];
        }
    });
  };

  return (
    <CreateGroupStyled style={{
        background: darkMode ? "#233142" : "#fff",
        border: darkMode ? "none" : "1px solid #000",
        color: darkMode ? "#fff" : "#000",
    }}>
        <div className="content">
        {
            step === 1 ? (
            <TextField
                name="group-name"
                placeholder="Enter Group Name"
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                type={"text"}
                variant="outlined"
                autoComplete="off"
                autoFocus
                size="medium"
                required
                style={{ background: "#fff", height: 'fit-content', width: '90%', borderRadius: '0.2rem' }}
                sx={{'& ::placeholder':{fontSize:'75%'}}}
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { fontSize: '70%' } }}
                />
            ) : (
                <div className="friends-list-box">
                    <span>Select friends to add to group:</span>
                    <div className="friends">
                        {friends.map((friend) => {
                            const isSelected = selectedFriends.some(f => f.userID === friend.friendID);

                            return (
                                <div
                                    key={friend.friendID}
                                    className={`friend-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleFriendClick(friend.friendID)}
                                >
                                    <span>{friend.friendEmail}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
        </div>
        <div className="options-button">
            <span className="cancel-button" onClick={() => closeDialog()}>
                <button>{ step === 1 ? 'Cancel' : 'Go back'}</button>
            </span>
            <span className="proceed-button" onClick={() => proceed()}>
                <button>{ step === 1 ? 'Next' : 'Proceed'}</button>
            </span>
        </div>
    </CreateGroupStyled>
  )
}

const CreateGroupStyled = styled.div`
    position: fixed;
    left: 47.5%;
    top: 15%;
    width: fit-content;
    min-width: 30%;
    height: 28.5%;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.5rem;
    font-size: 70%;
    padding: 1rem 0.2rem;

    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        

        .friends-list-box {
            display: flex;
            width: 100%;
            height: 100%;
            flex-direction: column;

            span {
                padding: 0.5rem;
            }
            .friends {
                display: grid;
                grid-template-columns: repeat(2, 1fr); /* Two columns */
                gap: 0.5rem;
                
                gap: 0.2rem;

                .friend-item {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #000;
                    font-size: 60%;
                    &:hover {
                        background-color: #131111c7;
                    }
                }
            
                .selected {
                    border: 2px solid #000;
                }
            }
        }

    }

    .options-button {
        display: flex;
        width: 100%;
        gap: 1rem;
        justify-content: space-evenly;
        align-items: center;
        padding: 0.5rem;

        span {
            background-color: #10141a;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40%;
            &:hover {
                background-color: #ffffff68;
            }
            cursor: pointer;
            border-radius: 0.5rem;

            button {
                background: none;
                border: none;
                width: 100%;
                height: 100%;
                color: #fff;
                padding: 0.7rem;
                font-size: 62%;


            }
        }
    }
    
`

export default CreateGroup