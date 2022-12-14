import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

import Logo from '../assets/logo.svg';
import { toastOptions } from '../assets/toastOptions';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: ""
  });

  //  IF THERE IS A CONNECTED USER, THERE IS NO NEED TO LOGIN
  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/')
    }
  }, []);

  const handelSubmit = async e => {
    e.preventDefault();
    console.log('logging in...')
    if (handleValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions)
      }
      if (data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        navigate("/");
      }
    }
  }

  const handleValidation = () => {
    const { username, password } = values;

    if (password.trim() === "") {
      toast.error('Email and password are required', toastOptions);
      return false;
    } else if (username.trim() === "") {
      toast.error('Email and password are required', toastOptions);
      return false;
    }
    return true;
  }

  const handleChange = ({ target }) => {
    setValues({ ...values, [target.name]: target.value })
  }

  return (
    <>
      <FormContainer >
        <form onSubmit={handelSubmit}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input type="text" placeholder='Username' name="username" onChange={handleChange} min="3" />
          <input type="password" placeholder='Password' name="password" onChange={handleChange} />
          <button type="submit">
            Log in
          </button>
          <span>Don't have an account?
            <Link to="/register">
              &nbsp;Register
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

export default Login;