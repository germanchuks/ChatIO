import React from 'react'
import styled from 'styled-components'
import PendingRequests from './PendingRequests'
import SentRequests from './SentRequests'
import { useGlobalContext } from '../context/GlobalContext'

function SideMenu() {
  const { darkMode } = useGlobalContext();
  return (
    <SideMenuStyled style={{
        backgroundColor: darkMode ? "#233142" : "#ffffffdd",
        color: darkMode ? "#fff" : "#000000",
        border: darkMode ? "none" : "2px solid #000"
    }}>
        <div className="requests">
            <PendingRequests />
            <SentRequests />
        </div>
    </SideMenuStyled>
  )
}

const SideMenuStyled = styled.div`
    position: fixed;
    right: 0;
    top: 15%;
    width: 25%;
    height: 85%;
    font-size: 70%;
    z-index: 1000;
    transition: all 0.5s ease-in-out;
    color: #ffffff;

    .requests {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
    }
`

export default SideMenu