import React from 'react'
import ReactDOM from 'react-dom'
import './css/normalize.css'
import './css/timeline.css'
import './css/login.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Timeline from './componentes/Timeline'
import Login from './componentes/Login'
import Logout from './componentes/Logout'

const authCheck = (nextState, replace) => {
  if (!nextState.match.params.login && !window.localStorage.getItem('auth-token')) {
    return <Redirect push from='/timeline' to={{ pathname: '/', state: { msg: 'Você precisa estar logado.' } }} />
  }
  return <Timeline login={nextState.match.params.login} />
}

ReactDOM.render(
  <Router>
    <App>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/timeline/:login?' render={authCheck} />
        <Route path='/logout' component={Logout} />
      </Switch>
    </App>
  </Router>,
  document.getElementById('root')
)
registerServiceWorker()
