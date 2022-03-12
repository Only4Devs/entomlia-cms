import React, {useContext} from 'react';
import {Route, Navigate} from 'react-router-dom';
import {UserContext} from '../hooks/user-context';
import Loading from './../components/loading';

export default function PrivateRoute(props: any) {
  const {user, isLoading} = useContext(UserContext);
  const {component: Component, ...rest} = props;

  if (isLoading) {
    return <Loading />
  }
  if (user) {
    return (
      // <Route {...rest} render={(props: any) =>
      //   (<Component {...props}/>)
      props.children
      // }
      // />
    )
  }

  return <Navigate to='/login' />
}
