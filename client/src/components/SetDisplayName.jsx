import React, { useState } from 'react'
import { TextField } from '@mui/material'
import styled from 'styled-components';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalContext';
import { toast } from 'react-hot-toast';


function SetDisplayName() {

    const { setUser, user, userID, darkMode, setShowChangeUsername, showChangeUsername } = useGlobalContext()
    const [username, setUsername] = useState('')

    const proceed = async () => {
        if (user === username) {
            toast.error('New username must be different from current!')
            return;
        }
        try {
            const response = await axios.put(`/update-username/${userID}`, { newname: username} );

            if (response.data.error) {
                toast.error('Error occured. Try again later!')
                return;
            }
            setUser(response.data.username)
            toast.success('New name set!')
            setUsername("")
            setShowChangeUsername(false);
        } catch (error) {
            console.log(error);
        }  
    }

    const closeDialog = () => {
        setUsername('')
        setShowChangeUsername(false)
    }

    return (
        <SetDisplayNameStyled
            style={{
            background: darkMode ? "#233142" : "#fff",
            border: darkMode ? "none" : "1px solid #000",
            color: darkMode ? "#fff" : "#000",
        }}>
            <div className="content">
                <TextField
                    name="newname"
                    placeholder="Enter New Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
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
            </div>
            <div className="options-button">
                <span className="cancel-button" onClick={() => closeDialog()}>
                    <button>Cancel</button>
                </span>
                <span className="proceed-button" onClick={() => proceed()}>
                    <button>Proceed</button>
                </span>
            </div>
        </SetDisplayNameStyled>
    )
}

const SetDisplayNameStyled = styled.div`
   position: fixed;
    left: 47.5%;
    top: 15%;
    width: fit-content;
    min-width: 30%;
    height: fit-content;
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
        flex-direction: column;
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

export default SetDisplayName