import React, { Component } from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import CustomLayout from '../container/layout'

import Login from '../pages/auth/login'
import Tasks from '../pages/tasks'
import Create from '../pages/users/create'
import AuthLayout from '../container/auth-layout'
import Teams from '../pages/teams'
import ME from '../graphql/users/queries/ME'
import { useQuery } from '@apollo/client'

//@ts-ignore
const PrivateRoute = ({ component, ...rest }) => {
  const { data } = useQuery(ME, {
    fetchPolicy: 'cache-first',
  })
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem('token') ? (
          React.createElement(
            CustomLayout,
            props,
            React.createElement(component, {
              ...props,
              me: data?.me,
            }),
          )
        ) : (
          <Redirect
            to={{
              pathname: '/auth/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}
//@ts-ignore
const GuestRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('token') ? (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location },
          }}
        />
      ) : (
        React.createElement(
          AuthLayout,
          props,
          React.createElement(component, props),
        )
      )
    }
  />
)
const Routes = () => (
  <Router>
    <Switch>
      <PrivateRoute path='/teams' exact component={Teams} />
      <PrivateRoute path='/' exact component={Tasks} />
      <PrivateRoute
        path='/users/create'
        exact
        component={Create}
      />
      <GuestRoute
        path='/auth/login'
        exact
        component={Login}
      />
    </Switch>
  </Router>
)

export default Routes
