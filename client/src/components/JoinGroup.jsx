import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext'
import { TextField } from '@mui/material'
import { toast } from 'react-hot-toast';
import axios from 'axios';


function JoinGroup() {
 
  const { user, userID, userEmail, isJoinGroup, getGroups, setIsJoinGroup, setGroupOptionClicked } = useGlobalContext();
  const [ groupLink, setGroupLink ] = useState('');

  const closeDialog = () => {
    setGroupOptionClicked(false);
    setIsJoinGroup(false)
  }

  const proceed = async () => {
    if (!groupLink) {
        toast.error('Please enter group ID');
        return;
    }
    try {
        const response = await axios.post(`/join-group`, {
            userInfo: {
                userID,
                userName: user,
                userEmail
            },
            groupID: groupLink
        });
        if (response.data.error) {
            console.log(response.data.error)
            if (response.data.error === "You are already a member") {
                toast.error(response.data.error);

            }
            setGroupLink("");
            return;
        }
        toast.success(response.data.message)
        setGroupLink('');
        setGroupOptionClicked(false);
        setIsJoinGroup(false);
        getGroups(userID);
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <JoinGroupStyled>
        <div className="content">
            <TextField
                name="group-name"
                placeholder="Enter Group ID"
                value={groupLink}
                onChange={(event) => setGroupLink(event.target.value)}
                type={"text"}
                variant="outlined"
                autoComplete="off"
                size="medium"
                required
                style={{ background: "#fff", height: 'fit-content', width: '90%', borderRadius: '0.2rem' }}
                sx={{'& ::placeholder':{fontSize:'75%'}}}
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { fontSize: '70%' } }}
                />

        </div>
        <div className="options-button">
            <span className="cancel-button" onClick={() => closeDialog()}>
                <button>Cancel</button>
            </span>
            <span className="proceed-button" onClick={() => proceed()}>
                <button>Proceed</button>
            </span>
        </div>
    </JoinGroupStyled>
  )
}

const JoinGroupStyled = styled.div`
    position: fixed;
    left: 47.5%;
    top: 15%;
    width: 40%;
    height: 28.5%;
	background: #233142; 
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.5rem;
    padding: 1rem 0.2rem;

    .content {
        display: flex;
        justify-content: center;
        align-items: center;

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
                padding: 1rem 0.5rem;
                font-size: 60%;

            }
        }
    }
    
`

export default JoinGroup