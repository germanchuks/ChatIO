import React, { useState } from 'react'
import styled from 'styled-components';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

function ChangePassword() {

    const { userID, logout, setShowChangePassword, darkMode } = useGlobalContext();
    const navigate = useNavigate()

    const [currentStep, setCurrentStep] = useState(1);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState({
        oldpassword: false,
        newpassword: false,
        confirm: false
    });

    // Handle password visibility toggle
    const handleClickShowPassword = (fieldName) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [fieldName]: !prevState[fieldName],
        }));
    };

    const proceed = async () => {
        // Confirm current password
        if (currentStep === 1) {
            try {
                const checkIsPassword = await axios.put(`/update-password/${userID}`, {
                    password: oldPassword,
                    step: currentStep
                });

                if (checkIsPassword.data.error) {
                    toast.error(checkIsPassword.data.error);
                    return;
                }
                setCurrentStep(2);
            } catch (error) {
                toast.error('Error verifying current password.');
            }
        }

        // Submit new password
        if (currentStep === 2) {
            if (newPassword !== confirmNewPassword) {
                toast.error("Passwords do not match!");
                return;
            }

            try {
                const submitNew = await axios.put(`/update-password/${userID}`, {
                    newpassword: newPassword,
                    step: 2
                });

                if (submitNew.data.error) {
                    toast.error(submitNew.data.error);
                    return;
                }
                toast.success(submitNew.data.message);
                setShowChangePassword(false);
                
                setTimeout(() => {
                    toast.success('Please log in with your updated password.');
                    logout();
                    navigate('/');
                }, 2000);
            } catch (error) {
                toast.error('Error updating password.');
            }
        }
    };


    const closeDialog = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowChangePassword(false);
    };

    return (
        <ChangePasswordStyled style={{
            background: darkMode ? "#233142" : "#fff",
            border: darkMode ? "none" : "1px solid #000",
            color: darkMode ? "#fff" : "#000",
        }}>
                {currentStep === 1 && (
                    <div className='content'>
                        <TextField
                            name="oldpassword"
                            placeholder="Current Password"
                            value={oldPassword}
                            onChange={(event) => setOldPassword(event.target.value)}
                            type={showPassword.oldpassword ? "text" : "password"}
                            variant="outlined"
                            autoComplete="off"
                            autoFocus
                            size="medium"
                            required
                            style={{ background: "#fff", height: 'fit-content', width: '90%', borderRadius: '0.2rem' }}
                            sx={{'& ::placeholder':{fontSize:'75%'}}}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickShowPassword('oldpassword')}
                                            edge="end"
                                        >
                                            {showPassword.oldpassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <div className="options-button">
                            <span className="cancel-button" onClick={() => closeDialog()}>
                                <button>Cancel</button>
                            </span>
                            <span className="proceed-button" onClick={() => proceed()}>
                                <button>Next</button>
                            </span>
                        </div>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className='content'>
                        <TextField
                            name="newpassword"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            type={showPassword.newpassword ? "text" : "password"}
                            variant="outlined"
                            autoComplete="off"
                            autoFocus
                            size="medium"
                            required
                            style={{ background: "#fff", height: 'fit-content', width: '90%', borderRadius: '0.2rem' }}
                            sx={{'& ::placeholder':{fontSize:'75%'}}}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickShowPassword('newpassword')}
                                            edge="end"
                                        >
                                            {showPassword.newpassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            name="confirm"
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(event) => setConfirmNewPassword(event.target.value)}
                            type={showPassword.confirm ? "text" : "password"}
                            variant="outlined"
                            autoComplete="off"
                            autoFocus
                            size="medium"
                            required
                            style={{ background: "#fff", height: 'fit-content', width: '90%', borderRadius: '0.2rem' }}
                            sx={{'& ::placeholder':{fontSize:'75%'}}}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickShowPassword('confirm')}
                                            edge="end"
                                        >
                                            {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <div className="options-button">
                            <span className="cancel-button" onClick={() => closeDialog()}>
                                <button>Cancel</button>
                            </span>
                            <span className="proceed-button" onClick={() => proceed()}>
                                <button>Proceed</button>
                            </span>
                        </div>
                    </div>
                )}
        </ChangePasswordStyled>
    )
}

const ChangePasswordStyled = styled.div`
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
        gap: 0.4rem;
        

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

export default ChangePassword