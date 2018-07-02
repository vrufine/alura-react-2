import React from 'react';
import ReactDOM from 'react-dom';
import './css/normalize.css'
import './css/timeline.css'
import './css/login.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Timeline from './componentes/Timeline';
import Login from './componentes/Login';

ReactDOM.render(
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/timeline" component={Timeline} />
      </Switch>
    </App>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();