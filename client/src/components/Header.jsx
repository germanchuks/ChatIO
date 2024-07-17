import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/GlobalContext';
import AddFriend from './AddFriend';
import { Avatar } from '@mui/material';
import { blue } from '@mui/material/colors';
import Switch from "react-switch";
import axios from 'axios';
import toast from 'react-hot-toast';
import { settingsIcon } from '../utils/icons'


function Header() {
  const {user, userID, darkMode, setDarkMode, setShowSearch, showSettings, setShowSettings } = useGlobalContext();

  const saveTheme = async (data) => {
    try {
      const response = await axios.post(`/update-theme`, { userID: userID, selectedTheme: data});
      if (response.data.error) {
        toast.error(response.data.error);
        return
      }
      toast.success(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  const handleSwitchChange = (checked) => {
    setDarkMode(checked);
    if (darkMode) {
      saveTheme('light')
    } else {
      saveTheme('dark')
    }
  };

  return (
    <HeaderStyled 
      onClick={() => setShowSearch(false)}
      style={{
        backgroundColor: darkMode ? '#233142' : '#002c6a'
      }}>
      <div className="user-bar">
        <div className="user-details">
          <Avatar sx={{ width: 30, height: 30, bgcolor: blue[200] }}>{user[0].toUpperCase()}</Avatar>
          <div className="user-name">{user.charAt(0).toUpperCase() + user.slice(1)}</div>
        </div>
        

      </div>
      <div className="settings-bar">
        <AddFriend />
        <div className="user-theme-switch">
          <span>{darkMode ? 'Dark' : 'Light'} Mode</span>
          <Switch onChange={handleSwitchChange} checked={darkMode} height={15} width={40} handleDiameter={15}/>
        </div>
        <div onClick={() => toggleSettings()} className="settings">
          {settingsIcon}
        </div>
      </div>
    </HeaderStyled>
  )
}

const HeaderStyled = styled.header`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    height: 12%;
    width: 100%;
    transition: all 0.2s linear;

    
    .settings-bar {
      display: flex;
      flex: 1;
      padding: 1rem;
      justify-content: space-between;

      .user-theme-switch {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: small;
        gap: 0.3rem;
        font-size: 70%;
      }

      .settings {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #ffffff7f;
        cursor: pointer;
        &:hover {
          color: #fff;
        }
        transition: all 0.2s linear;
      }

    }
  
    .user-bar {
      display: flex;
      align-items: center;
      font-size: small;
      justify-content: space-between;
      width: 35%;
      padding-inline: 1rem;

      .user-details {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
    }

`

export default Header;