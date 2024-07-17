import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext'
import { closeIcon, addUserIcon, okayIcon, friendsIcon } from '../utils/icons';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function SuggestionList() {
    const { userID, friends, keyword, setKeyword, searchResult, setShowSearch } = useGlobalContext();
    const [requestSentIndex, setRequestSentIndex] = useState(null);
    // const [visibleCount, setVisibleCount] = useState(5);
    
    // const handleSeeMore = () => {
    //     setVisibleCount(prevCount => prevCount + 5);
    // }

    const [page, setPage] = useState(0);
    const resultsPerPage = 5;

    const handleSeeMore = () => {
        setPage(prevPage => prevPage + 1);
    }

    const handleSeePrevious = () => {
        setPage(prevPage => Math.max(prevPage - 1, 0));
    }

    const startIndex = page * resultsPerPage;
    const visibleResults = searchResult.slice(startIndex, startIndex + resultsPerPage);


    const addFriend = async (email, index) => {
        try {
            const response = await axios.post('/send-friend-request', { userID, email });
            toast.loading('Searching...');
            if (response.data.error) {
                toast.error(response.data.error);
                return;
            }
            toast.success(response.data.message);
            console.log(response.data.message)
            setRequestSentIndex(index)
        } catch (error) {
            toast.error('An error occurred. Please try again later.');
        }
    };

    const closeSearch = () => {
        setShowSearch(false)
        setKeyword('');
    }

  return (
    <SuggestionListStyled>
        <div className='header'>
            <span>{searchResult.length ? 'Search Results' : ''}</span>
            <span onClick={() => closeSearch()} className='close-button'>
                {closeIcon}
            </span>
        </div>
        <div className="search-container">
            {searchResult.length ? (
                visibleResults.map((result, index) => (
                    <div className="search-item" key={result._id}>
                        <div className="user-details">
                            <div>{result.username}</div>
                            <span>{result.email}</span>
                        </div>
                        {friends.some(friend => friend.friendEmail === result.email) ? (
                            <div className="add-button">
                                {friendsIcon}
                            </div>
                        ) : requestSentIndex === startIndex + index ? (
                            <div className="add-button">
                                {okayIcon}
                            </div>
                        ) : (
                            <div className="add-button" onClick={() => addFriend(result.email, startIndex + index)}>
                                {addUserIcon}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className='no-user-found'>Sorry. No user found</div>
            )}
            <div className="pagination-buttons">
                {page > 0 && (
                    <div className="see-previous-button" onClick={handleSeePrevious}>
                        See Previous
                    </div>
                )}
                {searchResult.length > startIndex + resultsPerPage && (
                    <div className="see-more-button" onClick={handleSeeMore}>
                        See More
                    </div>
                )}
            </div>
        </div>
    </SuggestionListStyled>
  )
}

const SuggestionListStyled = styled.div`
    position: fixed;
    left: 37%;
    top: 12.5%;
    width: 30%;
    height: fit-content;
	background: #233142; 
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
    color: #ffffff;
    display: flex;
    font-size: small;
    flex-direction: column;
    border-radius: 0.5rem;
    padding: 0.5rem 0.5rem 1rem;

    .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.8rem;
        align-items: center;
        border-bottom: 1px solid #000;
        padding: 0.5rem 0;

        .close-button {
            cursor: pointer;
            display: flex;
            justify-content: center;
            border-radius: 50%;
            background-color: #000;
            align-items: center;
            &:hover {
                background-color: #fff;
                color: #000;
            }
        }
    }

    .search-container {
        width: 100%;
        height: 80%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 0.2rem;

        .search-item:last-child {
            border: none;
        }
        .search-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #000;
            padding: 0.5rem 0.2rem;
            background-color: #263b53e4;

            .add-button {
                background-color: #000000;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0.5rem;
                border-radius: 50%;
                cursor: pointer;
                &:hover {
                    background-color: #fffefe;
                    color: #000000
                }
                transition: all 0.3s linear;
            }
        }
        .no-user-found {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .pagination-buttons {
            font-size: 65%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-style: italic;
            padding-top: 0.5rem;

        }
    }
`
export default SuggestionList