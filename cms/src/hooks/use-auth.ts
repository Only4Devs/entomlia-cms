import {useEffect, useState} from 'react';
import axios from 'axios';
import {API_URL} from '../config';
import {TOKEN_KEY, getHeaderOptions} from '../lib/request-helper';

const useAuth = () => {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const logout = async () => {
    setUser(null);
  }

  //set user
  const setUserContext = async () => {
    try {
      const res: any = await axios.get(`${API_URL}/profile`, getHeaderOptions());
      setUser(res.data);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setError(err.response.data);
      return null;
    }
  }

  //register user
  const registerUser = async (data: any) => {
    const {username, email, password, passwordConfirm} = data;
    return axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
      passwordConfirm
    }).then(async (response) => {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      await setUserContext();
      return response.data;
    }).catch((err) => {
      return setError(err.response.data);
    })
  };

  //login user
  const loginUser = async (data: any) => {
    const {username, password} = data;
    try {
      const response = await axios.post(`${API_URL}/auth`, {
        login: username,
        password,
      });
      localStorage.setItem(TOKEN_KEY, response.data.token);
      // await setUserContext();
      return response.data;
    } catch (err: any) {
      setError(err.response.data);
      throw new Error(err.response.data);
    }
  };

  async function getProfile() {
    try {
      const res = await axios.get(`${API_URL}/profile`, getHeaderOptions())
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      throw new Error(err);
    }
  }

  return {
    registerUser,
    loginUser,
    logout,
    error,
    isLoading,
    user,
    setUser,
    getProfile,
    setUserContext,
  }
}

export default useAuth
