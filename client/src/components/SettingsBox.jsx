import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext'
import { renameIcon, passwordIcon, signOutIcon } from '../utils/icons'

function SettingsBox() {

  const { darkMode, logout } = useGlobalContext();

  const settingOptions = [
    {
        id: 1,
        title: 'Change Display Name',
        onClick: () => {
            console.log('Change Name clicked');
        },
        icon: renameIcon

    },
    {
        id: 2,
        title: 'Update Password',
        onClick: () => {
            console.log('Update Password clicked');
        },
        icon: passwordIcon
    },
    {
        id: 3,
        title: 'Sign Out',
        onClick: () => {
            logout();
        },
        icon: signOutIcon
    } 
  ]

  return (
    <SettingsStyled style={{
        backgroundColor: darkMode ? "#233142" : "#ffffffbc",
        color: darkMode ? "#ffffff" : "#000000",
        border: darkMode ? "none" : "1px solid #000"
    }}>
        <div className="header">
            Settings
        </div>
        <div className="setting-container">
            {
                settingOptions.map((option) => {
                    return (
                        <div 
                            // style={{
                            //     backgroundColor: darkMode ? "#233346d1" : "#ffffffcc",
                            // }}
                            onClick={option.onClick}
                            className="setting-item"
                            key={option.id}
                        >
                            <span className='setting-logo'>{option.icon}</span>
                            <div className="setting-name">{option.title}</div>
                        </div>
                    )
                })
            }
        </div>
    </SettingsStyled>
  )
}

const SettingsStyled = styled.div`
    position: fixed;
    right: 0;
    top: 12.5%;
    width: fit-content;
    height: fit-content;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    font-size: 70%;
    border-radius: 0.5rem;

    .header {
        padding: 0.6rem;
        border-bottom: 1px solid #000;
    }

    .setting-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.2rem;
        font-size: 80%;

        .setting-item {
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            gap: 0.5rem;
            justify-content: flex-start;
            width: 100%;
            padding: 0.4rem 0.6rem;
            &:hover {
                background-color: #043a85a9;
            }
            transition: all 0.3s linear;
        }
        .setting-item:last-child {
            margin-top: 1rem;
            border-top: 1px solid #000;
            font-weight: 700;
            padding: 0.7rem;
            justify-content: flex-start;
            border-radius: 0 0 0.5rem 0.5rem;
        }
    }
`

export default SettingsBox