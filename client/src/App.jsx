import React from 'react'
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useGlobalContext } from './context/GlobalContext';
import Dashboard from './pages/Dashboard';
import Protected from './pages/Protected';
import Login from './pages/Login';
import Register from './pages/Register';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

function App() {
  const { isAuthenticated } = useGlobalContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Protected isAuthenticated={isAuthenticated}><Dashboard /></Protected>
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
      <AppStyled>
        <Toaster
  
          position='top-center'
          
          toastOptions={{
            duration: 1500

        }} />
        <RouterProvider router={router} />
      </AppStyled>
  )
}

const AppStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`

export default App