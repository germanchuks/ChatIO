import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext'
import { TextField } from '@mui/material'
import axios from 'axios';
import toast from 'react-hot-toast';


function ChangeGroupName() {
    const { userID, groupID, setShowNewGroupName, getGroups, showNewGroupName } = useGlobalContext();
      
    const [newName, setNewName] = useState("");

    const closeDialog = () => {
        setShowNewGroupName(false);
    }

    const renameGroup = async () => {
        try {
            const response = await axios.post('/rename-group', { userID, groupID, newName })
            if (response.data.error) {
                toast.error(response.data.error);
                return;
            }
            toast.success(response.data.message)
            setShowNewGroupName(false);
            getGroups(userID);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ChangeGroupNameStyled>
            <TextField
                    name="new-name"
                    placeholder="Enter New Name"
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    type={"text"}
                    variant="outlined"
                    autoComplete="off"
                    autoFocus
                    size="small"
                    required
                    style={{ background: "#fff", height: 'fit-content', width: '90%', borderRadius: '0.2rem' }}
                    sx={{'& ::placeholder':{fontSize:'75%'}}}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ style: { fontSize: '60%' } }}
                    />
                    <div className="options-button">
                        <span className="cancel-button" onClick={() => closeDialog()}>
                            <button>Cancel</button>
                        </span>
                        <span className="proceed-button" onClick={() => renameGroup()}>
                            <button>Proceed</button>
                        </span>
                    </div>
            </ChangeGroupNameStyled>
    )
}

const ChangeGroupNameStyled = styled.div`
    position: fixed;
    left: 55.5%;
    top: 15%;
    width: fit-content;
	background: #233142; 
    z-index: 1000;
    font-size: 70%;
    transition: transform 0.3s ease-in-out;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.5rem;
    padding: 1rem 0.2rem;

    .options-button {
        display: flex;
        width: 100%;
        gap: 0.2rem;
        justify-content: space-evenly;
        align-items: center;
        padding: 0.5rem;


        span {
            background-color: #10141a;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50%;
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
                font-size: 60%;

                color: #fff;
                padding: 0.75rem 0.5rem;

            }
        }
    }
`

export default ChangeGroupName