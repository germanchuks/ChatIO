import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-hot-toast';

function SentRequests() {
  const { userID, darkMode } = useGlobalContext();
  const [sentRequests, setSentRequests] = useState([]);
  
  // Fetch sent requests
  const getSentRequests = async (userID) => {
    try {
        const response = await axios.get(`/get-sent-requests/${userID}`)
        if (response.data.error) {
            console.log(response.data.error)
            return;
        }
        setSentRequests(response.data.sentRequests)
    } catch (error) {
        console.log(error)
    }
  }

  // Cancel requests
  const cancelRequest = async (email) => {
    try {
        const response = await axios.post(`/cancel-friend-request`, {userID, email})
        if (response.data.error) {
            toast.error('Error occured. Try again later')
            console.log(response.data.error)
            return;
        }
        getSentRequests();
        toast.success('Request cancelled')
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getSentRequests(userID);
    }, 7500);

    getSentRequests(userID);

    return () => clearInterval(interval);
  }, [userID]);


  return (
    <SentRequestsStyled style={{
        border: darkMode ? "none" : "1.5px solid #000",
    }}>
        <h4>Sent Requests</h4>
        <div className='sent-request-list'>
            {sentRequests?.length ? (
                sentRequests.map((request) => {
                    return (
                        <div className='request-item' key={request._id}>
                            <div className="request-details">
                                <span>{request.userName} - {request.userEmail}</span>
                            </div>
                            <div className='request-buttons'>
                                <span
                                    className='cancel-button'
                                    onClick={() => cancelRequest(request.userEmail)}
                                >Cancel</span>
                            </div>
                        </div>
                    )
                })
            ) : <div className='no-new-request'>No requests</div>
            }
        </div>
    </SentRequestsStyled>
  )
}

const SentRequestsStyled = styled.div`
    height: 50%;
    width: 100%;
    font-size: small;
    box-shadow: rgb(255, 255, 255) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

    h4 {
        border-bottom: 1.5px solid #000;
        padding: 0.4rem;
    }
    .sent-request-list {
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
            color: #fbfbfc;

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

                .cancel-button {
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

export default SentRequests;