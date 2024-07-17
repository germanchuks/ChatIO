import React, { useState, useEffect } from "react";
import { useGlobalContext } from '../context/GlobalContext';
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
// import { homeIcon } from '../utils/icons';
import Box from '@mui/material/Box';
import { ButtonStyled, DivStyled } from '../components/FormComponentsStyled';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import axios from 'axios';
// import background from '../img/login-background.jpg'


const Login = () => {

  const { login, setUser, darkMode, setDarkMode, setUserEmail, setUserID, setIsAuthenticated } = useGlobalContext()

  // initialize navigation
  const navigate = useNavigate()

   // Set theme
  const setUserTheme = (data) => {
    if (data === 'light') {
      setDarkMode(false)
    } else {
      setDarkMode(true)
    }
  }

  // Check for active user session
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {

        const response = await axios.get('/user');
        if (response.data.error) {
          toast.error('Session ended. Please enter username and password')
        } else {
          // Set authenticatication
          setIsAuthenticated(true)

          // Set User Id
          setUserID(response.data.id)

          //Set User Name
          setUser(response.data.username)
          setUserEmail(response.data.email);
          setUserTheme(response.data.theme);
  
          toast.success('Welcome back')
          navigate('/dashboard');
        }
      } catch {
        return;
      }
    }
    fetchCurrentUser();
    // eslint-disable-next-line
  }, [])


  // No active session, authenticate user
  const defaultInput = {
    email: "",
    password: "",
  }
  const [inputs, setInputs] = useState(defaultInput)

  const handleChange = (e) => {
    setInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }))
  }

  // Handle password visibility
  const [showPassword, setShowPassword] = useState({
    password: false,
  });

  // Handle password visibility toggle
  const handleClickShowPassword = (fieldName) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

 

  // Handle submit
  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = inputs;
    try {
      const response = await login({ email, password })
      if (response.data.error) {
        toast.error(response.data.error)
      } else {
        // Set authentication to true
        setIsAuthenticated(true);
          console.log(response.data);

        // Set User Id
        setUserID(response.data.id)

        // Empty input fields 
        setInputs(defaultInput)

        //Set User Name
        setUser(response.data.username)

        setUserTheme(response.data.theme)

        // Navigate to user dashboard
        navigate('/dashboard');
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <LoginStyled>
      <span className='welcome-banner'>
        <div className="main-title">
          CHAT IO
        </div>
        <div className="sub-title">
          Connect Instantly, Converse Seamlessly.
        </div>
      </span>
      <div className="login-form-container">
        <Box
          component="form"
          onSubmit={loginUser}
          sx={{
            height: '100%',
            '& .MuiTextField-root': { width: '100%' },
          }}
        >
          <DivStyled>
            <br />

            <TextField
              name='email'
              value={inputs.email}
              type="email"
              label='Email'
              size='small'
              onChange={handleChange}
              autoFocus
              InputLabelProps={{ shrink: true }}
              InputProps={{ style: { fontSize: 14 } }}
              variant="outlined"
              required
            />
            <TextField
              required
              name='password'
              value={inputs.password}
              type={showPassword.password ? "text" : "password"}
              label='Password'
              onChange={handleChange}
              variant="outlined"
              size='small'
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword('password')}
                      edge="end"
                    >
                      {showPassword.password ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <ButtonStyled>Sign in</ButtonStyled>
            <b>Dont have an account?<Link to='/register'> Sign up</Link> </b>
          </DivStyled>
        </Box>
      </div>
    </LoginStyled>
  )
};

const LoginStyled = styled.div`
  color: #000 !important;
  background-color: #002c6a;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;

  .welcome-banner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    
    .main-title {
      font-weight: 900;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      font-size: 3rem;
    }

    .sub-title {
      font-style: italic;
    }
  }

  .login-form-container {
    height: auto;
    width: 350px;

    b, .sign-in-header {
        display: flex;
        justify-content: center;
        gap: 0.3rem;
        padding-bottom: 0.7rem;
      }
  }
`


export default Login;