import { createContext, useContext, useState } from "react";
import axios from 'axios';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const [user, setUser] = useState('');
    const [userID, setUserID] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [recipientID, setRecipientID] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [chatID, setChatID] = useState("");
    const [friends, setFriends] = useState([]);
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
        setAvatar('');
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
        // console.log(response.data.friendList)
        setFriends(response.data.friendList)
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

    return (
        <GlobalContext.Provider value={{
            user, setUser,
            userID, setUserID,
            isAuthenticated, setIsAuthenticated,
            avatar, setAvatar,
            login, register, logout,
            recipientID, setRecipientID,
            chatID, setChatID, showChat, setShowChat,
            getFriendList, friends, setFriends,
            getPendingRequests, pendingRequests, setPendingRequests,
            currentChatDetails, setCurrentChatDetails
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}