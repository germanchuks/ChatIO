import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-hot-toast';


function PendingRequests() {
  const { userID, darkMode, pendingRequests, getFriendList, getPendingRequests } = useGlobalContext();  

  const acceptFriendRequest = async (friendID) => {
    try {
        const response = await axios.post(`/accept-request`, {userID, friendID})
        if (response.data.error) {
            console.log(response.data.error)
            return;
        }
        getFriendList(userID);
        getPendingRequests(userID);
        toast.success('Friend request accepted')

    } catch (error) {
        console.log(error)
    }
    
  }

  const declineFriendRequest = async (friendID) => {
    try {
        const response = await axios.post(`/decline-request`, {userID, friendID})
        if (response.data.error) {
            console.log(response.data.error)
            return;
        }

        getFriendList(userID);
        getPendingRequests(userID);
        toast.success('Request declined')

    } catch (error) {
        console.log(error)
    }
  }

  return (
    <PendingRequestsStyled style={{
        border: darkMode ? "none" : "1.5px solid #000"
    }}>
        <h4>Friend Requests</h4>
        <div className='pending-request-list'>
            {pendingRequests?.length ? (
                pendingRequests.map((request) => {
                    return (
                        <div className='request-item' key={request._id}>
                            <div className="request-details">
                                <span>{request.userName} - {request.userEmail}</span>
                            </div>
                            <div className='request-buttons'>
                                <span
                                    className='accept-button'
                                    onClick={() => acceptFriendRequest(request.userID)}
                                >Accept</span>
                                <span className='decline-button' onClick={() => declineFriendRequest(request.userID)}>Decline</span>
                            </div>
                        </div>
                    )
                })
            ) : <div className='no-new-request'>No requests</div>
            }
        </div>
    </PendingRequestsStyled>
  )
}

const PendingRequestsStyled = styled.div`
    height: 50%;
    width: 100%;
    font-size: small;
    box-shadow: rgb(255, 255, 255) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    
    h4 {
        border-bottom: 1.5px solid #000;
        padding: 0.4rem;
    }

    .pending-request-list {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 90%;
        gap: 0.2rem;

        .request-item {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.4rem;
            flex-direction: column;
            background-color: #263b53e4;

            .request-details {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.2rem;
            }

            .request-buttons {
                display: flex;
                gap: 1.5rem;
                font-size: smaller;

                .accept-button {
                    cursor: pointer;
                    color: #000;
                    padding: 0.2rem;
                    border-radius: 0.4rem;
                    &:hover {
                        background-color: #000;
                        color: #fbfbfc;
                    }
                }

                .decline-button {
                    cursor: pointer;
                    color: #000;
                    padding: 0.2rem;
                    border-radius: 0.4rem;
                    &:hover {
                        background-color: #000;
                        color: #fbfbfc;
                    }
                }

                span {
                    background-color: #fbfbfc;
                    color: #000;
                }
            }
        }


    }

    .no-new-request {
        height: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: smaller;
    }
`

export default PendingRequests;