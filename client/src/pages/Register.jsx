import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
// import { homeIcon } from '../utils/icons';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { ButtonStyled, DivStyled } from '../components/FormComponentsStyled';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";

const Register = () => {

  const { register } = useGlobalContext()

  const navigate = useNavigate()

  const defaultInput = {
    username: "",
    email: "",
    password: "",
    confirm: "",
  }
  const [inputs, setInputs] = useState(defaultInput)

  // Handle Input change
  const handleChange = (e) => {
    setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }))
  }

  // Handle password visibility
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false
  });

  // Handle password visibility toggle
  const handleClickShowPassword = (fieldName) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  //Send user input to endpoint
  const registerUser = async (e) => {
    e.preventDefault();
    const { username, email, password } = inputs;

    try {
      // Check if passwords match
      if (inputs.password !== inputs.confirm) {
        toast.error("Passwords do not match!")
        return;
      } else {
        const response = await register({ username, email, password })
        if (response.data.error) {
          toast.error(response.data.error)
          return;
        } else {
          setInputs(defaultInput)
          toast.success('Account created. Proceed to login')
          navigate('/')
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <RegistrationStyled>
      <div className="reg-form-container">

        <Box
          component="form"
          onSubmit={registerUser}
          sx={{
            height: '100%',
            '& .MuiTextField-root': { width: '100%' },
          }}
        >
          <DivStyled>
            <div className='register-header'><h3>Create a new account</h3></div>
            <TextField
              name='username'
              value={inputs.username}
              type="text"
              label='Full Name'
              onChange={handleChange}
              variant="outlined"
              size='small'
              autoFocus
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { fontSize: 14 } }}
              required

            />
            <TextField
              name='email'
              value={inputs.email}
              type="email"
              label='Email'
              size='small'
              onChange={handleChange}
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
            <TextField
              required
              name='confirm'
              value={inputs.confirm}
              type={showPassword.confirm ? "text" : "password"}
              label='Re-enter Password'
              onChange={handleChange}
              variant="outlined"
              size='small'
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword('confirm')}
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <ButtonStyled>Sign up</ButtonStyled>
            <b>Already have an account?<Link to='/'> Login</Link> </b>
          </DivStyled>
        </Box>
      </div>
    </RegistrationStyled>
  )
};

const RegistrationStyled = styled.div`
  color: #000 !important;
  background-color: #002c6a;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;



  .reg-form-container {
    height: auto;
    width: 350px;

    b, .register-header {
        display: flex;
        justify-content: center;
        gap: 0.3rem;
        padding-bottom: 0.7rem;
      }
  }
`


export default Register