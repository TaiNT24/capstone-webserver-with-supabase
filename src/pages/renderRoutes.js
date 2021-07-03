import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

const renderRoutes = (routes, authed, authPath, extraProps = {}, switchProps = {}) => {

  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={(props) => {
            // !route.restricted
            if( authed || route.path === authPath) {
              return <route.component {...props} {...extraProps} route={route}/>
            }

            if(!authed){
              const redirPath = authPath ? authPath : '/login'
              return <Redirect to={{pathname: redirPath, state: {from: props.location}}}/>
            }
          }}
        />
      ))}
    </Switch>
  ) : null
}

export default renderRoutes;