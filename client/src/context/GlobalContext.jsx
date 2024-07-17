import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const [user, setUser] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userID, setUserID] = useState('');
    const [darkMode, setDarkMode] = useState(null);


    // Dialog Boxes
    const [ showChangeUsername, setShowChangeUsername ] = useState('');
    const [ showChangePassword, setShowChangePassword ] = useState('');
    const [ showSearch, setShowSearch ] = useState(false);
    const [showNewGroupName, setShowNewGroupName] = useState(false);
    const [ isCreateGroup, setIsCreateGroup ] = useState(false);
    const [ isJoinGroup, setIsJoinGroup ] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [keyword, setKeyword] = useState('')
    const [ searchResult, setSearchResult] = useState([]);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [recipientID, setRecipientID] = useState([]);
    const [ groupOptionClicked, setGroupOptionClicked ] = useState(false);

    const [showChat, setShowChat] = useState(false);
    const [ showGroupChat, setShowGroupChat ] = useState(false);
    
    const [ recentInteraction, setRecentInteraction ] = useState({})

    const [chatID, setChatID] = useState("");
    const [ groupID, setGroupID ] = useState('');

    const [friends, setFriends] = useState([]);
    const [groups, setGroups] = useState([]);

    const [pendingRequests, setPendingRequests] = useState([]);
    const [currentChatDetails, setCurrentChatDetails] = useState({});


    // Handle User Login
    const login = async (inputs) => {
        const response = await axios.post('auth/login', inputs)
        return response;
    }

    // Handle User Registration
    const register = async (inputs) => {
        return await axios.post('auth/register', inputs)
    }

    // Handle User Logout
    const logout = async () => {
        await axios.post('auth/logout')
        setUser(null);
        setUserID(null);
        setIsAuthenticated(false);
    }

    // Get friend list
    const getFriendList = async (userID) => {
        try {
            const response = await axios.get(`/get-friends/${userID}`)
            if (response.data.error) {
                console.log(response.data.error)
                return;
            }
            setFriends(response.data.friendList)
        } catch (error) {
            console.log(error)
        }
    }

    // Get group
    const getGroups = async (userID) => {
        try {
            const response = await axios.get(`/get-groups/${userID}`)
            if (response.data.error) {
                console.log(response.data.error)
                return;
            }
            setGroups(response.data.groups)
        } catch (error) {
            console.log(error)
        }
    }


    // Get pending friend requests
    const getPendingRequests = async (userID) => {
    try {
        const response = await axios.get(`/get-pending-requests/${userID}`)
        if (response.data.error) {
            console.log(response.data.error)
            return;
        }
        setPendingRequests(response.data.pendingRequests)
    } catch (error) {
        console.log(error)
    }
  }

  const fetchGroupDetail = async (groupID) => {
    try {
        if (groupID) {
            const response = await axios.get(`/get-group-details/${groupID}`);
            if (response.data.error) {
            console.log(response.data.error);
            return;
            }
            const groupInfo = response.data.group;
            setCurrentChatDetails({
                name: groupInfo.groupName,
                members: groupInfo.members,
                admin: groupInfo.admin
            });
        } else {
            return;
        }
        } catch (error) {
        console.log(error);
        }
    };

    const getRecentInteraction = async (userID) => {
        try {
            const response = await axios.get(`/get-info/${userID}`)
            if (response.data.error) {
                console.log(response.data.error);
                return;
            }
            setRecentInteraction(response.data.recentInteraction);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <GlobalContext.Provider value={{
            user, setUser, userEmail, setUserEmail,
            userID, setUserID,
            isAuthenticated, setIsAuthenticated,
            login, register, logout,
            recipientID, setRecipientID,
            chatID, setChatID, showChat, setShowChat,
            darkMode, setDarkMode,
            showSearch, setShowSearch,
            searchResult, setSearchResult,
            keyword, setKeyword,
            getFriendList, friends, setFriends,
            getGroups, groups, setGroups,
            groupID, setGroupID,
            showGroupChat, setShowGroupChat, isCreateGroup, setIsCreateGroup,
            setShowNewGroupName, showNewGroupName,
            isJoinGroup, setIsJoinGroup,
            groupOptionClicked, setGroupOptionClicked,
            getPendingRequests, pendingRequests, setPendingRequests,
            currentChatDetails, setCurrentChatDetails,
            fetchGroupDetail,
            showSettings, setShowSettings,
            getRecentInteraction, recentInteraction, showChangeUsername, setShowChangeUsername,
            showChangePassword, setShowChangePassword
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}