import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext'
import { InputAdornment } from '@mui/material';
import { TextField } from '@mui/material'
import Box from '@mui/material/Box';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function AddFriend() {
  const { userID, setShowSearch, searchResult, setSearchResult } = useGlobalContext();
  const [keyword, setKeyword] = useState('')


  const findFriends = async () => {
    if (!keyword) {
        return;
    } 
    try {
        const response = await axios.post('/find-friends', { userID, keyword: keyword});
        if (response.data.error) {
            toast.error(response.data.error)
            return;
        }
        // console.log(response.data.suggestedFriends);
        setSearchResult(response.data.suggestedFriends);
        setShowSearch(true)

    } catch (error) {
        console.log(error)
    }
  }
  return (
    <AddFriendStyled>
        <TextField
            name="add-friend"
            placeholder="Enter keyword..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            type={"text"}
            size="small"
            required
            autoComplete="off"
            style={{ background: "#fff", borderRadius: "5px" }}
            sx={{'& ::placeholder':{fontSize:'70%'}}}
            InputLabelProps={{ shrink: true }}
            InputProps={{
                style: { fontSize: '65%' },
                endAdornment: <InputAdornment position="start">
                    <IconButton onClick={() => findFriends()}type="button" aria-label="search" edge="end">
                        <SearchIcon />
                    </IconButton>
                </InputAdornment>
            }}
        />
    </AddFriendStyled>
  )
}

const AddFriendStyled = styled.div`
    /* background-color: #fff; */
    display: flex;
    color: #000;
    width: 50%;
    align-items: center;
    padding: 1.5rem 0.5rem;

`

export default AddFriend