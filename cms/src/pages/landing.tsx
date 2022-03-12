import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {UserContext} from '../hooks/user-context';
import Loading from "../components/loading";

export default function Landing() {
  const {user, isLoading} = useContext(UserContext);

  if (isLoading) {
    return <Loading />;
  }

  return user ? <Navigate to='/home' /> : <Navigate to='/login' />
}
