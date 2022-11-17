import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

import Logo from '../assets/logo.svg';
import { toastOptions } from '../assets/toastOptions';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';

function Register() {
  const navigate = useNavigate();
  const [ values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  //////////  IF A USER IS CONNECTED, NAVIGATE TO THE CHAT
  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/')
    }
  }, []);
  
  //////////  SUBMITTING FUNCTION
  const handelSubmit = async e => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = values; 
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions)
      }
      if(data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.newUser))
      }
      navigate("/");
   }
  }

  //////////  CREDENTIALS VALIDATOR
  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;

    if (password.trim() !== confirmPassword.trim()) {
      toast.error('password and confirm password should have the same value', toastOptions);
      return false;
    } else if (username.trim().length < 3) {
      toast.error('User\'s name should be longer than 3 characters', toastOptions);
      return false;
    } else if (password.trim().length < 8) {
      toast.error('Password should be at least 8 characters', toastOptions);
      return false;
    } else if (email.trim() === "" ) {
      toast.error('Email is required', toastOptions);
      return false;
    }
    return true;
  }

  const handleChange = ({ target }) => {
    setValues({...values, [target.name]: target.value })
  }

  return (
    <>
      <FormContainer >
        <form onSubmit={handelSubmit}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input type="text" placeholder='Username' name="username" onChange={handleChange} />
          <input type="email" placeholder='Email' name="email" onChange={handleChange} />
          <input type="password" placeholder='Password' name="password" onChange={handleChange} />
          <input type="password" placeholder='Confirm Password' name="confirmPassword" onChange={handleChange} />
          <button type="submit">
            Create User
          </button>
          <span>Already have an account?
            <Link to="/login">
              &nbsp;Login
            </Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Register;