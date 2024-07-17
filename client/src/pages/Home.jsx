import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/GlobalContext'
import { useNavigate } from 'react-router-dom'

function Home() {

    const { isAuthenticated } = useGlobalContext();
    const navigate = useNavigate()

    return (
        <HomeStyled>
            Welcome to ChatIO
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
        </HomeStyled>
  )
}

const HomeStyled = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
`

export default Home