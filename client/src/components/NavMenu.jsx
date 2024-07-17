import React from 'react'
import styled from 'styled-components'
import Groups from './Groups'
import { useGlobalContext } from '../context/GlobalContext'
import Friends from './Friends'

function NavMenu({ showChat, showGroupChat }) {
  const {logout, darkMode} = useGlobalContext();

  return (
    <NavMenuStyled 
      style={{
        display: !showChat && !showGroupChat ? "flex" : "none",
        backgroundColor: darkMode ? '#233142' : '#002c6a',
        color: darkMode ? '#fff' : '#000'
      }}
    >
        <Friends />
        <Groups />
    </NavMenuStyled>
  )
}

const NavMenuStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 53%;
    font-size: small;
    height: 100%;
    box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;

`
export default NavMenu