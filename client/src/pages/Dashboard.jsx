import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NavMenu from '../components/NavMenu';
import SideMenu from '../components/SideMenu';
import Header from '../components/Header';
import { useGlobalContext } from '../context/GlobalContext';
import { menuIcon } from '../utils/icons';
import ChatBox from '../components/ChatBox';
import GroupChatBox from '../components/GroupChatBox';
import CreateGroup from '../components/CreateGroup';
import JoinGroup from '../components/JoinGroup';
import ChangeGroupName from '../components/ChangeGroupName';
import SuggestionList from '../components/SuggestionList';
import SettingsBox from '../components/SettingsBox';
import SetDisplayName from '../components/SetDisplayName';
import ChangePassword from '../components/ChangePassword';

function Dashboard() {

  const { 
    showChat, 
    userID, 
    getFriendList, 
    getPendingRequests, 
    getGroups,
    showGroupChat,
    groupID,
    darkMode,
    isCreateGroup, setIsCreateGroup, 
    isJoinGroup, setIsJoinGroup,
    groupOptionClicked, setGroupOptionClicked,
    showNewGroupName,
    fetchGroupDetail, 
    showSearch, setShowSearch, searchResult, setSearchResult,
    showSettings, setShowSettings, showChangeUsername, setShowChangeUsername,
    showChangePassword, setShowChangePassword } = useGlobalContext();

  const [isSideOpen, setIsSideOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideOpen(prevState => !prevState);
  }

  // Get groupchat details
  useEffect(() => {
    fetchGroupDetail(groupID);
  }, [groupID]);

  useEffect(() => {
    const interval = setInterval(() => {
      getPendingRequests(userID);
      getFriendList(userID);
      getGroups(userID);
    }, 7500);
    getPendingRequests(userID);
    getFriendList(userID);
    getGroups(userID);

    return () => clearInterval(interval);
  }, [userID]);


  useEffect(() => {
    getFriendList(userID);
    getGroups(userID);
      // eslint-disable-next-line

  }, [])


  const showCreateDialog = () => {
    setGroupOptionClicked(!groupOptionClicked);
    setIsCreateGroup(!isCreateGroup);
  }

  const showJoinDialog = () => {
    setGroupOptionClicked(!groupOptionClicked);
    setIsJoinGroup(!isJoinGroup);
  }

  return (
    <DashboardStyled 
      style={{
        backgroundColor: darkMode ? '#323c5ff8' : '#f8f7f7e1',
        transition: 'all 1s ease-in-out'
      }}>
        {!showChat && !showGroupChat && <Header />}
        <div className='content' onClick={() => setShowSettings(false)}>
            <NavMenu showChat={showChat} showGroupChat={showGroupChat} />
            <div className="main-content-box">
              <div
                style={{
                  color: darkMode ? '#fff' : '#000'
                }}
                className="side-menu-button" onClick={toggleSideMenu}>{menuIcon}</div>
              <div className="main-content">
                { showSettings && <SettingsBox />}
                { showChangeUsername && <SetDisplayName />}
                { showChangePassword && <ChangePassword />}
                { showSearch && <SuggestionList />}
                { showChat && <ChatBox /> }
                { isSideOpen && <SideMenu /> }
                { isCreateGroup && <CreateGroup /> }
                { isJoinGroup && <JoinGroup /> }
                { showGroupChat && <GroupChatBox />}
                { showNewGroupName && <ChangeGroupName />}
                { !showChat && !showGroupChat && !groupOptionClicked && (
                  <>
                    <div className="group-links">
                      <span
                        style={{
                          backgroundColor: darkMode ? '#f8f6f6d3' : '#002c6a',
                          color: darkMode ? '#000' : '#fff',
                        }} 
                        onClick={showCreateDialog}>Create a group</span>
                      <span
                        style={{
                          backgroundColor: darkMode ? '#f8f6f6d3' : '#002c6a',
                          color: darkMode ? '#000' : '#fff',
                        }} 
                        onClick={showJoinDialog}>Join a group</span>
                    </div>
                  </>
                )}
              </div>
            </div>
        </div>
    </DashboardStyled>
  )
}

const DashboardStyled = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;

  .content {
    display: flex;
    height: 100%;
    width: 100%;

    .main-content-box {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      
      .side-menu-button {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 0px;
        margin: 0px;
        cursor: pointer;
      }
      .main-content {
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 80%;
        padding: 0 0.5rem;

        .group-links {
          width: 100%;
          height: 10%;
          display: flex;
          justify-content: center;
          gap: 1rem;
          align-items: center;
          transition: all 0.3s ease, color 0.3s ease;

          span {
            padding: 1rem;
            background-color: #002c6a;
            display: flex;
            color: #fff;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 70%;
            width: 30%;
            &:hover {
                background-color: #4f70b4cc !important;
            }
            transition: all 0.2s linear;
            cursor: pointer;
            border-radius: 0.5rem;
        }

        }
      }
    }
  }
`

export default Dashboard;